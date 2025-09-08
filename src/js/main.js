// Main JavaScript entry point for the modernized workout generator
import animationController from './components/AnimationController.js';
import { initializeComponents, getThemeProvider } from './components/ui/index.js';
import { HeroSection } from './components/HeroSection.js';
import { WorkoutPreviewCards } from './components/WorkoutPreviewCards.js';
import { StatsTestimonials } from './components/StatsTestimonials.js';
import { FormWizard } from './components/FormWizard.js';
import { WorkoutDisplay } from './components/WorkoutDisplay.js';
import { WorkoutCardList } from './components/WorkoutCardList.js';
import { ExerciseDemo } from './components/ExerciseDemo.js';
import { Achievement } from './components/Achievement.js';

class WorkoutApp {
  constructor() {
    this.isInitialized = false;
    this.currentPage = this.detectCurrentPage();
    
    this.init();
  }
  
  detectCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.php';
    
    if (filename.includes('workout.php')) return 'workout';
    if (filename.includes('index.php') || filename === '') return 'landing';
    return 'unknown';
  }
  
  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
      } else {
        this.onDOMReady();
      }
      
      // Wait for animation controller to be ready
      document.addEventListener('animationControllerReady', () => {
        this.onAnimationControllerReady();
      });
      
    } catch (error) {
      console.error('Failed to initialize WorkoutApp:', error);
      this.fallbackInit();
    }
  }
  
  onDOMReady() {
    console.log('DOM ready, current page:', this.currentPage);
    
    // Initialize UI components
    const componentResult = initializeComponents();
    console.log('UI components initialized:', componentResult.componentsCount);
    
    // Initialize theme provider
    const themeProvider = getThemeProvider();
    console.log('Theme initialized:', themeProvider.getTheme());
    
    // Initialize page-specific functionality
    this.initPageSpecific();
    
    // Initialize common functionality
    this.initCommonFeatures();
    
    // Add loading states
    this.showLoadingStates();
  }
  
  onAnimationControllerReady() {
    console.log('Animation controller ready');
    
    // Remove loading states
    this.hideLoadingStates();
    
    // Initialize animations based on current page
    this.initPageAnimations();
    
    this.isInitialized = true;
    this.dispatchEvent('workoutAppReady');
  }
  
  initPageSpecific() {
    switch (this.currentPage) {
      case 'landing':
        this.initLandingPage();
        break;
      case 'workout':
        this.initWorkoutPage();
        break;
      default:
        console.warn('Unknown page type:', this.currentPage);
    }
  }
  
  initLandingPage() {
    console.log('Initializing landing page functionality');
    
    // Initialize hero section
    this.initHeroSection();
    
    // Initialize preview cards
    this.initPreviewCards();
    
    // Initialize stats and testimonials
    this.initStatsTestimonials();
    
    // Add GSAP classes to elements for animation
    this.addAnimationClasses();
    
    // Initialize form enhancements (will be expanded in later tasks)
    this.initFormEnhancements();
  }
  
  initHeroSection() {
    const heroContainer = document.getElementById('hero-section');
    if (heroContainer) {
      this.heroSection = new HeroSection(heroContainer);
      console.log('Hero section initialized');
    }
  }
  
  initPreviewCards() {
    const previewContainer = document.getElementById('preview-cards-section');
    if (previewContainer) {
      this.previewCards = new WorkoutPreviewCards(previewContainer);
      console.log('Preview cards initialized');
    }
  }
  
  initStatsTestimonials() {
    const statsContainer = document.getElementById('stats-testimonials-section');
    if (statsContainer) {
      this.statsTestimonials = new StatsTestimonials(statsContainer);
      console.log('Stats and testimonials initialized');
    }
  }
  
  initWorkoutPage() {
    console.log('Initializing workout page functionality');
    
    // Initialize WorkoutDisplay component
    this.initWorkoutDisplay();
    
    // Add animation classes to workout cards
    this.addWorkoutAnimationClasses();
    
    // Enhance existing complete button functionality
    this.enhanceCompleteButtons();
    
    // Initialize WorkoutCardList if container exists
    const workoutGridContainer = document.getElementById('workout-grid-container');
    if (workoutGridContainer) {
      this.initWorkoutCardList(workoutGridContainer);
    }
  }
  
  initWorkoutCardList(container) {
    console.log('Initializing WorkoutCardList');
    
    // Create sample workout data
    const sampleWorkouts = [
      {
        id: 1,
        name: 'Full Body Blast',
        type: 'Strength Training',
        duration: 45,
        description: 'A comprehensive full-body workout to build strength and endurance.',
        difficulty: 'intermediate',
        exercises: [
          { name: 'Barbell Squat', sets: 4, reps: 8 },
          { name: 'Bench Press', sets: 4, reps: 8 },
          { name: 'Deadlift', sets: 3, reps: 6 },
          { name: 'Pull Ups', sets: 3, reps: 10 },
          { name: 'Overhead Press', sets: 3, reps: 8 }
        ]
      },
      {
        id: 2,
        name: 'HIIT Burner',
        type: 'Cardio',
        duration: 30,
        description: 'High-intensity interval training to boost your metabolism.',
        difficulty: 'advanced',
        exercises: [
          { name: 'Sprint Intervals', sets: 10, reps: 30 },
          { name: 'Burpees', sets: 5, reps: 15 },
          { name: 'Jump Squats', sets: 5, reps: 20 },
          { name: 'Mountain Climbers', sets: 5, reps: 45 },
          { name: 'Kettlebell Swings', sets: 5, reps: 20 }
        ]
      },
      {
        id: 3,
        name: 'Core Crusher',
        type: 'Core',
        duration: 20,
        description: 'Intense core workout to strengthen your abdominal muscles.',
        difficulty: 'beginner',
        exercises: [
          { name: 'Plank', sets: 3, reps: 60 },
          { name: 'Russian Twists', sets: 3, reps: 30 },
          { name: 'Leg Raises', sets: 3, reps: 15 },
          { name: 'Bicycle Crunches', sets: 3, reps: 20 }
        ]
      },
      {
        id: 4,
        name: 'Upper Body Push',
        type: 'Strength Training',
        duration: 40,
        description: 'Focuses on upper body pushing movements.',
        difficulty: 'intermediate',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: 4, reps: 8 },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: 10 },
          { name: 'Chest Dips', sets: 3, reps: 12 },
          { name: 'Lateral Raises', sets: 3, reps: 15 }
        ]
      },
      {
        id: 5,
        name: 'Lower Body Burn',
        type: 'Strength Training',
        duration: 45,
        description: 'Targets legs and glutes with compound and isolation movements.',
        difficulty: 'advanced',
        exercises: [
          { name: 'Front Squats', sets: 4, reps: 6 },
          { name: 'Romanian Deadlifts', sets: 3, reps: 8 },
          { name: 'Walking Lunges', sets: 3, reps: 20 },
          { name: 'Glute Ham Raises', sets: 3, reps: 10 }
        ]
      },
      {
        id: 6,
        name: 'Active Recovery',
        type: 'Mobility',
        duration: 30,
        description: 'Gentle movements to aid recovery and improve flexibility.',
        difficulty: 'beginner',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15 },
          { name: 'Child\'s Pose', sets: 2, reps: 60 },
          { name: 'Downward Dog', sets: 2, reps: 30 },
          { name: 'Hip Circles', sets: 2, reps: 20 }
        ]
      },
      {
        id: 7,
        name: 'Back & Biceps',
        type: 'Strength Training',
        duration: 40,
        description: 'Focuses on back and bicep development.',
        difficulty: 'intermediate',
        exercises: [
          { name: 'Pull Ups', sets: 4, reps: 8 },
          { name: 'Barbell Rows', sets: 4, reps: 10 },
          { name: 'Lat Pulldown', sets: 3, reps: 12 },
          { name: 'Barbell Curls', sets: 3, reps: 10 }
        ]
      },
      {
        id: 8,
        name: 'Lower Body Power',
        type: 'Plyometrics',
        duration: 30,
        description: 'Explosive movements to build power and agility.',
        difficulty: 'advanced',
        exercises: [
          { name: 'Box Jumps', sets: 5, reps: 10 },
          { name: 'Lateral Bounds', sets: 4, reps: 12 },
          { name: 'Single Leg Hops', sets: 3, reps: 15 },
          { name: 'Depth Jumps', sets: 4, reps: 8 }
        ]
      }
    ];
    
    // Create and initialize WorkoutCardList
    this.workoutCardList = new WorkoutCardList(container, sampleWorkouts);
    console.log('WorkoutCardList initialized successfully');
  }
  
  initWorkoutDisplay() {
    try {
      this.workoutDisplay = new WorkoutDisplay();
      console.log('WorkoutDisplay initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WorkoutDisplay:', error);
      // Fallback to basic workout page functionality
      this.initBasicWorkoutFeatures();
    }
  }
  
  initBasicWorkoutFeatures() {
    // Basic fallback functionality for workout cards
    const workoutCards = document.querySelectorAll('.workout-card');
    workoutCards.forEach(card => {
      card.classList.add('basic-card');
    });
  }
  
  addAnimationClasses() {
    // Add classes for GSAP animations to existing elements
    const header = document.querySelector('header h1');
    if (header) {
      header.classList.add('gsap-fade-in');
    }
    
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
      group.classList.add('gsap-stagger-item');
      group.style.setProperty('--stagger-index', index);
    });
    
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.classList.add('gsap-scale-in');
    }
  }
  
  addWorkoutAnimationClasses() {
    const workoutCards = document.querySelectorAll('.workout-card');
    workoutCards.forEach((card, index) => {
      card.classList.add('gsap-stagger-item');
      card.style.setProperty('--stagger-index', index);
    });
    
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, index) => {
      card.classList.add('gsap-stagger-item');
      card.style.setProperty('--stagger-index', index + workoutCards.length);
    });
  }
  
  initFormEnhancements() {
    // Initialize FormWizard to replace the basic form
    const formSection = document.querySelector('.form-section');
    if (formSection) {
      try {
        this.formWizard = new FormWizard(formSection, {
          enableAnimations: true,
          persistData: true,
          validateOnChange: true,
          showProgress: true
        });
        console.log('FormWizard initialized successfully');
      } catch (error) {
        console.error('Failed to initialize FormWizard:', error);
        // Fallback to basic form enhancements
        this.initBasicFormEnhancements();
      }
    } else {
      // Fallback for pages without form section
      this.initBasicFormEnhancements();
    }
  }
  
  initBasicFormEnhancements() {
    // Add modern styling classes to form elements
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.classList.add('input-field');
    });
    
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.classList.add('btn-primary');
    }
    
    // Add focus effects
    inputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', (e) => {
        e.target.parentElement.classList.remove('focused');
      });
    });
  }
  
  enhanceCompleteButtons() {
    const completeButtons = document.querySelectorAll('.complete-btn');
    completeButtons.forEach(button => {
      button.classList.add('btn-secondary');
      
      // Add enhanced click animation
      button.addEventListener('click', (e) => {
        if (animationController.isReady()) {
          animationController.celebrateAchievement(e.target);
        }
      });
    });
  }
  
  initCommonFeatures() {
    // Initialize responsive behavior
    this.initResponsiveFeatures();
    
    // Initialize accessibility features
    this.initAccessibilityFeatures();
    
    // Initialize performance monitoring
    this.initPerformanceMonitoring();
  }
  
  initResponsiveFeatures() {
    // Handle viewport changes
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (animationController.isReady()) {
          animationController.refreshScrollTriggers();
        }
        this.handleViewportChange();
      }, 250);
    });
  }
  
  handleViewportChange() {
    // Update performance mode based on viewport
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('mobile-viewport', isMobile);
    
    console.log('Viewport changed, mobile:', isMobile);
  }
  
  initAccessibilityFeatures() {
    // Handle reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.handleReducedMotion(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', (e) => {
      this.handleReducedMotion(e.matches);
    });
    
    // Keyboard navigation enhancements
    this.initKeyboardNavigation();
  }
  
  handleReducedMotion(reducedMotion) {
    document.body.classList.toggle('reduced-motion', reducedMotion);
    console.log('Reduced motion preference:', reducedMotion);
  }
  
  initKeyboardNavigation() {
    // Enhanced keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll('button, input, select, a');
    
    interactiveElements.forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (element.tagName === 'BUTTON') {
            e.preventDefault();
            element.click();
          }
        }
      });
    });
  }
  
  initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Page loaded in ${Math.round(loadTime)}ms`);
      
      // Report slow loading
      if (loadTime > 3000) {
        console.warn('Slow page load detected, consider optimization');
      }
    });
  }
  
  initPageAnimations() {
    if (!animationController.isReady()) return;
    
    switch (this.currentPage) {
      case 'landing':
        this.animateLandingPage();
        break;
      case 'workout':
        this.animateWorkoutPage();
        break;
    }
  }
  
  animateLandingPage() {
    // Animate header
    const header = document.querySelector('header h1');
    if (header) {
      animationController.animateHeroTitle(header);
    }
    
    // Animate form groups with stagger
    const formGroups = document.querySelectorAll('.gsap-stagger-item');
    if (formGroups.length > 0) {
      animationController.animateCardReveal(formGroups);
    }
    
    // Animate submit button
    const submitBtn = document.querySelector('.gsap-scale-in');
    if (submitBtn) {
      animationController.createAnimation(submitBtn, {
        opacity: 1,
        scale: 1,
        delay: 0.8
      });
    }
  }
  
  animateWorkoutPage() {
    // Animate workout cards
    const workoutCards = document.querySelectorAll('.workout-card');
    if (workoutCards.length > 0) {
      animationController.animateCardReveal(workoutCards);
    }
    
    // Animate achievement cards
    const achievementCards = document.querySelectorAll('.achievement-card');
    if (achievementCards.length > 0) {
      setTimeout(() => {
        animationController.animateCardReveal(achievementCards);
      }, 600);
    }
    
    // Animate counters if any exist
    this.animateCounters();
  }
  
  animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(counter => {
      const endValue = parseInt(counter.dataset.counter) || 0;
      animationController.animateCounter(counter, endValue);
    });
  }
  
  showLoadingStates() {
    document.body.classList.add('loading');
    
    // Add shimmer effects to key elements
    const keyElements = document.querySelectorAll('h1, .form-group, .workout-card');
    keyElements.forEach(el => {
      el.classList.add('loading-shimmer');
    });
  }
  
  hideLoadingStates() {
    document.body.classList.remove('loading');
    
    // Remove shimmer effects
    const shimmerElements = document.querySelectorAll('.loading-shimmer');
    shimmerElements.forEach(el => {
      el.classList.remove('loading-shimmer');
    });
  }
  
  fallbackInit() {
    console.warn('Falling back to basic initialization');
    document.body.classList.add('no-animations');
    this.hideLoadingStates();
  }
  
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }
}

// Initialize the app
const workoutApp = new WorkoutApp();

// Export for potential external use
window.WorkoutApp = workoutApp;

// Development helpers
if (process.env.NODE_ENV === 'development') {
  window.animationController = animationController;
  window.workoutApp = workoutApp;
}