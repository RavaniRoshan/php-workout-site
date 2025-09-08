import { cn } from "../../utils/cn.js";

/**
 * Button component with fitness theme variants
 */
export class Button {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      variant: 'default',
      size: 'default',
      disabled: false,
      ...options
    };
    
    this.init();
  }

  init() {
    this.applyStyles();
    this.bindEvents();
  }

  applyStyles() {
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-lg',
      'font-medium',
      'transition-all',
      'duration-300',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-primary-500',
      'focus-visible:ring-offset-2',
      'focus-visible:ring-offset-background-main',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      'transform',
      'hover:scale-105',
      'active:scale-95'
    ];

    const variants = {
      default: [
        'bg-gradient-blue-green',
        'text-white',
        'shadow-glow-blue',
        'hover:shadow-glow-green',
        'hover:shadow-lg'
      ],
      secondary: [
        'bg-background-card',
        'text-text-primary',
        'border',
        'border-primary-500/20',
        'hover:bg-background-elevated',
        'hover:border-primary-500/40'
      ],
      outline: [
        'border',
        'border-primary-500',
        'text-primary-500',
        'hover:bg-primary-500',
        'hover:text-white',
        'hover:shadow-glow-blue'
      ],
      ghost: [
        'text-text-secondary',
        'hover:bg-background-card',
        'hover:text-text-primary'
      ],
      destructive: [
        'bg-red-600',
        'text-white',
        'hover:bg-red-700',
        'shadow-lg'
      ]
    };

    const sizes = {
      sm: ['h-8', 'px-3', 'text-sm'],
      default: ['h-10', 'px-4', 'py-2'],
      lg: ['h-12', 'px-8', 'text-lg'],
      icon: ['h-10', 'w-10']
    };

    const classes = cn(
      baseClasses,
      variants[this.options.variant] || variants.default,
      sizes[this.options.size] || sizes.default,
      this.options.className
    );

    this.element.className = classes;
  }

  bindEvents() {
    // Add magnetic hover effect
    this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  handleMouseEnter(e) {
    if (this.options.disabled) return;
    
    // Add glow effect
    this.element.style.filter = 'brightness(1.1)';
  }

  handleMouseLeave(e) {
    if (this.options.disabled) return;
    
    // Reset transform and glow
    this.element.style.transform = '';
    this.element.style.filter = '';
  }

  handleMouseMove(e) {
    if (this.options.disabled) return;
    
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Subtle magnetic effect
    const moveX = x * 0.1;
    const moveY = y * 0.1;
    
    this.element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
  }

  setVariant(variant) {
    this.options.variant = variant;
    this.applyStyles();
  }

  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.element.disabled = disabled;
    this.applyStyles();
  }

  destroy() {
    this.element.removeEventListener('mouseenter', this.handleMouseEnter);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
    this.element.removeEventListener('mousemove', this.handleMouseMove);
  }
}

// Factory function for easy initialization
export function createButton(selector, options = {}) {
  const elements = typeof selector === 'string' 
    ? document.querySelectorAll(selector)
    : [selector];
    
  return Array.from(elements).map(element => new Button(element, options));
}