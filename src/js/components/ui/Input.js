import { cn } from "../../utils/cn.js";

/**
 * Input component with fitness theme styling and animations
 */
export class Input {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      variant: 'default',
      size: 'default',
      error: false,
      ...options
    };
    
    this.init();
  }

  init() {
    this.createWrapper();
    this.applyStyles();
    this.bindEvents();
  }

  createWrapper() {
    // Create wrapper for floating label effect
    if (!this.element.parentElement || !this.element.parentElement.classList.contains('input-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'input-wrapper relative';
      
      if (this.element.parentNode) {
        this.element.parentNode.insertBefore(wrapper, this.element);
        wrapper.appendChild(this.element);
      } else {
        // If no parent, just append to body for testing
        document.body.appendChild(wrapper);
        wrapper.appendChild(this.element);
      }
      
      this.wrapper = wrapper;
    } else {
      this.wrapper = this.element.parentElement;
    }
  }

  applyStyles() {
    const baseClasses = [
      'flex',
      'w-full',
      'rounded-lg',
      'border',
      'bg-background-card/50',
      'px-3',
      'py-2',
      'text-sm',
      'text-text-primary',
      'placeholder:text-text-muted',
      'transition-all',
      'duration-300',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-offset-2',
      'focus-visible:ring-offset-background-main',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50',
      'backdrop-blur-sm'
    ];

    const variants = {
      default: [
        'border-primary-500/20',
        'focus-visible:border-primary-500',
        'focus-visible:ring-primary-500/20',
        'focus-visible:shadow-glow-blue'
      ],
      error: [
        'border-red-500/50',
        'focus-visible:border-red-500',
        'focus-visible:ring-red-500/20',
        'focus-visible:shadow-glow-red'
      ],
      success: [
        'border-secondary-green/50',
        'focus-visible:border-secondary-green',
        'focus-visible:ring-secondary-green/20',
        'focus-visible:shadow-glow-green'
      ]
    };

    const sizes = {
      sm: ['h-8', 'px-2', 'text-xs'],
      default: ['h-10', 'px-3', 'py-2'],
      lg: ['h-12', 'px-4', 'text-base']
    };

    const variant = this.options.error ? 'error' : this.options.variant;
    
    const classes = cn(
      baseClasses,
      variants[variant] || variants.default,
      sizes[this.options.size] || sizes.default,
      this.options.className
    );

    this.element.className = classes;
  }

  bindEvents() {
    this.element.addEventListener('focus', this.handleFocus.bind(this));
    this.element.addEventListener('blur', this.handleBlur.bind(this));
    this.element.addEventListener('input', this.handleInput.bind(this));
  }

  handleFocus(e) {
    // Add focus glow effect
    this.wrapper.style.transform = 'scale(1.02)';
    
    // Trigger custom focus event
    this.element.dispatchEvent(new CustomEvent('input:focus', {
      detail: { value: this.element.value }
    }));
  }

  handleBlur(e) {
    // Remove focus effects
    this.wrapper.style.transform = '';
    
    // Trigger custom blur event
    this.element.dispatchEvent(new CustomEvent('input:blur', {
      detail: { value: this.element.value }
    }));
  }

  handleInput(e) {
    // Clear error state on input
    if (this.options.error) {
      this.setError(false);
    }
    
    // Trigger custom input event
    this.element.dispatchEvent(new CustomEvent('input:change', {
      detail: { value: this.element.value }
    }));
  }

  setError(hasError, message = '') {
    this.options.error = hasError;
    this.applyStyles();
    
    // Handle error message display
    let errorElement = this.wrapper.querySelector('.input-error');
    
    if (hasError && message) {
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'input-error text-xs text-red-400 mt-1 opacity-0 transition-opacity duration-300';
        this.wrapper.appendChild(errorElement);
      }
      
      errorElement.textContent = message;
      setTimeout(() => {
        errorElement.style.opacity = '1';
      }, 10);
    } else if (errorElement) {
      errorElement.style.opacity = '0';
      setTimeout(() => {
        errorElement.remove();
      }, 300);
    }
  }

  setValue(value) {
    this.element.value = value;
    this.handleInput();
  }

  getValue() {
    return this.element.value;
  }

  setDisabled(disabled) {
    this.element.disabled = disabled;
    this.applyStyles();
  }

  destroy() {
    this.element.removeEventListener('focus', this.handleFocus);
    this.element.removeEventListener('blur', this.handleBlur);
    this.element.removeEventListener('input', this.handleInput);
  }
}

// Factory function for easy initialization
export function createInput(selector, options = {}) {
  const elements = typeof selector === 'string' 
    ? document.querySelectorAll(selector)
    : [selector];
    
  return Array.from(elements).map(element => new Input(element, options));
}