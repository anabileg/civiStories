/**
 * ==========================================
 * i18n Manager - Internationalization System
 * ==========================================
 * Handles language switching, RTL/LTR direction, and text translation
 */

class I18n {
  constructor() {
    this.currentLang = null;
    this.translations = {};
    this.languages = [];
    this.defaultLang = 'ar';
    this.storageKey = 'preferred_language';
  }

  /**
   * Initialize the i18n system
   */
  async init() {
    try {
      // Load available languages
      await this.loadLanguages();

      // Get preferred language
      const savedLang = this.getSavedLanguage();
      const browserLang = this.getBrowserLanguage();
      const initialLang = savedLang || browserLang || this.defaultLang;

      // Load and apply initial language
      await this.setLanguage(initialLang);

      // Setup language switcher UI
      this.setupLanguageSwitcher();

      console.log(`✅ i18n initialized with language: ${this.currentLang}`);
    } catch (error) {
      console.error('❌ Failed to initialize i18n:', error);
      // Fallback to default language
      await this.setLanguage(this.defaultLang);
    }
  }

  /**
   * Load available languages from languages.json
   */
  async loadLanguages() {
    try {
      const response = await fetch('./locales/languages.json');
      const data = await response.json();
      this.languages = data.languages;
      this.defaultLang = data.defaultLang || 'ar';
    } catch (error) {
      console.error('Failed to load languages:', error);
      // Fallback languages list
      this.languages = [
        { code: 'ar', name: 'العربية', flag: 'https://flagcdn.com/w80/eg.png', dir: 'rtl' },
        { code: 'en', name: 'English', flag: 'https://flagcdn.com/w80/gb.png', dir: 'ltr' }
      ];
    }
  }

  /**
   * Set and apply a language
   */
  async setLanguage(langCode) {
    try {
      // Load translation file (with cache buster to force fresh load)
      const cacheBuster = Date.now();
      const response = await fetch(`./locales/${langCode}.json?v=${cacheBuster}`);
      if (!response.ok) {
        throw new Error(`Language file not found: ${langCode}`);
      }

      this.translations = await response.json();
      this.currentLang = langCode;

      // Apply language changes
      this.applyLanguage();

      // Save preference
      this.saveLanguage(langCode);

      return true;
    } catch (error) {
      console.error(`Failed to load language ${langCode}:`, error);

      // Fallback to default language if not already trying it
      if (langCode !== this.defaultLang) {
        console.log(`Falling back to ${this.defaultLang}...`);
        return this.setLanguage(this.defaultLang);
      }

      return false;
    }
  }

  /**
   * Apply current language to the page
   */
  applyLanguage() {
    const meta = this.translations.meta;

    // Set HTML attributes
    document.documentElement.lang = meta.lang;
    document.documentElement.dir = meta.dir;

    // Update all translatable elements
    this.translatePage();

    // Update language switcher UI
    this.updateLanguageSwitcher();

    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { lang: this.currentLang, dir: meta.dir }
    }));
  }

  /**
   * Translate all elements with data-i18n attribute
   */
  translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      if (translation) {
        // Check if we should update innerHTML or textContent
        if (element.hasAttribute('data-i18n-html')) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);

      if (translation) {
        element.placeholder = translation;
      }
    });

    // Translate titles (tooltips)
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const translation = this.t(key);

      if (translation) {
        element.title = translation;
      }
    });
  }

  /**
   * Get translation by key (supports nested keys with dot notation)
   */
  t(key) {
    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return key itself if not found
      }
    }

    return value;
  }

  /**
   * Setup language switcher dropdown
   */
  setupLanguageSwitcher() {
    const dropdown = document.querySelector('.lang-dropdown');
    if (!dropdown) return;

    // Clear existing options
    dropdown.innerHTML = '';

    // Add language options
    this.languages.forEach(lang => {
      const option = document.createElement('a');
      option.href = '#';
      option.className = 'lang-option';
      option.setAttribute('data-lang', lang.code);

      option.innerHTML = `
        <img src="${lang.flag}" alt="${lang.name}">
        <span>${lang.name}</span>
      `;

      option.addEventListener('click', (e) => {
        e.preventDefault();
        this.setLanguage(lang.code);
        dropdown.classList.remove('show');
      });

      dropdown.appendChild(option);
    });

    // Setup toggle button
    const toggleBtn = document.querySelector('.lang-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lang-selector')) {
        dropdown.classList.remove('show');
      }
    });
  }

  /**
   * Update language switcher current flag
   */
  updateLanguageSwitcher() {
    const currentLangData = this.languages.find(l => l.code === this.currentLang);
    if (!currentLangData) return;

    const flagImg = document.querySelector('#currentLangFlag');
    if (flagImg) {
      flagImg.src = currentLangData.flag;
      flagImg.alt = currentLangData.name;
    }
  }

  /**
   * Get saved language from localStorage
   */
  getSavedLanguage() {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (error) {
      console.warn('localStorage not available');
      return null;
    }
  }

  /**
   * Save language preference to localStorage
   */
  saveLanguage(langCode) {
    try {
      localStorage.setItem(this.storageKey, langCode);
    } catch (error) {
      console.warn('Failed to save language preference');
    }
  }

  /**
   * Get browser's preferred language
   */
  getBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    if (!browserLang) return null;

    // Extract language code (e.g., 'en-US' -> 'en')
    const langCode = browserLang.split('-')[0];

    // Check if this language is supported
    const supported = this.languages.find(l => l.code === langCode);
    return supported ? langCode : null;
  }

  /**
   * Get current language direction
   */
  getDirection() {
    return this.translations.meta?.dir || 'ltr';
  }

  /**
   * Check if current language is RTL
   */
  isRTL() {
    return this.getDirection() === 'rtl';
  }

  /**
   * Get current language code
   */
  getCurrentLang() {
    return this.currentLang;
  }

  /**
   * Get all available languages
   */
  getLanguages() {
    return this.languages;
  }

  /**
   * Alias for t() method - for consistency with other parts of the codebase
   */
  get(key) {
    return this.t(key);
  }
}

// Create global instance
const i18n = new I18n();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
  i18n.init();
}

// Export for use in other modules
window.i18n = i18n;
