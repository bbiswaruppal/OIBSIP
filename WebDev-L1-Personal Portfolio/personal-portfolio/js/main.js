/**
 * Personal Portfolio - Interactive Scripts
 * Author: Biswarup Pal
 * Description: Theme switcher, mobile navigation, scroll-spy, form validation, and clipboard utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Theme Switcher (Dark / Light Mode)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or infer from system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // default dark for tech portfolio
  htmlRoot.setAttribute('data-theme', initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  /* --------------------------------------------------------------------------
     2. Sticky Header & Scroll Effects
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header blur/shadow enhancement on scroll
    if (header) {
      if (scrollPos > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Drawer
     -------------------------------------------------------------------------- */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta-btn');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileMenuToggle || !mobileNavDrawer) return;

    const isOpen = forceClose ? false : !mobileNavDrawer.classList.contains('open');
    mobileNavDrawer.classList.toggle('open', isOpen);
    mobileMenuToggle.classList.toggle('open', isOpen);
    mobileMenuToggle.setAttribute('aria-expanded', isOpen.toString());
    mobileNavDrawer.setAttribute('aria-hidden', (!isOpen).toString());
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close drawer when any navigation link inside it is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  // Close drawer on click outside
  document.addEventListener('click', (e) => {
    if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
      if (!mobileNavDrawer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        toggleMobileMenu(true);
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
      toggleMobileMenu(true);
    }
  });

  /* --------------------------------------------------------------------------
     4. Active Navigation Scroll Spy
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 120; // offset for sticky header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* --------------------------------------------------------------------------
     5. Copy Email to Clipboard
     -------------------------------------------------------------------------- */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailTextElem = document.getElementById('email-text');

  if (copyEmailBtn && emailTextElem) {
    const tooltip = copyEmailBtn.querySelector('.copy-tooltip');

    copyEmailBtn.addEventListener('click', async () => {
      const email = emailTextElem.textContent.trim();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for non-https/older contexts
          const textarea = document.createElement('textarea');
          textarea.value = email;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        if (tooltip) {
          tooltip.textContent = 'Copied!';
          tooltip.style.opacity = '1';

          setTimeout(() => {
            tooltip.textContent = 'Copy';
            tooltip.style.opacity = '';
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. Interactive Contact Form Validation & Submission
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');
  const formAlert = document.getElementById('form-alert');
  const alertIcon = document.getElementById('alert-icon');
  const alertMessage = document.getElementById('alert-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function clearErrors() {
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
    
    if (nameInput) nameInput.classList.remove('error');
    if (emailInput) emailInput.classList.remove('error');
    if (messageInput) messageInput.classList.remove('error');
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      // Name validation
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your full name.';
        nameInput.classList.add('error');
        isValid = false;
      }

      // Email validation
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email address.';
        emailInput.classList.add('error');
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please provide a valid email format (e.g. name@domain.com).';
        emailInput.classList.add('error');
        isValid = false;
      }

      // Message validation
      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please write a message before sending.';
        messageInput.classList.add('error');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Message should be at least 10 characters long.';
        messageInput.classList.add('error');
        isValid = false;
      }

      if (!isValid) return;

      // Simulate submission loading state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending message...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Show success alert
        if (formAlert) {
          formAlert.className = 'form-alert success';
          if (alertIcon) alertIcon.textContent = '✓';
          if (alertMessage) alertMessage.textContent = 'Thank you! Your message has been sent successfully. I will get back to you soon.';
          formAlert.classList.remove('hidden');

          // Auto-hide alert after 6 seconds
          setTimeout(() => {
            formAlert.classList.add('hidden');
          }, 6000);
        }

        // Reset inputs
        contactForm.reset();
      }, 700);
    });

    // Clear individual field errors on input
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        nameError.textContent = '';
        nameInput.classList.remove('error');
      });
    }
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        emailError.textContent = '';
        emailInput.classList.remove('error');
      });
    }
    if (messageInput) {
      messageInput.addEventListener('input', () => {
        messageError.textContent = '';
        messageInput.classList.remove('error');
      });
    }
  }

  /* --------------------------------------------------------------------------
     7. Dynamic Footer Year
     -------------------------------------------------------------------------- */
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     8. Résumé Download Placeholder Feedback
     -------------------------------------------------------------------------- */
  const resumeBtn = document.getElementById('resume-download-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      // If href is still #about or #resume, give friendly user notice
      if (resumeBtn.getAttribute('href') === '#about') {
        e.preventDefault();
        alert('Notice: Replace the href attribute in index.html with the link to your actual resume PDF (e.g. assets/resume.pdf).');
      }
    });
  }
});
