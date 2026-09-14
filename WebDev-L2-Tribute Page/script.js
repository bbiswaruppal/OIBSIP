/**
 * Dr. A.P.J. Abdul Kalam Tribute Page - JavaScript Enhancements
 * Features:
 * - Theme Switcher (Dark / Light) with LocalStorage & OS Preference sync
 * - Reading Scroll Progress Bar
 * - Dynamic Active Navigation highlighting with IntersectionObserver
 * - Mobile Navigation Menu Toggle & Keyboard Accessibility
 * - Interactive Quotes Carousel / Rotator with pause-on-hover
 * - Timeline Category Filter
 * - Back-to-Top button behavior
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollProgress();
  initActiveNavigation();
  initMobileMenu();
  initQuoteCarousel();
  initTimelineFilter();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. Theme Switcher (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const htmlEl = document.documentElement;

  // Retrieve saved preference or check OS preference
  const savedTheme = localStorage.getItem('tribute_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('tribute_theme', theme);
    themeToggleBtn.setAttribute('title', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
    themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
  }
}

/* --------------------------------------------------------------------------
   2. Reading Scroll Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. Active Navigation Highlighting (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   4. Mobile Navigation Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const siteNav = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !siteNav) return;

  mobileToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    mobileToggle.classList.toggle('is-active', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen);
    mobileToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  // Close menu when link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!siteNav.contains(e.target) && !mobileToggle.contains(e.target)) {
      siteNav.classList.remove('is-open');
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Quote Carousel / Rotator
   -------------------------------------------------------------------------- */
function initQuoteCarousel() {
  const quoteText = document.getElementById('active-quote-text');
  const quoteContext = document.getElementById('active-quote-context');
  const prevBtn = document.getElementById('prev-quote');
  const nextBtn = document.getElementById('next-quote');
  const dotsContainer = document.getElementById('quote-dots');
  const quoteBox = document.querySelector('.quote-card-distinct');

  if (!quoteText || !quoteContext || !dotsContainer) return;

  const quotes = [
    {
      text: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.",
      author: "Dr. A.P.J. Abdul Kalam",
      source: "Address to youth and students · New Delhi"
    },
    {
      text: "If you want to shine like a sun, first burn like a sun.",
      author: "Dr. A.P.J. Abdul Kalam",
      source: "From 'Wings of Fire' (1999)"
    },
    {
      text: "You cannot change your future, but you can change your habits, and surely your habits will change your future.",
      author: "Dr. A.P.J. Abdul Kalam",
      source: "Keynote Address on Youth Empowerment"
    },
    {
      text: "To succeed in your mission, you must have single-minded devotion to your goal.",
      author: "Dr. A.P.J. Abdul Kalam",
      source: "Reflections on the SLV-III Launch"
    },
    {
      text: "Learning gives creativity, creativity leads to thinking, thinking provides knowledge, knowledge makes you great.",
      author: "Dr. A.P.J. Abdul Kalam",
      source: "Lecture at European Parliament (2007)"
    }
  ];

  let currentIndex = 0;
  let autoPlayInterval = null;

  function renderQuote(index) {
    currentIndex = (index + quotes.length) % quotes.length;
    
    // Smooth fade transition
    quoteText.style.opacity = '0';
    quoteContext.style.opacity = '0';

    setTimeout(() => {
      quoteText.textContent = `"${quotes[currentIndex].text}"`;
      quoteContext.innerHTML = `
        <span class="quote-author">— ${quotes[currentIndex].author}</span>
        <span class="quote-source">${quotes[currentIndex].source}</span>
      `;
      quoteText.style.opacity = '1';
      quoteContext.style.opacity = '1';

      // Update dot active states
      const dots = dotsContainer.querySelectorAll('.quote-dot');
      dots.forEach((dot, i) => {
        const isActive = i === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }, 200);
  }

  // Next / Previous Click
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      resetAutoPlay();
      renderQuote(currentIndex + 1);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      resetAutoPlay();
      renderQuote(currentIndex - 1);
    });
  }

  // Dots click delegation
  dotsContainer.addEventListener('click', (e) => {
    const dot = e.target.closest('.quote-dot');
    if (!dot) return;
    const index = parseInt(dot.getAttribute('data-index'), 10);
    resetAutoPlay();
    renderQuote(index);
  });

  // Auto-play quotes every 6 seconds
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      renderQuote(currentIndex + 1);
    }, 6000);
  }

  function resetAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Pause on hover
  if (quoteBox) {
    quoteBox.addEventListener('mouseenter', () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    });
    quoteBox.addEventListener('mouseleave', () => {
      startAutoPlay();
    });
  }

  startAutoPlay();
}

/* --------------------------------------------------------------------------
   6. Timeline Category Filter
   -------------------------------------------------------------------------- */
function initTimelineFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (!filterBtns.length || !timelineItems.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active filter button
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      timelineItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Back-to-Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
