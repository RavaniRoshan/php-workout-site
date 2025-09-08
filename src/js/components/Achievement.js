// Achievement.js
export class Achievement {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            enableAnimations: true,
            showNotification: true,
            autoDismiss: true,
            dismissDelay: 5000,
            type: 'achievement', // 'achievement', 'milestone', or 'level-up'
            ...options
        };
        this.unlocked = false;
        this.animation = null;
        this.init();
    }

    init() {
        this._createLayout();
        this._setupEventListeners();
        
        if (this.options.enableAnimations) {
            this._initAnimations();
        }
    }

    _createLayout() {
        // Create achievement container
        this.achievementContainer = document.createElement('div');
        this.achievementContainer.className = `achievement-container relative bg-gray-800 rounded-lg overflow-hidden shadow-lg ${this._getTypeClass()}`;
        
        // Create achievement content based on type
        switch (this.options.type) {
            case 'level-up':
                this.achievementContainer.innerHTML = `
                    <div class="achievement-badge absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center z-10">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7v-18"></path>
                        </svg>
                    </div>
                    <div class="achievement-content relative z-0 p-6">
                        <div class="achievement-header flex items-center mb-4">
                            <div class="achievement-icon w-12 h-12 mr-4">
                                <svg class="w-full h-full text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 4.016"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white">Level Up!</h3>
                                <p class="text-gray-400">You've reached a new level</p>
                            </div>
                        </div>
                        <div class="achievement-details">
                            <p class="text-gray-300 mb-4">Congratulations! You've reached level <span class="level-number text-white font-bold">1</span> in your fitness journey.</p>
                            <div class="achievement-progress">
                                <div class="progress-bar bg-gray-700 rounded-full overflow-hidden h-3 mb-2">
                                    <div class="progress-fill h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform origin-left scale-x-0"></div>
                                </div>
                                <div class="flex justify-between text-xs text-gray-500">
                                    <span>Level 1</span>
                                    <span>Level 2</span>
                                </div>
                            </div>
                        </div>
                        <div class="achievement-actions mt-6 flex justify-end">
                            <button class="dismiss-button bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                                Dismiss
                            </button>
                        </div>
                    </div>
                `;
                break;
            case 'milestone':
                this.achievementContainer.innerHTML = `
                    <div class="achievement-badge absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center z-10">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <div class="achievement-content relative z-0 p-6">
                        <div class="achievement-header flex items-center mb-4">
                            <div class="achievement-icon w-12 h-12 mr-4">
                                <svg class="w-full h-full text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white">Milestone Unlocked</h3>
                                <p class="text-gray-400">Keep up the great work</p>
                            </div>
                        </div>
                        <div class="achievement-details">
                            <p class="text-gray-300 mb-4">You've completed <span class="workouts-completed text-white font-bold">10</span> workouts! This is a significant milestone in your fitness journey.</p>
                            <div class="achievement-progress">
                                <div class="progress-bar bg-gray-700 rounded-full overflow-hidden h-3 mb-2">
                                    <div class="progress-fill h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transform origin-left scale-x-0"></div>
                                </div>
                                <div class="flex justify-between text-xs text-gray-500">
                                    <span>0 workouts</span>
                                    <span>20 workouts</span>
                                </div>
                            </div>
                        </div>
                        <div class="achievement-actions mt-6 flex justify-end">
                            <button class="dismiss-button bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                                Dismiss
                            </button>
                        </div>
                    </div>
                `;
                break;
            default: // achievement
                this.achievementContainer.innerHTML = `
                    <div class="achievement-badge absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center z-10">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="achievement-content relative z-0 p-6">
                        <div class="achievement-header flex items-center mb-4">
                            <div class="achievement-icon w-12 h-12 mr-4">
                                <svg class="w-full h-full text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white">Achievement Unlocked</h3>
                                <p class="text-gray-400">Well done!</p>
                            </div>
                        </div>
                        <div class="achievement-details">
                            <p class="text-gray-300 mb-4">You've completed your first <span class="achievement-name text-white font-bold">workout</span>! This is the beginning of your fitness journey.</p>
                        </div>
                        <div class="achievement-actions mt-6 flex justify-end">
                            <button class="dismiss-button bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                                Dismiss
                            </button>
                        </div>
                    </div>
                `;
                break;
        }
        
        // Add to container
        this.container.appendChild(this.achievementContainer);
        
        // Get references to elements
        this.badge = this.achievementContainer.querySelector('.achievement-badge');
        this.icon = this.achievementContainer.querySelector('.achievement-icon');
        this.name = this.achievementContainer.querySelector('.achievement-name');
        this.level = this.achievementContainer.querySelector('.level-number');
        this.workoutsCompleted = this.achievementContainer.querySelector('.workouts-completed');
        this.dismissButton = this.achievementContainer.querySelector('.dismiss-button');
        this.progressFill = this.achievementContainer.querySelector('.progress-fill');
    }

    _getTypeClass() {
        switch (this.options.type) {
            case 'level-up': return 'achievement-level-up';
            case 'milestone': return 'achievement-milestone';
            default: return 'achievement-default';
        }
    }

    _setupEventListeners() {
        // Dismiss button click handler
        this.dismissButton.addEventListener('click', () => {
            this.dismiss();
        });
        
        // Auto dismiss after delay
        if (this.options.autoDismiss) {
            this.dismissTimeout = setTimeout(() => {
                this.dismiss();
            }, this.options.dismissDelay);
        }
    }

    _initAnimations() {
        // Create GSAP animation timeline
        this.animation = gsap.timeline({
            paused: true
        });
        
        // Add animations based on type
        switch (this.options.type) {
            case 'level-up':
                // Level up animation
                this.animation.fromTo(this.badge, {
                    scale: 0.5,
                    rotation: -180
                }, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)'
                });
                
                this.animation.fromTo(this.icon, {
                    scale: 0.5,
                    rotation: 180
                }, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)'
                }, '-=0.4');
                
                this.animation.fromTo(this.achievementContent, {
                    opacity: 0,
                    y: 20
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5
                }, '-=0.3');
                
                // Add level up animation
                this.animation.add('level-up', () => {
                    const levelNumber = this.level;
                    if (levelNumber) {
                        const tl = gsap.timeline();
                        tl.to(levelNumber, {
                            duration: 0.3,
                            scale: 1.5,
                            color: '#fff',
                            ease: 'power1.inOut'
                        });
                        
                        tl.to(levelNumber, {
                            duration: 0.3,
                            scale: 1,
                            color: '#ffd700',
                            ease: 'power1.inOut'
                        });
                    }
                });
                
                // Add progress animation for milestone type
                if (this.options.type === 'milestone') {
                    this.animation.add('milestone-progress', () => {
                        if (this.progressFill) {
                            gsap.to(this.progressFill, {
                                duration: 1.5,
                                scaleX: 0.5,
                                ease: 'power2.out',
                                onComplete: () => {
                                    gsap.to(this.progressFill, {
                                        duration: 0.5,
                                        scaleX: 1,
                                        ease: 'elastic.out(1, 0.3)'
                                    });
                                }
                            });
                        }
                    });
                }
                
                // Add celebration effect
                this.animation.add('celebration', () => {
                    this._celebrateAchievement();
                });
                
                // Add auto dismiss animation
                this.animation.add('auto-dismiss', () => {
                    if (this.options.autoDismiss) {
                        setTimeout(() => {
                            this.dismiss();
                        }, 4000);
                    }
                });
                
                // Play the animation
                this.animation.play();
                
                break;
            
            case 'milestone':
                // Milestone animation
                this.animation.fromTo(this.badge, {
                    scale: 0.5,
                    rotation: 360
                }, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.3)'
                });
                
                this.animation.fromTo(this.icon, {
                    scale: 0.5,
                    rotation: -180
                }, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)'
                }, '-=0.5');
                
                this.animation.fromTo(this.achievementContainer, {
                    opacity: 0,
                    y: 30
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5
                }, '-=0.3');
                
                // Add milestone progress animation
                this.animation.add('milestone-progress', () => {
                    if (this.progressFill) {
                        gsap.to(this.progressFill, {
                            duration: 1.5,
                            scaleX: 0.5,
                            ease: 'power2.out',
                            onComplete: () => {
                                gsap.to(this.progressFill, {
                                    duration: 0.5,
                                    scaleX: 1,
                                    ease: 'elastic.out(1, 0.3)'
                                });
                            }
                        });
                    }
                });
                
                // Add celebration effect
                this.animation.add('celebration', () => {
                    this._celebrateAchievement();
                });
                
                // Add auto dismiss animation
                this.animation.add('auto-dismiss', () => {
                    if (this.options.autoDismiss) {
                        setTimeout(() => {
                            this.dismiss();
                        }, 4000);
                    }
                });
                
                // Play the animation
                this.animation.play();
                
                break;
            
            default: // default achievement
                // Default achievement animation
                this.animation.fromTo(this.badge, {
                    scale: 0.5,
                    rotation: -180
                }, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.3)'
                });
                
                this.animation.fromTo(this.icon, {
                    scale: 0.5,
                    rotation: 180
                }, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)'
                }, '-=0.5');
                
                this.animation.fromTo(this.achievementContainer, {
                    opacity: 0,
                    y: 30
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5
                }, '-=0.3');
                
                // Add celebration effect
                this.animation.add('celebration', () => {
                    this._celebrateAchievement();
                });
                
                // Add auto dismiss animation
                this.animation.add('auto-dismiss', () => {
                    if (this.options.autoDismiss) {
                        setTimeout(() => {
                            this.dismiss();
                        }, 4000);
                    }
                });
                
                // Play the animation
                this.animation.play();
                
                break;
        }
    }

    _celebrateAchievement() {
        // Create celebration effect
        const celebration = document.createElement('div');
        celebration.className = 'achievement-celebration absolute inset-0 pointer-events-none';
        celebration.innerHTML = `
            <div class="celebration-effects">
                <div class="sparkles"></div>
                <div class="confetti"></div>
                <div class="stars"></div>
                <div class="fireworks"></div>
            </div>
        `;
        
        this.container.appendChild(celebration);
        
        // Animate celebration
        if (this.options.enableAnimations) {
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
            
            // Fireworks effect
            tl.to(celebration.querySelector('.fireworks'), {
                duration: 2,
                opacity: 1,
                onComplete: () => {
                    celebration.querySelector('.fireworks').style.background = 'none';
                }
            }, '-=1');
            
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

    // Method to unlock achievement
    unlock(achievementData = {}) {
        // Update achievement data
        this._updateAchievementData(achievementData);
        
        // Show achievement
        this.achievementContainer.classList.remove('hidden');
        
        // Play unlock animation
        if (this.animation) {
            this.animation.play();
        }
        
        this.unlocked = true;
        
        // Trigger event
        const event = new CustomEvent('achievementUnlocked', {
            detail: {
                achievement: this
            }
        });
        document.dispatchEvent(event);
    }

    // Method to update achievement data
    _updateAchievementData(data) {
        // Update DOM elements with new data
        if (data.name && this.name) {
            this.name.textContent = data.name;
        }
        
        if (data.level && this.level) {
            this.level.textContent = data.level;
        }
        
        if (data.workoutsCompleted && this.workoutsCompleted) {
            this.workoutsCompleted.textContent = data.workoutsCompleted;
        }
        
        // Update progress bar if it exists
        if (data.progress && this.progressFill) {
            this.progressFill.style.transform = `scaleX(${data.progress})`;
        }
    }

    // Method to dismiss achievement
    dismiss() {
        // Play dismiss animation
        if (this.animation) {
            this.animation.reverse();
        }
        
        // Remove DOM element
        setTimeout(() => {
            if (this.achievementContainer && this.achievementContainer.parentNode) {
                this.achievementContainer.parentNode.removeChild(this.achievementContainer);
            }
            this.unlocked = false;
            
            // Trigger event
            const event = new CustomEvent('achievementDismissed', {
                detail: {
                    achievement: this
                }
            });
            document.dispatchEvent(event);
        }, 500);
    }

    // Method to get achievement type class
    _getTypeClass() {
        switch (this.options.type) {
            case 'level-up': return 'bg-gradient-to-br from-blue-500 to-purple-600';
            case 'milestone': return 'bg-gradient-to-br from-purple-500 to-pink-600';
            default: return 'bg-gradient-to-br from-yellow-400 to-orange-500';
        }
    }

    // Method to show achievement notification
    showNotification(message, duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `achievement-notification fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 opacity-0 transform translate-y-4`;
        notification.innerHTML = `
            <div class="flex items-center">
                <div class="mr-3">
                    <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <div class="font-bold">${message}</div>
                </div>
                <div class="ml-3">
                    <svg class="w-5 h-5 text-gray-400 hover:text-gray-200 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show animation
        gsap.to(notification, {
            duration: 0.3,
            opacity: 1,
            y: 0,
            ease: 'power1.out'
        });
        
        // Add close button handler
        const closeButton = notification.querySelector('svg');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this._dismissNotification(notification);
            });
        }
        
        // Auto dismiss after duration
        this.notificationTimeout = setTimeout(() => {
            this._dismissNotification(notification);
        }, duration);
    }

    _dismissNotification(notification) {
        // Dismiss animation
        gsap.to(notification, {
            duration: 0.3,
            opacity: 0,
            y: 4,
            ease: 'power1.in',
            onComplete: () => {
                if (notification && notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }
        });
        
        // Clear timeout
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
            this.notificationTimeout = null;
        }
    }

    // Method to show achievement
    show() {
        // Show achievement container
        this.achievementContainer.classList.remove('hidden');
        
        // Play animation
        if (this.animation) {
            this.animation.play();
        }
    }

    // Method to hide achievement
    hide() {
        // Play reverse animation
        if (this.animation) {
            this.animation.reverse();
        }
        
        // Hide DOM element
        setTimeout(() => {
            if (this.achievementContainer && this.achievementContainer.parentNode) {
                this.achievementContainer.parentNode.removeChild(this.achievementContainer);
            }
            this.unlocked = false;
        }, 500);
    }

    // Method to get current achievement data
    getData() {
        return {
            name: this.name ? this.name.textContent : null,
            level: this.level ? this.level.textContent : null,
            workoutsCompleted: this.workoutsCompleted ? this.workoutsCompleted.textContent : null,
            unlocked: this.unlocked
        };
    }

    // Method to destroy component
    destroy() {
        // Remove event listeners
        this.dismissButton = null;
        
        // Kill animations
        if (this.animation) {
            this.animation.kill();
            this.animation = null;
        }
        
        // Remove DOM elements
        if (this.achievementContainer && this.achievementContainer.parentNode) {
            this.achievementContainer.parentNode.removeChild(this.achievementContainer);
        }
        this.achievementContainer = null;
    }
}