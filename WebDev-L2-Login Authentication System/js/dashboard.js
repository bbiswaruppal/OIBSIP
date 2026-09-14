/**
 * Controller script for the Protected Dashboard.
 * Guards the page against unauthenticated access, populates user profile details,
 * and handles session termination via logout.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Guard check: Require valid session
  const session = AppAuth.requireAuth('login.html');
  if (!session) {
    return; // Redirection is handled by AppAuth.requireAuth
  }

  // 2. DOM Elements
  const welcomeUsername = document.getElementById('welcomeUsername');
  const cardUsername = document.getElementById('cardUsername');
  const cardEmail = document.getElementById('cardEmail');
  const cardUserId = document.getElementById('cardUserId');
  const cardRegisteredAt = document.getElementById('cardRegisteredAt');
  const cardLoginAt = document.getElementById('cardLoginAt');
  const logoutBtn = document.getElementById('logoutBtn');
  const footerLogoutBtn = document.getElementById('footerLogoutBtn');

  // Helper date formatter
  function formatDate(isoString) {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch (e) {
      return isoString;
    }
  }

  // 3. Render Session & User Information
  welcomeUsername.textContent = session.username || 'User';
  cardUsername.textContent = session.username || '-';
  cardEmail.textContent = session.email || 'None provided';
  cardUserId.textContent = session.userId || '-';
  cardRegisteredAt.textContent = formatDate(session.createdAt);
  cardLoginAt.textContent = formatDate(session.loginAt);

  // 4. Logout Action
  function handleLogout() {
    logoutBtn.disabled = true;
    if (footerLogoutBtn) footerLogoutBtn.disabled = true;
    AppAuth.logout('login.html');
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  if (footerLogoutBtn) {
    footerLogoutBtn.addEventListener('click', handleLogout);
  }
});
