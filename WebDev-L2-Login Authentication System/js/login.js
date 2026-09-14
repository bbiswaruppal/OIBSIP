/**
 * Controller script for the Login page.
 * Manages URL feedback parameters, form validation, generic credential error handling,
 * and session redirection.
 */

document.addEventListener('DOMContentLoaded', () => {
  // If user is already authenticated, redirect directly to dashboard
  const activeSession = AppStorage.getActiveSession();
  const urlParams = new URLSearchParams(window.location.search);
  const isLoggedOut = urlParams.get('logged_out') === 'true';

  if (activeSession && !isLoggedOut) {
    window.location.replace('dashboard.html');
    return;
  }

  // DOM Elements
  const form = document.getElementById('loginForm');
  const identifierInput = document.getElementById('identifierInput');
  const passwordInput = document.getElementById('passwordInput');
  const loginBtn = document.getElementById('loginBtn');
  const alertBox = document.getElementById('alertBox');
  const alertMessage = document.getElementById('alertMessage');
  const alertIconPath = document.getElementById('alertIconPath');

  const identifierError = document.getElementById('identifierError');
  const passwordError = document.getElementById('passwordError');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');

  // Helper to show alert banners
  function showAlert(msg, type = 'error') {
    alertBox.className = `alert-box show ${type}`;
    alertMessage.textContent = msg;

    if (type === 'error') {
      alertIconPath.setAttribute('d', 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
    } else if (type === 'success') {
      alertIconPath.setAttribute('d', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z');
    } else if (type === 'info') {
      alertIconPath.setAttribute('d', 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
    }
  }

  function hideAlert() {
    alertBox.className = 'alert-box';
    alertMessage.textContent = '';
  }

  function clearFieldError(input, errorElement) {
    input.classList.remove('is-invalid');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }

  function setFieldError(input, errorElement, msg) {
    input.classList.add('is-invalid');
    errorElement.textContent = msg;
    errorElement.classList.add('show');
  }

  // Password visibility toggle
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    togglePasswordBtn.innerHTML = isPassword
      ? `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>`
      : `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`;
  });

  // Handle URL Query parameters for feedback
  if (urlParams.get('unauthorized') === 'true') {
    showAlert('Access denied. Please log in to view the protected page.', 'info');
  } else if (isLoggedOut) {
    showAlert('You have been logged out successfully.', 'success');
  } else if (urlParams.get('registered') === 'true') {
    const registeredUser = urlParams.get('user');
    if (registeredUser) {
      identifierInput.value = registeredUser;
      passwordInput.focus();
    }
    showAlert('Account registered successfully! Please enter your credentials to log in.', 'success');
  }

  // Input listeners to clear errors on typing
  identifierInput.addEventListener('input', () => {
    clearFieldError(identifierInput, identifierError);
  });
  passwordInput.addEventListener('input', () => {
    clearFieldError(passwordInput, passwordError);
  });

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value;

    let hasError = false;

    // 1. Basic Form Validation: Check for empty submissions
    if (!identifier) {
      setFieldError(identifierInput, identifierError, 'Please enter your username or email.');
      hasError = true;
    }

    if (!password) {
      setFieldError(passwordInput, passwordError, 'Please enter your password.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span>Signing In...</span>';

    try {
      // 2. Perform authentication through AppAuth
      const result = await AppAuth.login({ identifier, password });

      if (!result.success) {
        // Feature requirement: Incorrect credential handling — display a clear error message
        // without revealing whether the username or password was incorrect.
        showAlert(result.error, 'error');
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<span>Login</span>';
        return;
      }

      // 3. Successful login: redirect to dashboard or requested page
      showAlert('Login successful! Redirecting to dashboard...', 'success');

      const redirectTarget = urlParams.get('redirect') || 'dashboard.html';

      setTimeout(() => {
        window.location.href = redirectTarget;
      }, 800);

    } catch (err) {
      showAlert('An unexpected error occurred during login. Please try again.', 'error');
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<span>Login</span>';
    }
  });
});
