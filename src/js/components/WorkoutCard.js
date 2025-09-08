// WorkoutCard.js
import { ExerciseDemo } from './ExerciseDemo.js';
// Add import for ProgressTracker
import { ProgressTracker } from './ProgressTracker.js';

export class WorkoutCard {
    constructor(workoutData) {
        this.workoutData = workoutData;
        this.element = this._createCard();
    }

    _createCard() {
        const card = document.createElement('div');
        card.className = 'workout-card relative bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105';
        
        card.innerHTML = `
            <div class="card-front">
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">${this.workoutData.name}</h3>
                    <div class="flex justify-between text-sm text-gray-400 mb-4">
                        <span>${this.workoutData.type}</span>
                        <span>${this.workoutData.duration} minutes</span>
                    </div>
                    <p class="text-gray-300 mb-4">${this.workoutData.description}</p>
                    <div class="flex justify-between items-center">
                        <div class="flex space-x-1">
                            ${this.workoutData.difficulty === 'beginner' ? `
                                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                <div class="w-3 h-3 rounded-full bg-gray-600"></div>
                                <div class="w-3 h-3 rounded-full bg-gray-600"></div>
                            ` : this.workoutData.difficulty === 'intermediate' ? `
                                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                <div class="w-3 h-3 rounded-full bg-gray-600"></div>
                            ` : `
                                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                            `}
                        </div>
                        <button class="flip-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-back absolute inset-0 bg-gray-700 p-6 transform rotate-y-180 hidden">
                <h3 class="text-xl font-bold mb-4">Exercise Details</h3>
                <ul class="space-y-2">
                    ${this.workoutData.exercises.map(exercise => `
                        <li class="flex items-center">
                            <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            ${exercise.name} (${exercise.sets} sets of ${exercise.reps})
                        </li>
                    `).join('')}
                </ul>
                <button class="mt-4 back-button bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors">
                    Back
                </button>
            </div>
        `;

        // Add flip animation logic
        const flipButton = card.querySelector('.flip-button');
        const cardBack = card.querySelector('.card-back');
        const backButton = card.querySelector('.back-button');
        
        // Create exercise demo container
        const exerciseDemoContainer = document.createElement('div');
        exerciseDemoContainer.className = 'exercise-demo-container mt-4';
        cardBack.appendChild(exerciseDemoContainer);
        
        // Create progress tracker container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-tracker-container mt-6';
        cardBack.appendChild(progressContainer);
        
        // Initialize progress tracker
        this.progressTracker = new ProgressTracker(progressContainer, {
            type: 'circular',
            size: 'medium',
            showLabel: true,
            animate: true
        });
        
        // Create achievement container
        const achievementContainer = document.createElement('div');
        achievementContainer.className = 'achievement-container absolute top-4 left-4';
        card.appendChild(achievementContainer);
        this.achievementContainer = achievementContainer;
        
        // Initialize achievement shown flag
        this.achievementShown = false;
        
        // Initialize exercise demo component
        let exerciseDemo = null;
        
        flipButton.addEventListener('click', () => {
            cardBack.classList.remove('hidden');
            cardBack.style.transform = 'rotateY(180deg)';
            card.querySelector('.card-front').style.transform = 'rotateY(180deg)';
            
            // Initialize exercise demo if not already initialized
            if (!exerciseDemo && animationController.isReady()) {
                exerciseDemo = new ExerciseDemo(exerciseDemoContainer, {
                    enableAnimations: true,
                    autoPlay: true,
                    loop: true
                });
                
                // Update exercise demo with first exercise
                if (exerciseDemo && this.workoutData.exercises && this.workoutData.exercises.length > 0) {
                    exerciseDemo.updateExercise(this.workoutData.exercises[0]);
                    
                    // Update progress tracker based on exercise difficulty
                    let progress = 0;
                    
                    switch (this.workoutData.exercises[0].difficulty) {
                        case 'beginner':
                            progress = 0.3;
                            break;
                        case 'intermediate':
                            progress = 0.6;
                            break;
                        case 'advanced':
                            progress = 0.9;
                            break;
                    }
                    
                    // Animate progress tracker
                    if (this.progressTracker) {
                        this.progressTracker.animateProgressTo(progress, 1.5, 'power2.out');
                    }
                    
                    // Check if workout is completed and show achievement
                    if (progress >= 0.9 && !this.achievementShown) {
                        this._showCompletionAchievement();
                    }
                }
            }
        });

        backButton.addEventListener('click', () => {
            card.querySelector('.card-front').style.transform = 'rotateY(0deg)';
            setTimeout(() => {
                cardBack.classList.add('hidden');
                cardBack.style.transform = 'rotateY(0deg)';
                
                // Destroy exercise demo to free resources
                if (exerciseDemo) {
                    exerciseDemo.destroy();
                    exerciseDemo = null;
                }
                
                // Destroy achievement to free resources if needed
                if (this.achievement) {
                    this.achievement.destroy();
                    this.achievement = null;
                }
            }, 300);
        });

        return card;
    }

    getElement() {
        return this.element;
    }
    
    // Method to update progress with animation
    addProgress(value) {
        const newProgress = Math.min(1, this.progress + value);
        this.update(newProgress, this.options.animate);
        
        // Check if workout is completed and show achievement
        if (newProgress >= 0.9 && !this.achievementShown) {
            this._showCompletionAchievement();
        }
    }
    
    // Private method to show completion achievement
    _showCompletionAchievement() {
        // Create and show achievement
        this.achievement = new Achievement(this.achievementContainer, {
            type: 'achievement',
            enableAnimations: true,
            autoDismiss: true,
            dismissDelay: 6000
        });
        
        // Set achievement data
        this.achievement.unlock({
            name: this.workoutData.name,
            progress: 1
        });
        
        // Show notification
        if (animationController.isReady()) {
            animationController.showNotification(`Completed ${this.workoutData.name} workout!`, 5000);
        }
        
        this.achievementShown = true;
    }
}