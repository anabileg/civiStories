/**
 * ==========================================
 * Application Configuration
 * ==========================================
 * Central configuration file for the application
 */

const CONFIG = {
  // Application Info
  app: {
    name: 'CiviStories',
    version: '2.0.0',
    description: 'Digital Awareness Platform',
    author: 'CiviStories Team'
  },

  // i18n Settings
  i18n: {
    defaultLanguage: 'ar',
    fallbackLanguage: 'en',
    supportedLanguages: [
      'ar', 'en', 'fr', 'es', 'de', 'it', 'pt', 'tr',
      'ru', 'zh', 'ja', 'ko', 'hi', 'ur', 'fa'
    ],
    detectBrowserLanguage: true,
    persistLanguage: true,
    storageKey: 'preferred_language'
  },

  // API Settings (if needed)
  api: {
    baseURL: '',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  },

  // Social Media Links
  social: {
    youtube: 'https://youtube.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    whatsapp: 'https://wa.me/'
  },

  // Feature Flags
  features: {
    enableAnalytics: false,
    enableChat: false,
    enableNotifications: false,
    enableDarkMode: false
  },

  // UI Settings
  ui: {
    animationDuration: 300,
    navbarHeight: 90,
    tickerHeight: 45,
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1440
    }
  },

  // Performance Settings
  performance: {
    lazyLoadImages: true,
    cacheAssets: true,
    enableServiceWorker: false
  },

  // SEO Settings
  seo: {
    siteName: 'CiviStories',
    defaultTitle: 'CiviStories | Digital Awareness Platform',
    defaultDescription: 'Leading platform for digital awareness and online safety education',
    keywords: 'digital awareness, online safety, cybersecurity, privacy',
    ogImage: './assets/images/og-image.jpg'
  }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);

// Make config globally available
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
