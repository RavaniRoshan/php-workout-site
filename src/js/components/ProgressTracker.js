// ProgressTracker.js
export class ProgressTracker {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            type: 'circular', // 'circular' or 'linear'
            size: 'medium', // 'small', 'medium', or 'large'
            showLabel: true,
            animate: true,
            duration: 1.5,
            ease: 'power1.out',
            ...options
        };
        this.progress = 0;
        this.animation = null;
        this.init();
    }

    init() {
        this._createLayout();
        this._setupEventListeners();
        
        if (this.options.animate) {
            this._initAnimations();
        }
    }

    _createLayout() {
        // Create progress tracker container
        this.trackerContainer = document.createElement('div');
        this.trackerContainer.className = `progress-tracker-container ${this._getSizeClass()} ${this.options.type}-progress`;
        
        // Create progress tracker content based on type
        if (this.options.type === 'circular') {
            this.trackerContainer.innerHTML = `
                <div class="circular-progress relative w-full h-full">
                    <svg class="progress-svg w-full h-full" viewBox="0 0 100 100">
                        <circle class="progress-bg" cx="50" cy="50" r="45" fill="none" stroke="#1A2332" stroke-width="8"/>
                        <circle class="progress-ring" cx="50" cy="50" r="45" fill="none" stroke="#39FF7A" stroke-width="8" stroke-linecap="round" transform="rotate(-90 50 50)" stroke-dasharray="282.743" stroke-dashoffset="282.743"/>
                    </svg>
                    ${this.options.showLabel ? `
                    <div class="progress-label absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div class="progress-percentage text-2xl font-bold text-white">0%</div>
                        <div class="progress-text text-sm text-gray-400">Progress</div>
                    </div>` : ''}
                </div>
            `;
        } else { // linear
            this.trackerContainer.innerHTML = `
                <div class="linear-progress w-full">
                    <div class="progress-header flex justify-between items-center mb-2">
                        <div class="progress-title font-medium text-white">Progress</div>
                        ${this.options.showLabel ? `<div class="progress-percentage text-sm text-white">0%</div>` : ''}
                    </div>
                    <div class="progress-bar bg-gray-700 rounded-full overflow-hidden">
                        <div class="progress-fill h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transform origin-left scale-x-0"></div>
                    </div>
                </div>
            `;
        }
        
        // Add to container
        this.container.appendChild(this.trackerContainer);
        
        // Get references to elements
        this.progressElements = {
            container: this.trackerContainer,
            percentage: this.trackerContainer.querySelector('.progress-percentage'),
            progressFill: this.trackerContainer.querySelector('.progress-fill'),
            progressRing: this.trackerContainer.querySelector('.progress-ring'),
            progressText: this.trackerContainer.querySelector('.progress-text')
        };
    }

    _getSizeClass() {
        switch (this.options.size) {
            case 'small': return 'w-24 h-24';
            case 'medium': return 'w-32 h-32';
            case 'large': return 'w-40 h-40';
            default: return 'w-32 h-32';
        }
    }

    _setupEventListeners() {
        // Add resize listener to handle responsive updates
        window.addEventListener('resize', () => {
            if (this.options.type === 'circular' && this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            
            if (this.options.type === 'circular') {
                this.resizeTimeout = setTimeout(() => {
                    this.update(this.progress, true);
                }, 200);
            }
        });
    }

    _initAnimations() {
        // Create GSAP animation for progress
        this.animation = gsap.to(this.progressElements, {
            duration: this.options.duration,
            ease: this.options.ease,
            onUpdate: () => {
                this._updateProgressDisplay();
            },
            paused: true
        });
    }

    _updateProgressDisplay() {
        const progress = Math.round(this.progress * 100);
        
        // Update percentage label
        if (this.progressElements.percentage) {
            this.progressElements.percentage.textContent = `${progress}%`;
        }
        
        // Update progress display based on type
        if (this.options.type === 'circular') {
            const circumference = 2 * Math.PI * 45;
            const dashOffset = circumference * (1 - this.progress);
            
            if (this.progressElements.progressRing) {
                this.progressElements.progressRing.style.strokeDashoffset = dashOffset;
            }
            
            // Update text color based on progress
            if (this.progressElements.progressText) {
                if (this.progress >= 0.75) {
                    this.progressElements.progressText.classList.remove('text-gray-400');
                    this.progressElements.progressText.classList.add('text-green-500');
                } else if (this.progress >= 0.5) {
                    this.progressElements.progressText.classList.remove('text-gray-400', 'text-green-500');
                    this.progressElements.progressText.classList.add('text-blue-500');
                } else {
                    this.progressElements.progressText.classList.remove('text-blue-500', 'text-green-500');
                    this.progressElements.progressText.classList.add('text-gray-400');
                }
            }
        } else { // linear
            if (this.progressElements.progressFill) {
                this.progressElements.progressFill.style.transform = `scaleX(${this.progress})`;
            }
        }
        
        // Add celebration effect when reaching milestones
        if (progress === 100 && this.options.animate) {
            this._celebrateCompletion();
        }
    }

    _celebrateCompletion() {
        // Create celebration effect
        const celebration = document.createElement('div');
        celebration.className = 'celebration absolute inset-0 pointer-events-none';
        celebration.innerHTML = `
            <div class="celebration-effects">
                <div class="sparkles"></div>
                <div class="confetti"></div>
                <div class="stars"></div>
            </div>
        `;
        
        this.container.appendChild(celebration);
        
        // Animate celebration
        if (this.options.animate) {
            const tl = gsap.timeline();
            
            // Sparkles effect
            tl.to(celebration.querySelector('.sparkles'), {
                duration: 0.5,
                opacity: 1,
                onComplete: () => {
                    celebration.querySelector('.sparkles').style.background = 'none';
                }
            });
            
            // Confetti effect
            tl.to(celebration.querySelector('.confetti'), {
                duration: 1,
                opacity: 1,
                onComplete: () => {
                    celebration.querySelector('.confetti').style.background = 'none';
                }
            }, '-=0.3');
            
            // Stars effect
            tl.to(celebration.querySelector('.stars'), {
                duration: 1.5,
                opacity: 1,
                onComplete: () => {
                    celebration.querySelector('.stars').style.background = 'none';
                }
            }, '-=0.5');
            
            // Remove celebration elements after animation
            tl.to(celebration, {
                duration: 0.5,
                opacity: 0,
                onComplete: () => {
                    if (celebration.parentNode) {
                        celebration.parentNode.removeChild(celebration);
                    }
                }
            }, '+=0.5');
        }
    }

    update(progress, animate = true) {
        // Ensure progress is between 0 and 1
        this.progress = Math.max(0, Math.min(1, progress));
        
        if (animate && this.options.animate && this.animation) {
            // Animate progress update
            this.animation.progress(0).time(0);
            this.animation.duration(this.options.duration);
            this.animation.vars.ease = this.options.ease;
            this.animation.invalidate();
            
            gsap.to(this.progressElements, {
                duration: this.options.duration,
                ease: this.options.ease,
                onUpdate: () => {
                    this.progress = this.progress;
                    this._updateProgressDisplay();
                }
            });
        } else {
            // Update without animation
            this._updateProgressDisplay();
        }
    }

    // Method to update progress with animation
    animateProgressTo(progress, duration = this.options.duration, ease = this.options.ease) {
        if (!this.options.animate) return;
        
        this.options.duration = duration;
        this.options.ease = ease;
        
        gsap.to(this.progressElements, {
            duration: duration,
            ease: ease,
            onUpdate: () => {
                this.progress = this.progress;
                this._updateProgressDisplay();
            }
        });
    }

    // Method to get current progress
    getProgress() {
        return this.progress;
    }

    // Method to reset progress
    reset() {
        this.update(0, false);
    }

    // Method to complete progress
    complete() {
        this.update(1, this.options.animate);
    }

    // Method to add progress
    addProgress(value) {
        const newProgress = Math.min(1, this.progress + value);
        this.update(newProgress, this.options.animate);
    }

    // Method to destroy component
    destroy() {
        if (this.animation) {
            this.animation.kill();
            this.animation = null;
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this._setupEventListeners);
        
        // Remove DOM elements
        if (this.trackerContainer && this.trackerContainer.parentNode) {
            this.trackerContainer.parentNode.removeChild(this.trackerContainer);
        }
        this.trackerContainer = null;
    }
}