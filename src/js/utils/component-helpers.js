/**
 * Component helper utilities for consistent styling and behavior
 */

/**
 * Debounce function for performance optimization
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * Throttle function for scroll and resize events
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Generate unique IDs for components
 */
export function generateId(prefix = 'component') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element, threshold = 0) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(element, options = {}) {
  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    ...options
  };
  
  element.scrollIntoView(defaultOptions);
}

/**
 * Add ripple effect to elements
 */
export function addRippleEffect(element, event) {
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  `;
  
  // Add ripple animation if not exists
  if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

/**
 * Format validation errors for display
 */
export function formatValidationError(error) {
  const errorMessages = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: 'Input is too short',
    maxLength: 'Input is too long',
    pattern: 'Input format is invalid',
    number: 'Please enter a valid number',
    min: 'Value is too small',
    max: 'Value is too large'
  };
  
  return errorMessages[error.type] || error.message || 'Invalid input';
}

/**
 * Validate form field
 */
export function validateField(element, rules = {}) {
  const value = element.value.trim();
  const errors = [];
  
  // Required validation
  if (rules.required && !value) {
    errors.push({ type: 'required', message: 'This field is required' });
  }
  
  if (value) {
    // Email validation
    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push({ type: 'email', message: 'Please enter a valid email address' });
      }
    }
    
    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors.push({ 
        type: 'minLength', 
        message: `Minimum ${rules.minLength} characters required` 
      });
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push({ 
        type: 'maxLength', 
        message: `Maximum ${rules.maxLength} characters allowed` 
      });
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push({ 
        type: 'pattern', 
        message: rules.patternMessage || 'Invalid format' 
      });
    }
    
    // Number validation
    if (rules.number) {
      const num = parseFloat(value);
      if (isNaN(num)) {
        errors.push({ type: 'number', message: 'Please enter a valid number' });
      } else {
        if (rules.min !== undefined && num < rules.min) {
          errors.push({ 
            type: 'min', 
            message: `Value must be at least ${rules.min}` 
          });
        }
        
        if (rules.max !== undefined && num > rules.max) {
          errors.push({ 
            type: 'max', 
            message: `Value must be at most ${rules.max}` 
          });
        }
      }
    }
  }
  
  return errors;
}

/**
 * Create loading spinner element
 */
export function createLoadingSpinner(size = 'default') {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  const spinner = document.createElement('div');
  spinner.className = `inline-block ${sizes[size] || sizes.default} animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]`;
  spinner.setAttribute('role', 'status');
  spinner.innerHTML = '<span class="sr-only">Loading...</span>';
  
  return spinner;
}

/**
 * Show loading state on element
 */
export function showLoading(element, text = 'Loading...') {
  const originalContent = element.innerHTML;
  const spinner = createLoadingSpinner();
  
  element.disabled = true;
  element.style.position = 'relative';
  element.innerHTML = `
    <span class="flex items-center justify-center space-x-2">
      ${spinner.outerHTML}
      <span>${text}</span>
    </span>
  `;
  
  return () => {
    element.disabled = false;
    element.innerHTML = originalContent;
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      textArea.remove();
      return true;
    } catch (err) {
      textArea.remove();
      return false;
    }
  }
}

/**
 * Format numbers for display
 */
export function formatNumber(num, options = {}) {
  const defaults = {
    locale: 'en-US',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  };
  
  const config = { ...defaults, ...options };
  
  return new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: config.minimumFractionDigits,
    maximumFractionDigits: config.maximumFractionDigits
  }).format(num);
}

/**
 * Create accessible focus trap for modals
 */
export function createFocusTrap(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  function handleTabKey(e) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
  
  element.addEventListener('keydown', handleTabKey);
  
  // Focus first element
  if (firstElement) {
    firstElement.focus();
  }
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Detect reduced motion preference
 */
export function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Safe animation wrapper that respects reduced motion
 */
export function safeAnimate(element, animation, options = {}) {
  if (prefersReducedMotion()) {
    // Skip animation, just apply final state
    if (options.finalState) {
      Object.assign(element.style, options.finalState);
    }
    return Promise.resolve();
  }
  
  // Proceed with animation
  return animation();
}