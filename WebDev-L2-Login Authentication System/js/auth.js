/**
 * Authentication business logic module.
 * Handles validation rules, registration, secure credential verification,
 * session management, route guarding, and logout operations.
 */

const AppAuth = (function () {
  const GENERIC_AUTH_ERROR = 'Invalid username/email or password';

  /**
   * Validates password according to requirements:
   * 1. Minimum 8 characters
   * 2. At least 1 number (0-9)
   * @param {string} password 
   * @returns {{ isValid: boolean, hasMinLength: boolean, hasNumber: boolean, errors: string[] }}
   */
  function validatePassword(password) {
    const pwd = typeof password === 'string' ? password : '';
    const hasMinLength = pwd.length >= 8;
    const hasNumber = /\d/.test(pwd);
    const errors = [];

    if (!hasMinLength) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!hasNumber) {
      errors.push('Password must contain at least 1 number');
    }

    return {
      isValid: hasMinLength && hasNumber,
      hasMinLength,
      hasNumber,
      errors
    };
  }

  /**
   * Registers a new user.
   * Performs validation, duplicate checks, cryptographic salting & hashing,
   * and stores the user record without plain-text passwords.
   * @param {Object} params
   * @param {string} params.username
   * @param {string} params.email
   * @param {string} params.password
   * @returns {Promise<{ success: boolean, error?: string, user?: Object }>}
   */
  async function register({ username, email, password }) {
    const cleanUsername = (username || '').trim();
    const cleanEmail = (email || '').trim();
    const pwd = password || '';

    // 1. Basic Form Validation: Check for empty submissions
    if (!cleanUsername) {
      return { success: false, error: 'Username is required' };
    }
    if (!cleanEmail) {
      return { success: false, error: 'Email address is required' };
    }
    if (!pwd) {
      return { success: false, error: 'Password is required' };
    }

    // 2. Password Strength Validation (>= 8 chars and at least 1 number)
    const pwdCheck = validatePassword(pwd);
    if (!pwdCheck.isValid) {
      return { success: false, error: pwdCheck.errors.join('. ') + '.' };
    }

    // 3. Duplicate username/email check
    const duplicateCheck = AppStorage.checkDuplicate(cleanUsername, cleanEmail);
    if (duplicateCheck.exists) {
      return {
        success: false,
        error: `A user with this ${duplicateCheck.field} already exists. Please choose another or sign in.`
      };
    }

    try {
      // 4. Secure Hashing with unique cryptographic salt (Never plain text)
      const salt = AppCrypto.generateSalt(16);
      const passwordHash = await AppCrypto.hashPassword(pwd, salt);

      const newUser = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
        username: cleanUsername,
        email: cleanEmail,
        salt: salt,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      AppStorage.addUser(newUser);

      return {
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        }
      };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: 'An unexpected error occurred during registration.' };
    }
  }

  /**
   * Authenticates user credentials.
   * On failure, intentionally returns a generic error to prevent user enumeration.
   * @param {Object} params
   * @param {string} params.identifier - username or email
   * @param {string} params.password - plain-text password to verify
   * @param {boolean} [params.remember=true]
   * @returns {Promise<{ success: boolean, error?: string, session?: Object }>}
   */
  async function login({ identifier, password, remember = true }) {
    const cleanId = (identifier || '').trim();
    const pwd = password || '';

    // 1. Basic Form Validation: Check empty inputs
    if (!cleanId || !pwd) {
      return { success: false, error: 'Please enter both your username/email and password.' };
    }

    // 2. Lookup user record
    const user = AppStorage.findUserByIdentifier(cleanId);

    // If user is not found, return generic error (do not reveal non-existence)
    if (!user || !user.salt || !user.passwordHash) {
      return { success: false, error: GENERIC_AUTH_ERROR };
    }

    try {
      // 3. Hash supplied password with user's specific salt
      const computedHash = await AppCrypto.hashPassword(pwd, user.salt);

      // 4. Compare hash values
      if (computedHash !== user.passwordHash) {
        // Return same generic error (do not reveal that username was valid)
        return { success: false, error: GENERIC_AUTH_ERROR };
      }

      // 5. Update user's lastLogin timestamp
      const nowIso = new Date().toISOString();
      user.lastLogin = nowIso;
      AppStorage.updateUser(user);

      // 6. Create active session
      const session = {
        sessionId: 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
        userId: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        loginAt: nowIso
      };

      AppStorage.setActiveSession(session, remember);

      return { success: true, session };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'An unexpected error occurred during login.' };
    }
  }

  /**
   * Protects pages from unauthorized access.
   * Immediately redirects to login page if no active session exists.
   * @param {string} [redirectUrl='login.html']
   * @returns {Object|null} The active session if authorized, otherwise redirects
   */
  function requireAuth(redirectUrl = 'login.html') {
    const session = AppStorage.getActiveSession();
    if (!session || !session.userId) {
      const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
      window.location.replace(`${redirectUrl}?unauthorized=true&redirect=${encodeURIComponent(currentPath)}`);
      return null;
    }
    return session;
  }

  /**
   * Logs the current user out, destroying the session and redirecting.
   * @param {string} [redirectUrl='login.html']
   */
  function logout(redirectUrl = 'login.html') {
    AppStorage.clearActiveSession();
    window.location.replace(`${redirectUrl}?logged_out=true`);
  }

  return {
    validatePassword,
    register,
    login,
    requireAuth,
    logout,
    GENERIC_AUTH_ERROR
  };
})();

// Export globally
window.AppAuth = AppAuth;
