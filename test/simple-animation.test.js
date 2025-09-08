import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

describe('Animation System Core Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('GSAP Configuration', () => {
    it('should have correct default configuration', async () => {
      const { gsapConfig } = await import('../src/js/utils/gsap-config.js');
      
      expect(gsapConfig.defaults.duration).toBe(0.6);
      expect(gsapConfig.defaults.ease).toBe("power2.out");
      expect(gsapConfig.scrollTrigger.start).toBe("top 80%");
    });

    it('should have fitness-appropriate easing curves', async () => {
      const { gsapConfig } = await import('../src/js/utils/gsap-config.js');
      
      expect(gsapConfig.easings.elastic).toBe("elastic.out(1, 0.3)");
      expect(gsapConfig.easings.bounce).toBe("bounce.out");
      expect(gsapConfig.easings.power).toBe("power2.out");
    });

    it('should have animation presets', async () => {
      const { animationPresets } = await import('../src/js/utils/gsap-config.js');
      
      expect(animationPresets.heroTitle.duration).toBe(1.2);
      expect(animationPresets.cardReveal.stagger).toBe(0.15);
      expect(animationPresets.counterUp.duration).toBe(2.0);
    });

    it('should detect reduced motion preference', async () => {
      const { shouldReduceMotion } = await import('../src/js/utils/gsap-config.js');
      
      expect(typeof shouldReduceMotion()).toBe('boolean');
    });

    it('should detect mobile device', async () => {
      const { isMobileDevice } = await import('../src/js/utils/gsap-config.js');
      
      expect(typeof isMobileDevice()).toBe('boolean');
    });
  });

  describe('Component Utilities', () => {
    it('should merge classes correctly', async () => {
      const { cn } = await import('../src/js/utils/cn.js');
      
      const result = cn('base-class', 'additional-class', { 'conditional': true });
      expect(result).toContain('base-class');
      expect(result).toContain('additional-class');
      expect(result).toContain('conditional');
    });

    it('should generate unique IDs', async () => {
      const { generateId } = await import('../src/js/utils/component-helpers.js');
      
      const id1 = generateId('test');
      const id2 = generateId('test');
      
      expect(id1).toMatch(/^test-/);
      expect(id2).toMatch(/^test-/);
      expect(id1).not.toBe(id2);
    });

    it('should debounce function calls', async () => {
      const { debounce } = await import('../src/js/utils/component-helpers.js');
      
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(mockFn).not.toHaveBeenCalled();
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should throttle function calls', async () => {
      const { throttle } = await import('../src/js/utils/component-helpers.js');
      
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should validate form fields', async () => {
      const { validateField } = await import('../src/js/utils/component-helpers.js');
      
      const input = document.createElement('input');
      input.value = '';
      
      const errors = validateField(input, { required: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('required');
      
      input.value = 'test@example.com';
      const emailErrors = validateField(input, { email: true });
      expect(emailErrors).toHaveLength(0);
    });

    it('should format numbers correctly', async () => {
      const { formatNumber } = await import('../src/js/utils/component-helpers.js');
      
      expect(formatNumber(1234.56)).toBe('1,234.56');
      expect(formatNumber(1000, { minimumFractionDigits: 2 })).toBe('1,000.00');
    });
  });

  describe('Theme Management', () => {
    it('should initialize theme provider', async () => {
      const { ThemeProvider } = await import('../src/js/utils/theme.js');
      
      const provider = new ThemeProvider();
      expect(provider.theme).toBe('dark'); // Default fitness theme
    });

    it('should toggle theme', async () => {
      const { ThemeProvider } = await import('../src/js/utils/theme.js');
      
      const provider = new ThemeProvider();
      const initialTheme = provider.getTheme();
      
      provider.toggleTheme();
      const newTheme = provider.getTheme();
      
      expect(newTheme).not.toBe(initialTheme);
    });

    it('should have theme utilities', async () => {
      const { themeUtils } = await import('../src/js/utils/theme.js');
      
      expect(typeof themeUtils.getColor).toBe('function');
      expect(typeof themeUtils.applyGlow).toBe('function');
      expect(typeof themeUtils.getGradient).toBe('function');
    });
  });

  describe('UI Components Structure', () => {
    it('should create button component', async () => {
      const { Button } = await import('../src/js/components/ui/Button.js');
      
      const buttonElement = document.createElement('button');
      const button = new Button(buttonElement);
      
      expect(button.element).toBe(buttonElement);
      expect(button.options.variant).toBe('default');
    });

    it('should create input component', async () => {
      const { Input } = await import('../src/js/components/ui/Input.js');
      
      const inputElement = document.createElement('input');
      const input = new Input(inputElement);
      
      expect(input.element).toBe(inputElement);
      expect(input.options.variant).toBe('default');
    });

    it('should create card component', async () => {
      const { Card } = await import('../src/js/components/ui/Card.js');
      
      const cardElement = document.createElement('div');
      const card = new Card(cardElement);
      
      expect(card.element).toBe(cardElement);
      expect(card.options.variant).toBe('default');
    });

    it('should create modal component', async () => {
      const { Modal } = await import('../src/js/components/ui/Modal.js');
      
      const modal = new Modal();
      
      expect(modal.isOpen).toBe(false);
      expect(modal.element).toBeDefined();
    });
  });

  describe('Component Factory', () => {
    it('should have component factory methods', async () => {
      const { ComponentFactory } = await import('../src/js/components/ui/index.js');
      
      expect(typeof ComponentFactory.createButton).toBe('function');
      expect(typeof ComponentFactory.createInput).toBe('function');
      expect(typeof ComponentFactory.createCard).toBe('function');
      expect(typeof ComponentFactory.createModal).toBe('function');
    });

    it('should initialize components automatically', async () => {
      const { initializeComponents } = await import('../src/js/components/ui/index.js');
      
      // Add test elements
      const button = document.createElement('button');
      button.setAttribute('data-component', 'button');
      document.body.appendChild(button);
      
      const result = initializeComponents();
      
      expect(result.componentsCount.buttons).toBe(1);
    });
  });

  describe('Performance Considerations', () => {
    it('should respect reduced motion preference', async () => {
      const { prefersReducedMotion } = await import('../src/js/utils/component-helpers.js');
      
      expect(typeof prefersReducedMotion()).toBe('boolean');
    });

    it('should provide safe animation wrapper', async () => {
      const { safeAnimate } = await import('../src/js/utils/component-helpers.js');
      
      const element = document.createElement('div');
      const mockAnimation = vi.fn(() => Promise.resolve());
      
      const result = safeAnimate(element, mockAnimation);
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('Error Handling', () => {
    it('should format validation errors', async () => {
      const { formatValidationError } = await import('../src/js/utils/component-helpers.js');
      
      const error = { type: 'required' };
      const message = formatValidationError(error);
      
      expect(message).toBe('This field is required');
    });

    it('should handle unknown error types', async () => {
      const { formatValidationError } = await import('../src/js/utils/component-helpers.js');
      
      const error = { type: 'unknown', message: 'Custom error' };
      const message = formatValidationError(error);
      
      expect(message).toBe('Custom error');
    });
  });

  describe('Accessibility Features', () => {
    it('should create focus trap', async () => {
      const { createFocusTrap } = await import('../src/js/utils/component-helpers.js');
      
      const container = document.createElement('div');
      const button = document.createElement('button');
      container.appendChild(button);
      
      const cleanup = createFocusTrap(container);
      expect(typeof cleanup).toBe('function');
      
      cleanup();
    });

    it('should copy to clipboard', async () => {
      const { copyToClipboard } = await import('../src/js/utils/component-helpers.js');
      
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(() => Promise.resolve())
        }
      });
      
      const result = await copyToClipboard('test text');
      expect(result).toBe(true);
    });
  });
});