import { cn } from "../../utils/cn.js";

/**
 * Card component with glassmorphism effects and fitness theme
 */
export class Card {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      variant: 'default',
      interactive: false,
      glow: false,
      ...options
    };
    
    this.init();
  }

  init() {
    this.applyStyles();
    if (this.options.interactive) {
      this.bindEvents();
    }
  }

  applyStyles() {
    const baseClasses = [
      'rounded-xl',
      'border',
      'bg-background-card/80',
      'backdrop-blur-sm',
      'transition-all',
      'duration-300'
    ];

    const variants = {
      default: [
        'border-primary-500/20',
        'shadow-glass'
      ],
      elevated: [
        'border-primary-500/30',
        'shadow-glass',
        'bg-background-elevated/80'
      ],
      glow: [
        'border-primary-500/40',
        'shadow-glow-blue',
        'bg-background-card/90'
      ],
      interactive: [
        'border-primary-500/20',
        'shadow-glass',
        'hover:border-primary-500/40',
        'hover:shadow-glow-blue',
        'hover:bg-background-card/90',
        'cursor-pointer',
        'transform',
        'hover:scale-105',
        'hover:-translate-y-1'
      ]
    };

    let variant = this.options.variant;
    if (this.options.interactive && variant === 'default') {
      variant = 'interactive';
    }
    if (this.options.glow) {
      variant = 'glow';
    }

    const classes = cn(
      baseClasses,
      variants[variant] || variants.default,
      this.options.className
    );

    this.element.className = classes;
  }

  bindEvents() {
    this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  handleMouseEnter(e) {
    // Add subtle glow effect
    this.element.style.filter = 'brightness(1.05)';
    
    // Trigger custom hover event
    this.element.dispatchEvent(new CustomEvent('card:hover', {
      detail: { card: this }
    }));
  }

  handleMouseLeave(e) {
    // Remove glow effect
    this.element.style.filter = '';
    
    // Trigger custom hover end event
    this.element.dispatchEvent(new CustomEvent('card:hover-end', {
      detail: { card: this }
    }));
  }

  handleClick(e) {
    // Add click animation
    this.element.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.element.style.transform = '';
    }, 150);
    
    // Trigger custom click event
    this.element.dispatchEvent(new CustomEvent('card:click', {
      detail: { card: this, originalEvent: e }
    }));
  }

  setVariant(variant) {
    this.options.variant = variant;
    this.applyStyles();
  }

  setGlow(glow) {
    this.options.glow = glow;
    this.applyStyles();
  }

  setInteractive(interactive) {
    this.options.interactive = interactive;
    if (interactive) {
      this.bindEvents();
    } else {
      this.destroy();
    }
    this.applyStyles();
  }

  destroy() {
    this.element.removeEventListener('mouseenter', this.handleMouseEnter);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
    this.element.removeEventListener('click', this.handleClick);
  }
}

/**
 * CardHeader component
 */
export class CardHeader {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.init();
  }

  init() {
    const classes = cn(
      'flex',
      'flex-col',
      'space-y-1.5',
      'p-6',
      'pb-0',
      this.options.className
    );
    
    this.element.className = classes;
  }
}

/**
 * CardContent component
 */
export class CardContent {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.init();
  }

  init() {
    const classes = cn(
      'p-6',
      'pt-0',
      this.options.className
    );
    
    this.element.className = classes;
  }
}

/**
 * CardFooter component
 */
export class CardFooter {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.init();
  }

  init() {
    const classes = cn(
      'flex',
      'items-center',
      'p-6',
      'pt-0',
      this.options.className
    );
    
    this.element.className = classes;
  }
}

// Factory functions for easy initialization
export function createCard(selector, options = {}) {
  const elements = typeof selector === 'string' 
    ? document.querySelectorAll(selector)
    : [selector];
    
  return Array.from(elements).map(element => new Card(element, options));
}

export function createCardHeader(selector, options = {}) {
  const elements = typeof selector === 'string' 
    ? document.querySelectorAll(selector)
    : [selector];
    
  return Array.from(elements).map(element => new CardHeader(element, options));
}

export function createCardContent(selector, options = {}) {
  const elements = typeof selector === 'string' 
    ? document.querySelectorAll(selector)
    : [selector];
    
  return Array.from(elements).map(element => new CardContent(element, options));
}

export function createCardFooter(selector, options = {}) {
  const elements = typeof selector === 'string' 
    ? document.querySelectorAll(selector)
    : [selector];
    
  return Array.from(elements).map(element => new CardFooter(element, options));
}