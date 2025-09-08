import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animationConfig } from '../utils/gsap-config.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * WorkoutDisplay Component
 * Handles animated workout card reveals, exercise counters, and collapsible sections
 */
export class WorkoutDisplay {
    constructor() {
        this.workoutCards = [];
        this.exerciseCounters = [];
        this.collapsibleSections = [];
        this.revealTimeline = gsap.timeline();
        this.init();
    }

    init() {
        this.setupWorkoutCards();
        this.setupExerciseCounters();
        this.setupCollapsibleSections();
        this.initRevealAnimations();
        this.setupResponsiveLayout();
    }

    setupWorkoutCards() {
        const cards = document.querySelectorAll('.workout-card');
        
        cards.forEach((card, index) => {
            // Set initial state for animation
            gsap.set(card, {
                opacity: 0,
                y: 50,
                rotationX: -15,
                transformPerspective: 1000
            });

            this.workoutCards.push({
                element: card,
                index: index,
                isRevealed: false,
                flipTimeline: gsap.timeline({ paused: true })
            });

            // Setup flip animation for exercise details
            this.setupCardFlipAnimation(card, index);
        });
    }

    setupCardFlipAnimation(card, index) {
        const front = card.querySelector('.card-front') || card;
        const back = card.querySelector('.card-back');
        
        if (!back) {
            // Create back side for exercise details if it doesn't exist
            this.createCardBackSide(card);
        }

        const flipTimeline = gsap.timeline({ paused: true });
        
        flipTimeline
            .to(front, {
                duration: 0.3,
                rotationY: -90,
                ease: "power2.inOut"
            })
            .set(front, { display: 'none' })
            .set(card.querySelector('.card-back'), { display: 'block' })
            .fromTo(card.querySelector('.card-back'), 
                { rotationY: 90 },
                {
                    duration: 0.3,
                    rotationY: 0,
                    ease: "power2.inOut"
                }
            );

        this.workoutCards[index].flipTimeline = flipTimeline;

        // Add click handler for flip animation
        card.addEventListener('click', () => this.toggleCardFlip(index));
    }

    createCardBackSide(card) {
        const exercises = card.querySelectorAll('li');
        const backSide = document.createElement('div');
        backSide.className = 'card-back';
        backSide.style.display = 'none';
        
        let exerciseDetails = '<div class="exercise-details">';
        exerciseDetails += '<h3>Exercise Details</h3>';
        
        exercises.forEach((exercise, idx) => {
            const exerciseName = exercise.querySelector('strong')?.textContent || `Exercise ${idx + 1}`;
            exerciseDetails += `
                <div class="exercise-detail-item">
                    <h4>${exerciseName}</h4>
                    <div class="exercise-stats">
                        <span class="difficulty-indicator">
                            <div class="difficulty-bar" data-difficulty="3"></div>
                        </span>
                        <span class="muscle-groups">Primary: Chest, Secondary: Triceps</span>
                    </div>
                    <p class="exercise-instructions">Focus on controlled movement and proper form.</p>
                </div>
            `;
        });
        
        exerciseDetails += '<button class="flip-back-btn">← Back to Overview</button></div>';
        backSide.innerHTML = exerciseDetails;
        
        card.appendChild(backSide);
        
        // Add flip back functionality
        backSide.querySelector('.flip-back-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleCardFlip(this.workoutCards.findIndex(wc => wc.element === card));
        });
    }

    toggleCardFlip(index) {
        const card = this.workoutCards[index];
        if (card.flipTimeline.progress() === 0) {
            card.flipTimeline.play();
        } else {
            card.flipTimeline.reverse();
        }
    }

    setupExerciseCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach((counter, index) => {
            const targetValue = parseInt(counter.dataset.counter) || parseInt(counter.textContent);
            
            gsap.set(counter, { textContent: 0 });
            
            this.exerciseCounters.push({
                element: counter,
                targetValue: targetValue,
                currentValue: 0,
                isAnimated: false
            });
        });
    }

    animateCounter(index) {
        const counter = this.exerciseCounters[index];
        if (counter.isAnimated) return;
        
        counter.isAnimated = true;
        
        gsap.to(counter, {
            currentValue: counter.targetValue,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
                counter.element.textContent = Math.round(counter.currentValue);
            }
        });
    }

    setupCollapsibleSections() {
        const sections = document.querySelectorAll('.collapsible-section');
        
        sections.forEach((section, index) => {
            const header = section.querySelector('.section-header');
            const content = section.querySelector('.section-content');
            const icon = section.querySelector('.collapse-icon');
            
            if (!header || !content) return;
            
            // Set initial state
            gsap.set(content, { height: 0, overflow: 'hidden' });
            gsap.set(icon, { rotation: 0 });
            
            this.collapsibleSections.push({
                element: section,
                header: header,
                content: content,
                icon: icon,
                isExpanded: false,
                timeline: gsap.timeline({ paused: true })
            });
            
            // Setup collapse animation
            this.setupCollapseAnimation(index);
            
            // Add click handler
            header.addEventListener('click', () => this.toggleSection(index));
        });
    }

    setupCollapseAnimation(index) {
        const section = this.collapsibleSections[index];
        const { content, icon } = section;
        
        section.timeline
            .to(content, {
                height: 'auto',
                duration: 0.5,
                ease: "power2.inOut"
            })
            .to(icon, {
                rotation: 180,
                duration: 0.3,
                ease: "power2.inOut"
            }, 0);
    }

    toggleSection(index) {
        const section = this.collapsibleSections[index];
        
        if (section.isExpanded) {
            section.timeline.reverse();
        } else {
            section.timeline.play();
        }
        
        section.isExpanded = !section.isExpanded;
    }

    initRevealAnimations() {
        // Staggered card reveal animation
        this.revealTimeline
            .to(this.workoutCards.map(card => card.element), {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            })
            .add(() => {
                // Trigger counter animations after cards are revealed
                this.exerciseCounters.forEach((_, index) => {
                    setTimeout(() => this.animateCounter(index), index * 200);
                });
            });

        // Setup scroll trigger for reveal animation
        ScrollTrigger.create({
            trigger: '.workout-grid',
            start: 'top 80%',
            onEnter: () => {
                this.revealTimeline.play();
            }
        });
    }

    setupResponsiveLayout() {
        // Handle responsive layout changes
        const handleResize = () => {
            ScrollTrigger.refresh();
        };
        
        window.addEventListener('resize', handleResize);
        
        // Setup responsive grid behavior
        this.setupResponsiveGrid();
    }

    setupResponsiveGrid() {
        const grid = document.querySelector('.workout-grid');
        if (!grid) return;
        
        // Add responsive classes based on screen size
        const updateGridLayout = () => {
            const width = window.innerWidth;
            
            grid.classList.remove('grid-mobile', 'grid-tablet', 'grid-desktop');
            
            if (width < 768) {
                grid.classList.add('grid-mobile');
            } else if (width < 1024) {
                grid.classList.add('grid-tablet');
            } else {
                grid.classList.add('grid-desktop');
            }
        };
        
        updateGridLayout();
        window.addEventListener('resize', updateGridLayout);
    }

    // Public methods for external control
    revealAllCards() {
        this.revealTimeline.play();
    }

    hideAllCards() {
        this.revealTimeline.reverse();
    }

    expandAllSections() {
        this.collapsibleSections.forEach((_, index) => {
            if (!this.collapsibleSections[index].isExpanded) {
                this.toggleSection(index);
            }
        });
    }

    collapseAllSections() {
        this.collapsibleSections.forEach((_, index) => {
            if (this.collapsibleSections[index].isExpanded) {
                this.toggleSection(index);
            }
        });
    }

    destroy() {
        // Cleanup animations and event listeners
        this.revealTimeline.kill();
        this.workoutCards.forEach(card => card.flipTimeline.kill());
        this.collapsibleSections.forEach(section => section.timeline.kill());
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
}