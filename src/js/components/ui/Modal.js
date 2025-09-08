import { cn } from "../../utils/cn.js";

/**
 * Modal component with backdrop blur and smooth animations
 */
export class Modal {
  constructor(options = {}) {
    this.options = {
      size: 'default',
      closeOnBackdrop: true,
      closeOnEscape: true,
      showCloseButton: true,
      ...options
    };
    
    this.isOpen = false;
    this.element = null;
    this.backdrop = null;
    
    this.init();
  }

  init() {
    this.createElement();
    this.bindEvents();
  }

  createElement() {
    // Create backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = cn(
      'fixed',
      'inset-0',
      'z-50',
      'bg-black/80',
      'backdrop-blur-sm',
      'opacity-0',
      'transition-opacity',
      'duration-300',
      'pointer-events-none'
    );

    // Create modal container
    this.element = document.createElement('div');
    this.element.className = cn(
      'fixed',
      'inset-0',
      'z-50',
      'flex',
      'items-center',
      'justify-center',
      'p-4',
      'pointer-events-none'
    );

    // Create modal content
    this.content = document.createElement('div');
    
    const sizes = {
      sm: ['max-w-sm'],
      default: ['max-w-lg'],
      lg: ['max-w-2xl'],
      xl: ['max-w-4xl'],
      full: ['max-w-full', 'h-full']
    };

    this.content.className = cn(
      'relative',
      'w-full',
      'rounded-xl',
      'border',
      'border-primary-500/20',
      'bg-background-card/95',
      'backdrop-blur-md',
      'shadow-glass',
      'transform',
      'scale-95',
      'opacity-0',
      'transition-all',
      'duration-300',
      'pointer-events-auto',
      sizes[this.options.size] || sizes.default
    );

    // Create close button if enabled
    if (this.options.showCloseButton) {
      this.closeButton = document.createElement('button');
      this.closeButton.className = cn(
        'absolute',
        'right-4',
        'top-4',
        'rounded-sm',
        'opacity-70',
        'ring-offset-background-main',
        'transition-opacity',
        'hover:opacity-100',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary-500',
        'focus:ring-offset-2',
        'disabled:pointer-events-none',
        'z-10'
      );
      this.closeButton.innerHTML = `
        <svg class="h-4 w-4 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      `;
      this.content.appendChild(this.closeButton);
    }

    // Create header
    this.header = document.createElement('div');
    this.header.className = cn(
      'flex',
      'flex-col',
      'space-y-1.5',
      'text-center',
      'sm:text-left',
      'p-6',
      'pb-0'
    );

    // Create body
    this.body = document.createElement('div');
    this.body.className = cn('p-6');

    // Create footer
    this.footer = document.createElement('div');
    this.footer.className = cn(
      'flex',
      'flex-col-reverse',
      'sm:flex-row',
      'sm:justify-end',
      'sm:space-x-2',
      'p-6',
      'pt-0'
    );

    this.content.appendChild(this.header);
    this.content.appendChild(this.body);
    this.content.appendChild(this.footer);
    this.element.appendChild(this.content);

    // Add to document
    document.body.appendChild(this.backdrop);
    document.body.appendChild(this.element);
  }

  bindEvents() {
    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }

    // Backdrop click
    if (this.options.closeOnBackdrop) {
      this.backdrop.addEventListener('click', () => this.close());
      this.element.addEventListener('click', (e) => {
        if (e.target === this.element) {
          this.close();
        }
      });
    }

    // Escape key
    if (this.options.closeOnEscape) {
      this.handleEscape = (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      };
      document.addEventListener('keydown', this.handleEscape);
    }
  }

  setTitle(title) {
    let titleElement = this.header.querySelector('.modal-title');
    if (!titleElement) {
      titleElement = document.createElement('h2');
      titleElement.className = 'modal-title text-lg font-semibold text-text-primary';
      this.header.appendChild(titleElement);
    }
    titleElement.textContent = title;
    return this;
  }

  setDescription(description) {
    let descElement = this.header.querySelector('.modal-description');
    if (!descElement) {
      descElement = document.createElement('p');
      descElement.className = 'modal-description text-sm text-text-muted';
      this.header.appendChild(descElement);
    }
    descElement.textContent = description;
    return this;
  }

  setContent(content) {
    if (typeof content === 'string') {
      this.body.innerHTML = content;
    } else {
      this.body.innerHTML = '';
      this.body.appendChild(content);
    }
    return this;
  }

  setFooter(content) {
    if (typeof content === 'string') {
      this.footer.innerHTML = content;
    } else {
      this.footer.innerHTML = '';
      this.footer.appendChild(content);
    }
    return this;
  }

  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Show backdrop
    this.backdrop.style.pointerEvents = 'auto';
    this.element.style.pointerEvents = 'auto';
    
    // Animate in
    requestAnimationFrame(() => {
      this.backdrop.style.opacity = '1';
      this.content.style.opacity = '1';
      this.content.style.transform = 'scale(1)';
    });

    // Trigger open event
    this.element.dispatchEvent(new CustomEvent('modal:open', {
      detail: { modal: this }
    }));

    return this;
  }

  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    
    // Animate out
    this.backdrop.style.opacity = '0';
    this.content.style.opacity = '0';
    this.content.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      this.backdrop.style.pointerEvents = 'none';
      this.element.style.pointerEvents = 'none';
      document.body.style.overflow = '';
    }, 300);

    // Trigger close event
    this.element.dispatchEvent(new CustomEvent('modal:close', {
      detail: { modal: this }
    }));

    return this;
  }

  destroy() {
    this.close();
    
    setTimeout(() => {
      if (this.handleEscape) {
        document.removeEventListener('keydown', this.handleEscape);
      }
      
      if (this.backdrop && this.backdrop.parentNode) {
        this.backdrop.parentNode.removeChild(this.backdrop);
      }
      
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }, 300);
  }
}

// Factory function for easy modal creation
export function createModal(options = {}) {
  return new Modal(options);
}

// Utility function for quick alerts
export function showAlert(title, message, options = {}) {
  const modal = createModal({
    size: 'sm',
    ...options
  });
  
  modal
    .setTitle(title)
    .setContent(`<p class="text-text-secondary">${message}</p>`)
    .setFooter(`
      <button class="modal-ok-btn px-4 py-2 bg-gradient-blue-green text-white rounded-lg hover:shadow-glow-blue transition-all duration-300">
        OK
      </button>
    `)
    .open();
  
  // Bind OK button
  const okBtn = modal.footer.querySelector('.modal-ok-btn');
  okBtn.addEventListener('click', () => modal.close());
  
  return modal;
}

// Utility function for confirmations
export function showConfirm(title, message, options = {}) {
  return new Promise((resolve) => {
    const modal = createModal({
      size: 'sm',
      closeOnBackdrop: false,
      closeOnEscape: false,
      ...options
    });
    
    modal
      .setTitle(title)
      .setContent(`<p class="text-text-secondary">${message}</p>`)
      .setFooter(`
        <div class="flex space-x-2 w-full sm:w-auto">
          <button class="modal-cancel-btn flex-1 px-4 py-2 border border-primary-500/20 text-text-secondary rounded-lg hover:bg-background-elevated transition-all duration-300">
            Cancel
          </button>
          <button class="modal-confirm-btn flex-1 px-4 py-2 bg-gradient-blue-green text-white rounded-lg hover:shadow-glow-blue transition-all duration-300">
            Confirm
          </button>
        </div>
      `)
      .open();
    
    // Bind buttons
    const cancelBtn = modal.footer.querySelector('.modal-cancel-btn');
    const confirmBtn = modal.footer.querySelector('.modal-confirm-btn');
    
    cancelBtn.addEventListener('click', () => {
      modal.close();
      resolve(false);
    });
    
    confirmBtn.addEventListener('click', () => {
      modal.close();
      resolve(true);
    });
  });
}