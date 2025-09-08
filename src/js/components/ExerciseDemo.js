// ExerciseDemo.js
export class ExerciseDemo {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            enableAnimations: true,
            showControls: true,
            autoPlay: false,
            loop: true,
            ...options
        };
        this.currentStep = 0;
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
        // Create exercise demo container
        this.demoContainer = document.createElement('div');
        this.demoContainer.className = 'exercise-demo-container relative bg-gray-800 rounded-lg overflow-hidden';
        
        // Create exercise demo content
        this.demoContainer.innerHTML = `
            <div class="exercise-demo relative h-64 md:h-80 lg:h-96">
                <div class="demo-visualization absolute inset-0 flex items-center justify-center">
                    <!-- Placeholder for exercise visualization -->
                    <div class="exercise-visualization-placeholder w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 rounded-full bg-gray-700 flex items-center justify-center">
                        <div class="text-center">
                            <div class="text-gray-400 text-lg md:text-xl">Exercise</div>
                            <div class="text-white text-xl md:text-2xl font-bold mt-2">Visualization</div>
                        </div>
                    </div>
                </div>
                
                <div class="demo-steps absolute inset-0 p-4 md:p-6 lg:p-8 hidden">
                    <div class="step-indicator flex justify-center mb-4">
                        <div class="step-dots flex space-x-2">
                            ${Array.from({length: 4}).map((_, i) => 
                                `<div class="step-dot w-2 h-2 rounded-full bg-gray-500 ${i === 0 ? 'bg-white' : ''}"></div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="step-content">
                        <div class="step step-1 ${this.currentStep === 0 ? 'active' : ''}">
                            <h3 class="text-lg md:text-xl font-bold text-white mb-2">Starting Position</h3>
                            <p class="text-gray-300">Stand tall with your feet shoulder-width apart, arms extended overhead.</p>
                        </div>
                        <div class="step step-2 ${this.currentStep === 1 ? 'active' : ''}">
                            <h3 class="text-lg md:text-xl font-bold text-white mb-2">Movement</h3>
                            <p class="text-gray-300">Squat down until your thighs are parallel to the ground, keeping your chest up.</p>
                        </div>
                        <div class="step step-3 ${this.currentStep === 2 ? 'active' : ''}">
                            <h3 class="text-lg md:text-xl font-bold text-white mb-2">Return</h3>
                            <p class="text-gray-300">Push through your heels to return to the starting position.</p>
                        </div>
                        <div class="step step-4 ${this.currentStep === 3 ? 'active' : ''}">
                            <h3 class="text-lg md:text-xl font-bold text-white mb-2">Repetition</h3>
                            <p class="text-gray-300">Repeat for the desired number of repetitions.</p>
                        </div>
                    </div>
                </div>
                
                <div class="demo-controls absolute bottom-4 right-4 flex space-x-2">
                    <button class="prev-step bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors disabled:opacity-50" ${this.currentStep === 0 ? 'disabled' : ''}>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button class="play-pause bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors">
                        <svg class="w-4 h-4 play-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <svg class="w-4 h-4 pause-icon hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </button>
                    <button class="next-step bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors" ${this.currentStep === 3 ? 'disabled' : ''}>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // Add to container
        this.container.appendChild(this.demoContainer);
        
        // Get references to elements
        this.visualization = this.demoContainer.querySelector('.exercise-visualization-placeholder');
        this.stepsContainer = this.demoContainer.querySelector('.demo-steps');
        this.stepIndicators = this.demoContainer.querySelectorAll('.step-dots .step-dot');
        this.steps = this.demoContainer.querySelectorAll('.step');
        this.prevButton = this.demoContainer.querySelector('.prev-step');
        this.nextButton = this.demoContainer.querySelector('.next-step');
        this.playPauseButton = this.demoContainer.querySelector('.play-pause');
    }

    _setupEventListeners() {
        this.prevButton.addEventListener('click', () => {
            if (this.currentStep > 0) {
                this.currentStep--;
                this._updateSteps();
                
                if (this.options.enableAnimations && this.animation) {
                    this.animation.reverse();
                }
            }
        });
        
        this.nextButton.addEventListener('click', () => {
            if (this.currentStep < 3) {
                this.currentStep++;
                this._updateSteps();
                
                if (this.options.enableAnimations && this.animation) {
                    this.animation.play();
                }
            }
        });
        
        this.playPauseButton.addEventListener('click', () => {
            if (this.options.enableAnimations && this.animation) {
                if (this.animation.paused()) {
                    this.animation.play();
                    this.playPauseButton.querySelector('.play-icon').classList.add('hidden');
                    this.playPauseButton.querySelector('.pause-icon').classList.remove('hidden');
                } else {
                    this.animation.pause();
                    this.playPauseButton.querySelector('.pause-icon').classList.add('hidden');
                    this.playPauseButton.querySelector('.play-icon').classList.remove('hidden');
                }
            }
        });
    }

    _initAnimations() {
        // Create GSAP animation timeline
        this.animation = gsap.timeline({
            paused: true,
            repeat: this.options.loop ? -1 : 0,
            onReverseComplete: () => {
                if (!this.options.loop) {
                    this.playPauseButton.querySelector('.pause-icon').classList.add('hidden');
                    this.playPauseButton.querySelector('.play-icon').classList.remove('hidden');
                }
            },
            onRepeat: () => {
                this.currentStep = 0;
                this._updateSteps();
            }
        });
        
        // Add steps to animation
        const stepDuration = 1.5;
        const visualization = this.visualization;
        
        // Step 1: Starting Position
        this.animation.to(visualization, {
            duration: stepDuration,
            scale: 1.1,
            ease: 'power1.inOut'
        });
        
        // Step 2: Movement
        this.animation.to(visualization, {
            duration: stepDuration,
            y: 30,
            scale: 0.95,
            ease: 'power1.inOut'
        }, '-=0.5');
        
        // Step 3: Return
        this.animation.to(visualization, {
            duration: stepDuration,
            y: 0,
            scale: 1,
            ease: 'power1.inOut'
        }, '-=0.5');
        
        // Step 4: Repetition
        this.animation.to(visualization, {
            duration: stepDuration,
            scale: 1.05,
            ease: 'power1.inOut'
        }, '-=0.5');
        
        // Add scroll trigger for auto-play
        if (ScrollTrigger) {
            ScrollTrigger.create({
                trigger: this.demoContainer,
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => {
                    if (this.options.autoPlay && this.animation) {
                        this.animation.play();
                    }
                },
                onEnterBack: () => {
                    if (this.options.autoPlay && this.animation) {
                        this.animation.play();
                    }
                },
                onLeave: () => {
                    if (this.options.autoPlay && this.animation) {
                        this.animation.pause();
                    }
                },
                onLeaveBack: () => {
                    if (this.options.autoPlay && this.animation) {
                        this.animation.pause();
                    }
                }
            });
        }
    }

    _updateSteps() {
        // Update step indicators
        this.stepIndicators.forEach((dot, index) => {
            dot.classList.toggle('bg-white', index === this.currentStep);
            dot.classList.toggle('bg-gray-500', index !== this.currentStep);
        });
        
        // Update step content
        this.steps.forEach((step, index) => {
            step.classList.toggle('active', index === this.currentStep);
        });
        
        // Update button states
        this.prevButton.disabled = this.currentStep === 0;
        this.nextButton.disabled = this.currentStep === 3;
        
        // If animation exists, seek to appropriate point
        if (this.animation) {
            const progress = this.currentStep / 3;
            this.animation.progress(progress);
        }
    }

    // Public method to update exercise data
    updateExercise(exercise) {
        // Update exercise name and description
        const title = this.demoContainer.querySelector('.exercise-name');
        const description = this.demoContainer.querySelector('.exercise-description');
        
        if (title) title.textContent = exercise.name;
        if (description) description.textContent = exercise.description;
        
        // Reset animation and steps
        this.currentStep = 0;
        this._updateSteps();
        
        // Reset animation if exists
        if (this.animation) {
            this.animation.restart();
            this.animation.pause();
        }
        
        // Update visualization (could be replaced with actual exercise animation)
        this.visualization.style.background = exercise.visualizationColor || '#39FF7A';
    }

    // Public method to play animation
    play() {
        if (this.animation) {
            this.animation.play();
            this.playPauseButton.querySelector('.pause-icon').classList.remove('hidden');
            this.playPauseButton.querySelector('.play-icon').classList.add('hidden');
        }
    }

    // Public method to pause animation
    pause() {
        if (this.animation) {
            this.animation.pause();
            this.playPauseButton.querySelector('.play-icon').classList.remove('hidden');
            this.playPauseButton.querySelector('.pause-icon').classList.add('hidden');
        }
    }

    // Public method to destroy component
    destroy() {
        if (this.animation) {
            this.animation.kill();
            this.animation = null;
        }
        
        // Remove event listeners and clean up
        this.prevButton = null;
        this.nextButton = null;
        this.playPauseButton = null;
        
        // Remove DOM elements
        if (this.demoContainer && this.demoContainer.parentNode) {
            this.demoContainer.parentNode.removeChild(this.demoContainer);
        }
        this.demoContainer = null;
    }
}