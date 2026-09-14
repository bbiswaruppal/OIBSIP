/**
 * Controller script for the Registration page.
 * Manages live password requirement validation, input masking toggles,
 * client-side checks, duplicate detection, and registration submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  // If user is already logged in, redirect them directly to the dashboard
  const activeSession = AppStorage.getActiveSession();
  if (activeSession) {
    window.location.replace('dashboard.html');
    return;
  }

  // DOM Elements
  const form = document.getElementById('registerForm');
  const usernameInput = document.getElementById('usernameInput');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const confirmPasswordInput = document.getElementById('confirmPasswordInput');
  const registerBtn = document.getElementById('registerBtn');
  const alertBox = document.getElementById('alertBox');
  const alertMessage = document.getElementById('alertMessage');
  const alertIconPath = document.getElementById('alertIconPath');

  const usernameError = document.getElementById('usernameError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');

  const ruleMinLength = document.getElementById('ruleMinLength');
  const ruleNumber = document.getElementById('ruleNumber');

  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPasswordBtn');

  // SVG Icons for password requirements checklist
  const checkIconSvg = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>`;
  const circleIconSvg = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="9" stroke-width="2" /></svg>`;

  // Helper to show/hide alert banner
  function showAlert(msg, type = 'error') {
    alertBox.className = `alert-box show ${type}`;
    alertMessage.textContent = msg;

    if (type === 'error') {
      alertIconPath.setAttribute('d', 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
    } else if (type === 'success') {
      alertIconPath.setAttribute('d', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z');
    }
  }

  function hideAlert() {
    alertBox.className = 'alert-box';
    alertMessage.textContent = '';
  }

  // Clear specific field errors
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

  // Password visibility toggle helpers
  function setupPasswordToggle(btn, input) {
    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      btn.innerHTML = isPassword
        ? `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>`
        : `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`;
    });
  }

  setupPasswordToggle(togglePasswordBtn, passwordInput);
  setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

  // Live Password Validation Checklist Updates
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    const { hasMinLength, hasNumber } = AppAuth.validatePassword(val);

    // Rule 1: Min length 8
    if (hasMinLength) {
      ruleMinLength.classList.add('valid');
      ruleMinLength.querySelector('svg').outerHTML = checkIconSvg;
    } else {
      ruleMinLength.classList.remove('valid');
      ruleMinLength.querySelector('svg').outerHTML = circleIconSvg;
    }

    // Rule 2: At least 1 number
    if (hasNumber) {
      ruleNumber.classList.add('valid');
      ruleNumber.querySelector('svg').outerHTML = checkIconSvg;
    } else {
      ruleNumber.classList.remove('valid');
      ruleNumber.querySelector('svg').outerHTML = circleIconSvg;
    }

    if (passwordInput.classList.contains('is-invalid')) {
      clearFieldError(passwordInput, passwordError);
    }
  });

  // Clear errors on input
  usernameInput.addEventListener('input', () => clearFieldError(usernameInput, usernameError));
  emailInput.addEventListener('input', () => clearFieldError(emailInput, emailError));
  confirmPasswordInput.addEventListener('input', () => clearFieldError(confirmPasswordInput, confirmPasswordError));

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let hasError = false;

    // 1. Basic Form Validation: Prevent empty submissions
    if (!username) {
      setFieldError(usernameInput, usernameError, 'Please enter a username.');
      hasError = true;
    }

    if (!email) {
      setFieldError(emailInput, emailError, 'Please enter an email address.');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address.');
      hasError = true;
    }

    if (!password) {
      setFieldError(passwordInput, passwordError, 'Please enter a password.');
      hasError = true;
    } else {
      const pwdCheck = AppAuth.validatePassword(password);
      if (!pwdCheck.isValid) {
        setFieldError(passwordInput, passwordError, pwdCheck.errors.join('. ') + '.');
        hasError = true;
      }
    }

    if (!confirmPassword) {
      setFieldError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password.');
      hasError = true;
    } else if (password && confirmPassword && password !== confirmPassword) {
      setFieldError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // 2. Perform Registration through AppAuth
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<span>Creating Account...</span>';

    try {
      const result = await AppAuth.register({ username, email, password });

      if (!result.success) {
        // Displays duplicate username/email error or general error
        showAlert(result.error, 'error');
        registerBtn.disabled = false;
        registerBtn.innerHTML = '<span>Register</span>';
        return;
      }

      // Success
      showAlert('Account registered successfully! Redirecting to login...', 'success');
      form.reset();

      setTimeout(() => {
        window.location.href = `login.html?registered=true&user=${encodeURIComponent(username)}`;
      }, 1200);

    } catch (err) {
      showAlert('An unexpected error occurred. Please try again.', 'error');
      registerBtn.disabled = false;
      registerBtn.innerHTML = '<span>Register</span>';
    }
  });
});
