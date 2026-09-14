/**
 * Storage management layer using browser localStorage and sessionStorage.
 * Manages persisted registered user records and active session state.
 */

const AppStorage = (function () {
  const KEYS = {
    USERS: 'auth_system_users',
    SESSION: 'auth_system_session'
  };

  /**
   * Retrieves all registered users from localStorage.
   * @returns {Array<Object>} Array of registered user objects
   */
  function getUsers() {
    try {
      const raw = localStorage.getItem(KEYS.USERS);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('Failed to read users from localStorage:', err);
      return [];
    }
  }

  /**
   * Persists the array of users to localStorage.
   * @param {Array<Object>} users 
   */
  function saveUsers(users) {
    try {
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    } catch (err) {
      console.error('Failed to save users to localStorage:', err);
      throw new Error('Unable to access browser storage.');
    }
  }

  /**
   * Checks whether a username or email is already taken.
   * Case-insensitive match on username and email.
   * @param {string} username 
   * @param {string} email 
   * @returns {{ exists: boolean, field: string|null }}
   */
  function checkDuplicate(username, email) {
    const users = getUsers();
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanEmail = (email || '').trim().toLowerCase();

    for (const user of users) {
      if (user.username.toLowerCase() === cleanUser) {
        return { exists: true, field: 'username' };
      }
      if (user.email && user.email.toLowerCase() === cleanEmail) {
        return { exists: true, field: 'email' };
      }
    }
    return { exists: false, field: null };
  }

  /**
   * Finds a user by either username or email (case-insensitive).
   * @param {string} identifier - username or email
   * @returns {Object|null}
   */
  function findUserByIdentifier(identifier) {
    if (!identifier) return null;
    const cleanId = identifier.trim().toLowerCase();
    const users = getUsers();
    return (
      users.find(
        u =>
          u.username.toLowerCase() === cleanId ||
          (u.email && u.email.toLowerCase() === cleanId)
      ) || null
    );
  }

  /**
   * Adds a newly registered user to localStorage.
   * @param {Object} user 
   */
  function addUser(user) {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
  }

  /**
   * Updates an existing user record (e.g., updating lastLogin).
   * @param {Object} updatedUser 
   */
  function updateUser(updatedUser) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      saveUsers(users);
    }
  }

  /**
   * Retrieves the active authentication session.
   * Checks both localStorage and sessionStorage.
   * @returns {Object|null}
   */
  function getActiveSession() {
    try {
      const sessionStr =
        localStorage.getItem(KEYS.SESSION) ||
        sessionStorage.getItem(KEYS.SESSION);
      if (!sessionStr) return null;
      return JSON.parse(sessionStr);
    } catch (err) {
      console.error('Failed to parse session:', err);
      return null;
    }
  }

  /**
   * Sets the active authentication session.
   * @param {Object} sessionData 
   * @param {boolean} remember - if true, stores in localStorage; else sessionStorage
   */
  function setActiveSession(sessionData, remember = true) {
    clearActiveSession();
    const serialized = JSON.stringify(sessionData);
    if (remember) {
      localStorage.setItem(KEYS.SESSION, serialized);
    } else {
      sessionStorage.setItem(KEYS.SESSION, serialized);
    }
  }

  /**
   * Clears active authentication session from both storages.
   */
  function clearActiveSession() {
    try {
      localStorage.removeItem(KEYS.SESSION);
      sessionStorage.removeItem(KEYS.SESSION);
    } catch (err) {
      console.error('Failed to clear session:', err);
    }
  }

  return {
    getUsers,
    checkDuplicate,
    findUserByIdentifier,
    addUser,
    updateUser,
    getActiveSession,
    setActiveSession,
    clearActiveSession
  };
})();

// Export globally
window.AppStorage = AppStorage;
