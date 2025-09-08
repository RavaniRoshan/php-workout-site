/**
 * Theme management utility for fitness-themed dark mode
 */
export class ThemeProvider {
  constructor() {
    this.theme = 'dark'; // Default to dark mode for fitness theme
    this.init();
  }

  init() {
    this.applyTheme();
    this.bindEvents();
  }

  applyTheme() {
    const root = document.documentElement;
    
    if (this.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Set CSS custom properties for dynamic theming
    this.setCSSVariables();
    
    // Store preference
    localStorage.setItem('fitness-theme', this.theme);
    
    // Dispatch theme change event
    document.dispatchEvent(new CustomEvent('theme:change', {
      detail: { theme: this.theme }
    }));
  }

  setCSSVariables() {
    const root = document.documentElement;
    
    if (this.theme === 'dark') {
      // Dark theme variables (fitness theme default)
      root.style.setProperty('--color-primary', '#00D4FF');
      root.style.setProperty('--color-secondary', '#39FF7A');
      root.style.setProperty('--color-accent', '#FF6B35');
      root.style.setProperty('--color-background', '#0B1426');
      root.style.setProperty('--color-surface', '#1A2332');
      root.style.setProperty('--color-text-primary', '#FFFFFF');
      root.style.setProperty('--color-text-secondary', '#E2E8F0');
      root.style.setProperty('--color-text-muted', '#A0AEC0');
    } else {
      // Light theme variables (alternative)
      root.style.setProperty('--color-primary', '#0066CC');
      root.style.setProperty('--color-secondary', '#22C55E');
      root.style.setProperty('--color-accent', '#F97316');
      root.style.setProperty('--color-background', '#FFFFFF');
      root.style.setProperty('--color-surface', '#F8FAFC');
      root.style.setProperty('--color-text-primary', '#1A202C');
      root.style.setProperty('--color-text-secondary', '#4A5568');
      root.style.setProperty('--color-text-muted', '#718096');
    }
  }

  bindEvents() {
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
    }
  }

  handleSystemThemeChange(e) {
    // Only auto-switch if user hasn't set a preference
    const storedTheme = localStorage.getItem('fitness-theme');
    if (!storedTheme) {
      this.setTheme(e.matches ? 'dark' : 'light');
    }
  }

  setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') {
      console.warn('Invalid theme. Use "dark" or "light"');
      return;
    }
    
    this.theme = theme;
    this.applyTheme();
  }

  toggleTheme() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  getTheme() {
    return this.theme;
  }

  // Initialize theme from stored preference or system preference
  static initializeTheme() {
    const storedTheme = localStorage.getItem('fitness-theme');
    const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    const theme = storedTheme || systemTheme || 'dark'; // Default to dark for fitness theme
    
    const provider = new ThemeProvider();
    provider.setTheme(theme);
    
    return provider;
  }
}

/**
 * Utility functions for theme-aware styling
 */
export const themeUtils = {
  /**
   * Get current theme-aware color value
   */
  getColor(colorName) {
    return getComputedStyle(document.documentElement).getPropertyValue(`--color-${colorName}`).trim();
  },

  /**
   * Apply theme-aware glow effect
   */
  applyGlow(element, color = 'primary', intensity = 0.3) {
    const colorValue = this.getColor(color);
    element.style.boxShadow = `0 0 20px ${colorValue}${Math.round(intensity * 255).toString(16)}`;
  },

  /**
   * Remove glow effect
   */
  removeGlow(element) {
    element.style.boxShadow = '';
  },

  /**
   * Get theme-aware gradient
   */
  getGradient(type = 'blue-green') {
    const gradients = {
      'blue-green': 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
      'orange-pink': 'linear-gradient(135deg, var(--color-accent) 0%, #F093FB 100%)',
      'radial-primary': 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)'
    };
    
    return gradients[type] || gradients['blue-green'];
  },

  /**
   * Apply theme-aware background
   */
  applyBackground(element, type = 'card') {
    const backgrounds = {
      'main': 'var(--color-background)',
      'card': 'var(--color-surface)',
      'glass': 'rgba(26, 35, 50, 0.8)'
    };
    
    element.style.backgroundColor = backgrounds[type] || backgrounds.card;
  }
};

// Auto-initialize theme on module load
let globalThemeProvider = null;

export function getThemeProvider() {
  if (!globalThemeProvider) {
    globalThemeProvider = ThemeProvider.initializeTheme();
  }
  return globalThemeProvider;
}

// Export for global access
window.fitnessTheme = {
  provider: getThemeProvider,
  utils: themeUtils
};