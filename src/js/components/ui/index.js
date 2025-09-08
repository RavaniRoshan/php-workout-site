/**
 * UI Components Library - Fitness Theme
 * 
 * A collection of modern, accessible UI components with fitness-themed styling,
 * GSAP animations, and dark mode support.
 */

// Core components
export { Button, createButton } from './Button.js';
export { Input, createInput } from './Input.js';
export { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  createCard,
  createCardHeader,
  createCardContent,
  createCardFooter
} from './Card.js';
export { Modal, createModal, showAlert, showConfirm } from './Modal.js';

// Utilities
export { cn } from '../../utils/cn.js';
export { ThemeProvider, themeUtils, getThemeProvider } from '../../utils/theme.js';
export * as componentHelpers from '../../utils/component-helpers.js';

/**
 * Initialize all UI components in the document
 * This function can be called to automatically enhance existing HTML elements
 */
export function initializeComponents() {
  // Initialize theme
  const themeProvider = getThemeProvider();
  
  // Auto-enhance buttons with data-component="button"
  const buttons = document.querySelectorAll('[data-component="button"]');
  buttons.forEach(button => {
    const variant = button.dataset.variant || 'default';
    const size = button.dataset.size || 'default';
    new Button(button, { variant, size });
  });
  
  // Auto-enhance inputs with data-component="input"
  const inputs = document.querySelectorAll('[data-component="input"]');
  inputs.forEach(input => {
    const variant = input.dataset.variant || 'default';
    const size = input.dataset.size || 'default';
    new Input(input, { variant, size });
  });
  
  // Auto-enhance cards with data-component="card"
  const cards = document.querySelectorAll('[data-component="card"]');
  cards.forEach(card => {
    const variant = card.dataset.variant || 'default';
    const interactive = card.dataset.interactive === 'true';
    const glow = card.dataset.glow === 'true';
    new Card(card, { variant, interactive, glow });
  });
  
  console.log('✨ Fitness UI components initialized');
  
  return {
    themeProvider,
    componentsCount: {
      buttons: buttons.length,
      inputs: inputs.length,
      cards: cards.length
    }
  };
}

/**
 * Component factory for creating components programmatically
 */
export const ComponentFactory = {
  /**
   * Create a button element with fitness theme
   */
  createButton(text, options = {}) {
    const button = document.createElement('button');
    button.textContent = text;
    button.type = options.type || 'button';
    
    return new Button(button, options);
  },
  
  /**
   * Create an input element with fitness theme
   */
  createInput(type = 'text', options = {}) {
    const input = document.createElement('input');
    input.type = type;
    if (options.placeholder) input.placeholder = options.placeholder;
    if (options.name) input.name = options.name;
    if (options.id) input.id = options.id;
    
    return new Input(input, options);
  },
  
  /**
   * Create a card element with fitness theme
   */
  createCard(options = {}) {
    const card = document.createElement('div');
    const cardComponent = new Card(card, options);
    
    if (options.title || options.content) {
      const header = document.createElement('div');
      const content = document.createElement('div');
      
      new CardHeader(header);
      new CardContent(content);
      
      if (options.title) {
        const title = document.createElement('h3');
        title.className = 'text-lg font-semibold text-text-primary';
        title.textContent = options.title;
        header.appendChild(title);
      }
      
      if (options.content) {
        if (typeof options.content === 'string') {
          content.innerHTML = options.content;
        } else {
          content.appendChild(options.content);
        }
      }
      
      card.appendChild(header);
      card.appendChild(content);
    }
    
    return cardComponent;
  },
  
  /**
   * Create a modal with fitness theme
   */
  createModal(options = {}) {
    return new Modal(options);
  }
};

/**
 * Global component registry for managing component instances
 */
export class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.eventListeners = new Map();
  }
  
  register(id, component) {
    this.components.set(id, component);
  }
  
  unregister(id) {
    const component = this.components.get(id);
    if (component && typeof component.destroy === 'function') {
      component.destroy();
    }
    this.components.delete(id);
  }
  
  get(id) {
    return this.components.get(id);
  }
  
  getAll() {
    return Array.from(this.components.values());
  }
  
  clear() {
    this.components.forEach((component, id) => {
      this.unregister(id);
    });
  }
  
  // Event system for component communication
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }
  
  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
  
  off(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}

// Global registry instance
export const globalRegistry = new ComponentRegistry();

// Make components available globally for debugging
if (typeof window !== 'undefined') {
  window.FitnessUI = {
    Button,
    Input,
    Card,
    Modal,
    ComponentFactory,
    registry: globalRegistry,
    initialize: initializeComponents,
    themeProvider: getThemeProvider()
  };
}