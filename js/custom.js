/**
 * Portfolio Website - Modern JavaScript
 * No jQuery - Pure Vanilla JS with Modern APIs
 */

(function () {
  'use strict';

  // ============================================
  // DARK MODE TOGGLE
  // ============================================
  function initDarkMode() {
    const checkbox = document.getElementById('chk');

    if (!checkbox) return;

    checkbox.addEventListener('change', () => {
      document.body.classList.toggle('light-mode');

      // Save preference to localStorage
      const isLightMode = document.body.classList.contains('light-mode');
      localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      checkbox.checked = false;
    }
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  function initSmoothScroll() {
    const links = document.querySelectorAll('.nav-link, .custom-btn-link, .arrow-up');

    links.forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Only handle internal links
        if (!href || !href.startsWith('#')) return;

        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const navbarHeight = 49;
          const targetPosition = targetElement.offsetTop - navbarHeight;

          // Check if user prefers reduced motion
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          if (prefersReducedMotion) {
            window.scrollTo(0, targetPosition);
          } else {
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // ============================================
  // NAVBAR HIDE/SHOW ON SCROLL
  // ============================================
  function initNavbarBehavior() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollTop = 0;
    let isScrolling;

    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Add headroom classes
      if (scrollTop > 100) {
        navbar.classList.add('headroom--not-top');

        if (scrollTop > lastScrollTop) {
          // Scrolling down
          navbar.classList.add('headroom--unpinned');
          navbar.classList.remove('headroom--pinned');
        } else {
          // Scrolling up
          navbar.classList.remove('headroom--unpinned');
          navbar.classList.add('headroom--pinned');
        }
      } else {
        navbar.classList.remove('headroom--not-top', 'headroom--unpinned', 'headroom--pinned');
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    // Debounce scroll event for better performance
    window.addEventListener('scroll', function() {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(handleScroll, 10);
    }, { passive: true });
  }

  // ============================================
  // SCROLL TO TOP BUTTON
  // ============================================
  function initScrollToTop() {
    const toTop = document.querySelector('.arrow-up');
    if (!toTop) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        toTop.classList.add('active');
      } else {
        toTop.classList.remove('active');
      }
    }, { passive: true });
  }

  // ============================================
  // CALENDLY INTEGRATION
  // ============================================
  function initCalendly() {
    const calendlyLink = document.querySelector('[data-calendly-url]');

    if (!calendlyLink) return;

    calendlyLink.addEventListener('click', function(e) {
      e.preventDefault();

      const url = this.getAttribute('data-calendly-url');

      // Check if Calendly widget is loaded
      if (typeof Calendly !== 'undefined') {
        Calendly.initPopupWidget({ url });
      } else {
        console.warn('Calendly widget not loaded');
        // Fallback to direct link
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  }

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (!navbarToggler || !navbarCollapse) return;

    navbarToggler.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      navbarCollapse.classList.toggle('show');
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          navbarCollapse.classList.remove('show');
          navbarToggler.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInside = navbarToggler.contains(event.target) || navbarCollapse.contains(event.target);
      const isOpen = navbarCollapse.classList.contains('show');

      if (!isClickInside && isOpen) {
        navbarCollapse.classList.remove('show');
        navbarToggler.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============================================
  // EXPERIENCE TABS
  // ============================================
  function initExperienceTabs() {
    const tabButtons = document.querySelectorAll('[role="tab"]');

    tabButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('data-target');
        const targetPanel = document.querySelector(targetId);

        if (!targetPanel) return;

        // Remove active class from all tabs and panels
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });

        document.querySelectorAll('.tab-pane').forEach(panel => {
          panel.classList.remove('show', 'active');
        });

        // Add active class to clicked tab and target panel
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        targetPanel.classList.add('show', 'active');
      });

      // Keyboard navigation for tabs
      button.addEventListener('keydown', function(e) {
        let newIndex;
        const currentIndex = Array.from(tabButtons).indexOf(this);

        switch(e.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            newIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
            tabButtons[newIndex].focus();
            tabButtons[newIndex].click();
            break;
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            newIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
            tabButtons[newIndex].focus();
            tabButtons[newIndex].click();
            break;
          case 'Home':
            e.preventDefault();
            tabButtons[0].focus();
            tabButtons[0].click();
            break;
          case 'End':
            e.preventDefault();
            tabButtons[tabButtons.length - 1].focus();
            tabButtons[tabButtons.length - 1].click();
            break;
        }
      });
    });
  }

  // ============================================
  // PROJECT CARDS - KEYBOARD ACCESSIBILITY
  // ============================================
  function initProjectCards() {
    const cards = document.querySelectorAll('.card[tabindex="0"]');

    cards.forEach(card => {
      // Toggle flip on Enter or Space key
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.classList.toggle('flipped');
        }
      });

      // Remove flipped class on blur
      card.addEventListener('blur', function() {
        this.classList.remove('flipped');
      });
    });
  }

  // ============================================
  // COPYRIGHT YEAR
  // ============================================
  function setCopyrightYear() {
    const copyrightYear = document.getElementById('copyright');
    if (copyrightYear) {
      copyrightYear.textContent = new Date().getFullYear();
    }
  }

  // ============================================
  // INITIALIZE ALL
  // ============================================
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize all features
    initDarkMode();
    initSmoothScroll();
    initNavbarBehavior();
    initScrollToTop();
    initCalendly();
    initMobileMenu();
    initExperienceTabs();
    initProjectCards();
    setCopyrightYear();

    console.log('✨ Portfolio initialized successfully!');
  }

  // Start initialization
  init();
})();
