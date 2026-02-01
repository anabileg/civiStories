/**
 * ==========================================
 * Main Application Script
 * ==========================================
 * Handles UI interactions, modals, carousels, etc.
 */

class App {
  constructor() {
    this.init();
  }

  init() {
    console.log('🚀 Application initializing...');

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.setupModals();
    this.setupLightbox();
    this.setupCarousels();
    this.setupSmoothScroll();

    // Listen for language changes
    window.addEventListener('languageChanged', (e) => {
      this.onLanguageChange(e.detail);
    });

    console.log('✅ Application ready');
  }

  /**
   * Setup modal functionality
   */
  setupModals() {
    // Close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('show');
        }
      });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
        }
      });
    });

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.show').forEach(modal => {
          modal.classList.remove('show');
        });
      }
    });
  }

  /**
   * Setup lightbox for images
   */
  setupLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close-lightbox');

    // Add click handlers to zoomable images
    document.querySelectorAll('[data-lightbox]').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        lightbox.classList.add('show');
      });
    });

    // Close lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('show');
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('show')) {
        closeLightbox();
      }
    });
  }

  /**
   * Setup carousel animations
   */
  setupCarousels() {
    // Pause animation on hover
    document.querySelectorAll('.animate-news, .animate-media').forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.animationPlayState = 'paused';
      });

      element.addEventListener('mouseleave', () => {
        element.style.animationPlayState = 'running';
      });
    });
  }

  /**
   * Setup smooth scroll for anchor links
   */
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 100; // Account for fixed navbar
          const targetPosition = target.offsetTop - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Handle language change events
   */
  onLanguageChange(detail) {
    console.log(`Language changed to: ${detail.lang} (${detail.dir})`);

    // Re-setup any dynamic content that needs language-specific handling
    // Add custom logic here if needed
  }

  /**
   * Show a modal by ID
   */
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
    }
  }

  /**
   * Hide a modal by ID
   */
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    }
  }

  /**
   * Utility: Format numbers with locale-specific formatting
   */
  formatNumber(number) {
    const lang = window.i18n?.getCurrentLang() || 'en';
    return new Intl.NumberFormat(lang).format(number);
  }
}

// Initialize application
const app = new App();

// Make app globally available
window.app = app;
