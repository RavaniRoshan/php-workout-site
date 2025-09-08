// FormWizard - Multi-step form controller with GSAP animations
import animationController from './AnimationController.js';
import { createButton, createInput, createCard } from '../utils/component-helpers.js';

export class FormWizard {
  constructor(container, options = {}) {
    this.container = container;
    this.currentStep = 1;
    this.totalSteps = 5;
    this.formData = {};
    this.validationErrors = {};
    this.isAnimating = false;
    
    // Configuration
    this.options = {
      enableAnimations: true,
      persistData: true,
      validateOnChange: true,
      showProgress: true,
      ...options
    };
    
    // Animation timelines
    this.progressTimeline = null;
    this.stepTransitionTimeline = null;
    
    // DOM elements
    this.elements = {
      wizard: null,
      progressBar: null,
      progressSteps: null,
      stepContainer: null,
      navigationButtons: null,
      currentStepElement: null
    };
    
    // Step definitions
    this.steps = [
      {
        id: 'personal-info',
        title: 'Personal Information',
        subtitle: 'Tell us about yourself',
        icon: '👤',
        fields: ['name', 'age', 'gender'],
        validation: this.validatePersonalInfo.bind(this)
      },
      {
        id: 'fitness-goals',
        title: 'Fitness Goals',
        subtitle: 'What do you want to achieve?',
        icon: '🎯',
        fields: ['primary_goal', 'secondary_goals', 'target_areas'],
        validation: this.validateFitnessGoals.bind(this)
      },
      {
        id: 'experience-level',
        title: 'Experience Level',
        subtitle: 'How experienced are you?',
        icon: '📊',
        fields: ['fitness_level', 'years_active', 'previous_injuries'],
        validation: this.validateExperienceLevel.bind(this)
      },
      {
        id: 'equipment-selection',
        title: 'Available Equipment',
        subtitle: 'What equipment do you have access to?',
        icon: '🏋️',
        fields: ['equipment', 'location', 'preferred_equipment'],
        validation: this.validateEquipmentSelection.bind(this)
      },
      {
        id: 'preferences',
        title: 'Workout Preferences',
        subtitle: 'Customize your workout experience',
        icon: '⚙️',
        fields: ['workout_duration', 'days_per_week', 'time_of_day', 'intensity'],
        validation: this.validatePreferences.bind(this)
      }
    ];
    
    this.init();
  }
  
  async init() {
    try {
      // Load saved data if persistence is enabled
      if (this.options.persistData) {
        this.loadSavedData();
      }
      
      // Create wizard structure
      this.createWizardStructure();
      
      // Initialize progress bar
      if (this.options.showProgress) {
        this.initializeProgressBar();
      }
      
      // Render first step
      await this.renderStep(1);
      
      // Initialize event listeners
      this.initializeEventListeners();
      
      // Initialize animations
      if (this.options.enableAnimations && animationController.isReady()) {
        this.initializeAnimations();
      }
      
      console.log('FormWizard initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize FormWizard:', error);
      this.handleInitializationError(error);
    }
  }
  
  createWizardStructure() {
    this.elements.wizard = document.createElement('div');
    this.elements.wizard.className = 'form-wizard glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-lg bg-background-card/80';
    this.elements.wizard.setAttribute('role', 'form');
    this.elements.wizard.setAttribute('aria-label', 'Multi-step workout form');
    
    // Progress bar container
    if (this.options.showProgress) {
      const progressContainer = document.createElement('div');
      progressContainer.className = 'progress-container mb-8';
      progressContainer.innerHTML = this.createProgressBarHTML();
      this.elements.wizard.appendChild(progressContainer);
    }
    
    // Step container
    this.elements.stepContainer = document.createElement('div');
    this.elements.stepContainer.className = 'step-container relative min-h-[400px]';
    this.elements.wizard.appendChild(this.elements.stepContainer);
    
    // Navigation buttons
    const navigationContainer = document.createElement('div');
    navigationContainer.className = 'navigation-container flex justify-between items-center mt-8 pt-6 border-t border-white/10';
    navigationContainer.innerHTML = this.createNavigationHTML();
    this.elements.wizard.appendChild(navigationContainer);
    
    // Replace existing form with wizard
    const existingForm = this.container.querySelector('.workout-form');
    if (existingForm) {
      existingForm.replaceWith(this.elements.wizard);
    } else {
      this.container.appendChild(this.elements.wizard);
    }
    
    // Cache navigation elements
    this.elements.navigationButtons = {
      prev: this.elements.wizard.querySelector('.btn-prev'),
      next: this.elements.wizard.querySelector('.btn-next'),
      submit: this.elements.wizard.querySelector('.btn-submit')
    };
  }
  
  createProgressBarHTML() {
    return `
      <div class="progress-bar-wrapper">
        <div class="progress-bar-track bg-background-main/30 h-2 rounded-full relative overflow-hidden">
          <div class="progress-bar-fill bg-gradient-to-r from-primary-blue to-primary-green h-full rounded-full transition-all duration-500 ease-out" 
               style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
        </div>
        <div class="progress-steps flex justify-between mt-4">
          ${this.steps.map((step, index) => `
            <div class="progress-step flex flex-col items-center ${index + 1 <= this.currentStep ? 'active' : ''}" 
                 data-step="${index + 1}">
              <div class="step-indicator w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300
                          ${index + 1 < this.currentStep ? 'bg-primary-green border-primary-green text-background-main' : 
                            index + 1 === this.currentStep ? 'bg-primary-blue border-primary-blue text-background-main' : 
                            'border-white/30 text-text-muted'}">
                ${index + 1 < this.currentStep ? '✓' : step.icon}
              </div>
              <span class="step-label text-xs mt-2 text-center max-w-[80px] ${index + 1 <= this.currentStep ? 'text-text-primary' : 'text-text-muted'}">
                ${step.title}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  createNavigationHTML() {
    return `
      <button type="button" class="btn-prev btn-secondary px-6 py-3 rounded-xl font-medium transition-all duration-300 opacity-50 cursor-not-allowed" 
              disabled aria-label="Previous step">
        ← Previous
      </button>
      <div class="step-info text-center">
        <span class="step-counter text-text-muted text-sm">Step ${this.currentStep} of ${this.totalSteps}</span>
      </div>
      <button type="button" class="btn-next btn-primary px-6 py-3 rounded-xl font-medium transition-all duration-300" 
              aria-label="Next step">
        Next →
      </button>
      <button type="submit" class="btn-submit btn-primary px-8 py-3 rounded-xl font-bold transition-all duration-300 hidden" 
              aria-label="Submit form">
        🚀 Generate My Workout!
      </button>
    `;
  }
  
  initializeProgressBar() {
    this.elements.progressBar = this.elements.wizard.querySelector('.progress-bar-fill');
    this.elements.progressSteps = this.elements.wizard.querySelectorAll('.progress-step');
    
    // Create GSAP timeline for progress animations
    if (animationController.isReady()) {
      // Note: Timeline creation will be handled by individual animations
      this.progressTimeline = null;
    }
  }
  
  async renderStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) {
      throw new Error(`Invalid step number: ${stepNumber}`);
    }
    
    const step = this.steps[stepNumber - 1];
    const stepElement = document.createElement('div');
    stepElement.className = 'form-step opacity-0';
    stepElement.setAttribute('data-step', stepNumber);
    stepElement.setAttribute('role', 'group');
    stepElement.setAttribute('aria-labelledby', `step-${stepNumber}-title`);
    
    // Create step content based on step type
    let stepContent = '';
    switch (step.id) {
      case 'personal-info':
        stepContent = await this.createPersonalInfoStep();
        break;
      case 'fitness-goals':
        stepContent = await this.createFitnessGoalsStep();
        break;
      case 'experience-level':
        stepContent = await this.createExperienceLevelStep();
        break;
      case 'equipment-selection':
        stepContent = await this.createEquipmentSelectionStep();
        break;
      case 'preferences':
        stepContent = await this.createPreferencesStep();
        break;
      default:
        throw new Error(`Unknown step: ${step.id}`);
    }
    
    stepElement.innerHTML = `
      <div class="step-header text-center mb-8">
        <div class="step-icon text-6xl mb-4">${step.icon}</div>
        <h3 id="step-${stepNumber}-title" class="text-3xl font-bold text-text-primary mb-2">${step.title}</h3>
        <p class="text-lg text-text-secondary">${step.subtitle}</p>
      </div>
      <div class="step-content">
        ${stepContent}
      </div>
    `;
    
    // Replace current step
    this.elements.stepContainer.innerHTML = '';
    this.elements.stepContainer.appendChild(stepElement);
    this.elements.currentStepElement = stepElement;
    
    // Initialize step-specific functionality
    this.initializeStepFunctionality(stepNumber);
    
    // Animate step entrance
    if (this.options.enableAnimations && animationController.isReady()) {
      await this.animateStepEntrance(stepElement);
    } else {
      stepElement.style.opacity = '1';
    }
  }
  
  async createPersonalInfoStep() {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="form-group">
          <label for="wizard-name" class="block text-text-primary font-medium mb-3 text-lg">
            Your Name <span class="text-red-400" aria-label="required">*</span>
          </label>
          <div class="input-container relative">
            <input type="text" id="wizard-name" name="name" 
                   placeholder="Enter your full name" 
                   value="${this.formData.name || ''}"
                   required 
                   autocomplete="name"
                   class="input-field w-full px-4 py-4 bg-background-main/50 border border-white/20 rounded-xl text-text-primary placeholder-text-muted focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300 text-lg"
                   aria-describedby="name-error name-help">
            <div class="input-icon absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted opacity-0 transition-opacity duration-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
          <div id="name-help" class="text-text-muted text-sm mt-1">This helps us personalize your workout plan</div>
          <div id="name-error" class="error-message text-red-400 text-sm mt-2 hidden" role="alert" aria-live="polite"></div>
        </div>
        
        <div class="form-group">
          <label for="wizard-age" class="block text-text-primary font-medium mb-3 text-lg">
            Age <span class="text-red-400" aria-label="required">*</span>
          </label>
          <div class="input-container relative">
            <input type="number" id="wizard-age" name="age" 
                   placeholder="Your age" 
                   min="13" max="100" step="1"
                   value="${this.formData.age || ''}"
                   required 
                   autocomplete="age"
                   class="input-field w-full px-4 py-4 bg-background-main/50 border border-white/20 rounded-xl text-text-primary placeholder-text-muted focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300 text-lg"
                   aria-describedby="age-error age-help">
            <div class="input-icon absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted opacity-0 transition-opacity duration-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          <div id="age-help" class="text-text-muted text-sm mt-1">Age helps determine appropriate exercise intensity</div>
          <div id="age-error" class="error-message text-red-400 text-sm mt-2 hidden" role="alert" aria-live="polite"></div>
        </div>
        
        <div class="form-group md:col-span-2">
          <fieldset class="gender-fieldset">
            <legend class="block text-text-primary font-medium mb-4 text-lg">
              Gender <span class="text-red-400" aria-label="required">*</span>
            </legend>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${['male', 'female', 'other'].map(gender => `
                <div class="gender-option">
                  <input type="radio" id="gender-${gender}" name="gender" value="${gender}" 
                         ${this.formData.gender === gender ? 'checked' : ''}
                         class="sr-only peer" required
                         aria-describedby="gender-help">
                  <label for="gender-${gender}" 
                         class="gender-label flex items-center justify-center p-6 bg-background-main/30 border border-white/20 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary-blue/50 hover:scale-105 hover:shadow-lg hover:shadow-primary-blue/10 peer-checked:border-primary-blue peer-checked:bg-primary-blue/10 peer-checked:shadow-lg peer-checked:shadow-primary-blue/25 peer-focus:ring-2 peer-focus:ring-primary-blue/50 group">
                    <div class="text-center">
                      <div class="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
                        ${gender === 'male' ? '👨' : gender === 'female' ? '👩' : '🧑'}
                      </div>
                      <span class="text-text-primary font-medium capitalize text-lg">${gender}</span>
                    </div>
                  </label>
                </div>
              `).join('')}
            </div>
          </fieldset>
          <div id="gender-help" class="text-text-muted text-sm mt-2">This helps customize exercise recommendations</div>
          <div id="gender-error" class="error-message text-red-400 text-sm mt-2 hidden" role="alert" aria-live="polite"></div>
        </div>
        
        <div class="form-progress md:col-span-2 mt-6">
          <div class="progress-indicator bg-background-main/30 rounded-xl p-4 border border-white/10">
            <div class="flex items-center justify-between mb-2">
              <span class="text-text-primary font-medium">Step Progress</span>
              <span class="text-primary-blue font-bold" id="step-progress-text">0%</span>
            </div>
            <div class="progress-bar bg-background-main/50 h-2 rounded-full overflow-hidden">
              <div class="progress-fill bg-gradient-to-r from-primary-blue to-primary-green h-full rounded-full transition-all duration-500 ease-out" 
                   style="width: 0%" id="step-progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  async createFitnessGoalsStep() {
    const goals = [
      { id: 'muscle_gain', label: 'Muscle Gain', icon: '💪', description: 'Build lean muscle mass' },
      { id: 'weight_loss', label: 'Weight Loss', icon: '🔥', description: 'Burn fat and lose weight' },
      { id: 'general_fitness', label: 'General Fitness', icon: '🏃', description: 'Improve overall health' },
      { id: 'strength', label: 'Strength', icon: '⚡', description: 'Increase power and strength' },
      { id: 'endurance', label: 'Endurance', icon: '🚴', description: 'Build cardiovascular fitness' },
      { id: 'flexibility', label: 'Flexibility', icon: '🧘', description: 'Improve mobility and flexibility' }
    ];
    
    return `
      <div class="space-y-6">
        <div class="form-group">
          <label class="block text-text-primary font-medium mb-4 text-lg">
            Primary Goal <span class="text-red-400">*</span>
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${goals.slice(0, 3).map(goal => `
              <div class="goal-card">
                <input type="radio" id="primary-${goal.id}" name="primary_goal" value="${goal.id}" 
                       ${this.formData.primary_goal === goal.id ? 'checked' : ''}
                       class="sr-only peer" required>
                <label for="primary-${goal.id}" 
                       class="goal-option flex flex-col items-center p-6 bg-background-main/30 border border-white/20 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary-blue/50 hover:scale-105 peer-checked:border-primary-blue peer-checked:bg-primary-blue/10 peer-checked:shadow-lg peer-checked:shadow-primary-blue/25">
                  <span class="text-4xl mb-3">${goal.icon}</span>
                  <span class="text-text-primary font-bold text-lg mb-2">${goal.label}</span>
                  <span class="text-text-muted text-sm text-center">${goal.description}</span>
                </label>
              </div>
            `).join('')}
          </div>
          <div id="primary-goal-error" class="error-message text-red-400 text-sm mt-2 hidden" role="alert"></div>
        </div>
        
        <div class="form-group">
          <label class="block text-text-primary font-medium mb-4 text-lg">
            Secondary Goals (Optional)
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${goals.slice(3).map(goal => `
              <div class="goal-card">
                <input type="checkbox" id="secondary-${goal.id}" name="secondary_goals[]" value="${goal.id}" 
                       ${(this.formData.secondary_goals || []).includes(goal.id) ? 'checked' : ''}
                       class="sr-only peer">
                <label for="secondary-${goal.id}" 
                       class="goal-option flex flex-col items-center p-6 bg-background-main/30 border border-white/20 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary-green/50 hover:scale-105 peer-checked:border-primary-green peer-checked:bg-primary-green/10 peer-checked:shadow-lg peer-checked:shadow-primary-green/25">
                  <span class="text-4xl mb-3">${goal.icon}</span>
                  <span class="text-text-primary font-bold text-lg mb-2">${goal.label}</span>
                  <span class="text-text-muted text-sm text-center">${goal.description}</span>
                </label>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  async createExperienceLevelStep() {
    const levels = [
      { 
        id: 'beginner', 
        label: 'Beginner', 
        icon: '🌱', 
        description: 'New to fitness or returning after a long break',
        details: '0-6 months of experience'
      },
      { 
        id: 'intermediate', 
        label: 'Intermediate', 
        icon: '🏃', 
        description: 'Regular exercise routine with some experience',
        details: '6 months - 2 years of experience'
      },
      { 
        id: 'advanced', 
        label: 'Advanced', 
        icon: '🏆', 
        description: 'Experienced with consistent training',
        details: '2+ years of experience'
      }
    ];
    
    return `
      <div class="space-y-8">
        <div class="form-group">
          <label class="block text-text-primary font-medium mb-4 text-lg">
            Current Fitness Level <span class="text-red-400">*</span>
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${levels.map(level => `
              <div class="level-card">
                <input type="radio" id="level-${level.id}" name="fitness_level" value="${level.id}" 
                       ${this.formData.fitness_level === level.id ? 'checked' : ''}
                       class="sr-only peer" required>
                <label for="level-${level.id}" 
                       class="level-option flex flex-col items-center p-6 bg-background-main/30 border border-white/20 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary-blue/50 hover:scale-105 peer-checked:border-primary-blue peer-checked:bg-primary-blue/10 peer-checked:shadow-lg peer-checked:shadow-primary-blue/25">
                  <span class="text-5xl mb-4">${level.icon}</span>
                  <span class="text-text-primary font-bold text-xl mb-2">${level.label}</span>
                  <span class="text-text-secondary text-sm text-center mb-2">${level.description}</span>
                  <span class="text-text-muted text-xs text-center">${level.details}</span>
                </label>
              </div>
            `).join('')}
          </div>
          <div id="fitness-level-error" class="error-message text-red-400 text-sm mt-2 hidden" role="alert"></div>
        </div>
        
        <div class="form-group">
          <label for="years-active" class="block text-text-primary font-medium mb-3 text-lg">
            Years Active in Fitness
          </label>
          <input type="number" id="years-active" name="years_active" 
                 placeholder="e.g., 2" 
                 min="0" max="50" step="0.5"
                 value="${this.formData.years_active || ''}"
                 class="input-field w-full px-4 py-3 bg-background-main/50 border border-white/20 rounded-xl text-text-primary placeholder-text-muted focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300">
        </div>
      </div>
    `;
  }
  
  async createEquipmentSelectionStep() {
    const equipment = [
      { id: 'bodyweight', label: 'Bodyweight', icon: '💪', category: 'basic' },
      { id: 'dumbbells', label: 'Dumbbells', icon: '🏋️', category: 'weights' },
      { id: 'barbell', label: 'Barbell', icon: '🏋️‍♂️', category: 'weights' },
      { id: 'kettlebells', label: 'Kettlebells', icon: '⚖️', category: 'weights' },
      { id: 'resistance_bands', label: 'Resistance Bands', icon: '🎯', category: 'accessories' },
      { id: 'pull_up_bar', label: 'Pull-up Bar', icon: '🔗', category: 'accessories' },
      { id: 'cable_machine', label: 'Cable Machine', icon: '🏗️', category: 'machines' },
      { id: 'cardio_equipment', label: 'Cardio Equipment', icon: '🚴', category: 'cardio' }
    ];
    
    return `
      <div class="space-y-6">
        <div class="form-group">
          <label class="block text-text-primary font-medium mb-4 text-lg">
            Available Equipment <span class="text-red-400">*</span>
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            ${equipment.map(item => `
              <div class="equipment-card">
                <input type="checkbox" id="equipment-${item.id}" name="equipment[]" value="${item.id}" 
                       ${(this.formData.equipment || []).includes(item.id) ? 'checked' : ''}
                       ${item.id === 'bodyweight' ? 'checked' : ''}
                       class="sr-only peer">
                <label for="equipment-${item.id}" 
                       class="equipment-option flex flex-col items-center p-4 bg-background-main/30 border border-white/20 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary-green/50 hover:scale-105 peer-checked:border-primary-green peer-checked:bg-primary-green/10 peer-checked:shadow-lg peer-checked:shadow-primary-green/25">
                  <span class="text-3xl mb-2">${item.icon}</span>
                  <span class="text-text-primary font-medium text-sm text-center">${item.label}</span>
                </label>
              </div>
            `).join('')}
          </div>
          <div id="equipment-error" class="error-message text-red-400 text-sm mt-2 hidden" role="alert"></div>
        </div>
        
        <div class="form-group">
          <label for="workout-location" class="block text-text-primary font-medium mb-3 text-lg">
            Primary Workout Location
          </label>
          <select id="workout-location" name="location" 
                  class="input-field w-full px-4 py-3 bg-background-main/50 border border-white/20 rounded-xl text-text-primary focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300">
            <option value="home" ${this.formData.location === 'home' ? 'selected' : ''}>Home</option>
            <option value="gym" ${this.formData.location === 'gym' ? 'selected' : ''}>Gym</option>
            <option value="outdoor" ${this.formData.location === 'outdoor' ? 'selected' : ''}>Outdoor</option>
            <option value="mixed" ${this.formData.location === 'mixed' ? 'selected' : ''}>Mixed</option>
          </select>
        </div>
      </div>
    `;
  }
  
  async createPreferencesStep() {
    return `
      <div class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label for="workout-duration" class="block text-text-primary font-medium mb-3 text-lg">
              Preferred Workout Duration
            </label>
            <select id="workout-duration" name="workout_duration" 
                    class="input-field w-full px-4 py-3 bg-background-main/50 border border-white/20 rounded-xl text-text-primary focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300">
              <option value="30" ${this.formData.workout_duration === '30' ? 'selected' : ''}>30 minutes</option>
              <option value="45" ${this.formData.workout_duration === '45' ? 'selected' : ''}>45 minutes</option>
              <option value="60" ${this.formData.workout_duration === '60' ? 'selected' : ''}>60 minutes</option>
              <option value="90" ${this.formData.workout_duration === '90' ? 'selected' : ''}>90 minutes</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="days-per-week" class="block text-text-primary font-medium mb-3 text-lg">
              Days Per Week
            </label>
            <select id="days-per-week" name="days_per_week" 
                    class="input-field w-full px-4 py-3 bg-background-main/50 border border-white/20 rounded-xl text-text-primary focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300">
              <option value="2" ${this.formData.days_per_week === '2' ? 'selected' : ''}>2 Days</option>
              <option value="3" ${this.formData.days_per_week === '3' ? 'selected' : ''}>3 Days</option>
              <option value="4" ${this.formData.days_per_week === '4' ? 'selected' : ''}>4 Days</option>
              <option value="5" ${this.formData.days_per_week === '5' ? 'selected' : ''}>5 Days</option>
              <option value="6" ${this.formData.days_per_week === '6' ? 'selected' : ''}>6 Days</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="time-of-day" class="block text-text-primary font-medium mb-3 text-lg">
            Preferred Time of Day
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${['morning', 'afternoon', 'evening'].map(time => `
              <div class="time-option">
                <input type="radio" id="time-${time}" name="time_of_day" value="${time}" 
                       ${this.formData.time_of_day === time ? 'checked' : ''}
                       class="sr-only peer">
                <label for="time-${time}" 
                       class="flex items-center justify-center p-4 bg-background-main/30 border border-white/20 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary-orange/50 peer-checked:border-primary-orange peer-checked:bg-primary-orange/10 peer-checked:shadow-lg peer-checked:shadow-primary-orange/25">
                  <span class="text-text-primary font-medium capitalize">${time}</span>
                </label>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="form-group">
          <label for="intensity-slider" class="block text-text-primary font-medium mb-3 text-lg">
            Workout Intensity: <span id="intensity-value" class="text-primary-blue font-bold">${this.formData.intensity || 5}</span>/10
          </label>
          <div class="intensity-slider-container">
            <input type="range" id="intensity-slider" name="intensity" 
                   min="1" max="10" step="1" 
                   value="${this.formData.intensity || 5}"
                   class="w-full h-2 bg-background-main/50 rounded-lg appearance-none cursor-pointer slider">
            <div class="flex justify-between text-text-muted text-sm mt-2">
              <span>Light</span>
              <span>Moderate</span>
              <span>Intense</span>
            </div>
          </div>
        </div>
        
        <div class="form-summary bg-background-main/30 rounded-xl p-6 border border-white/10">
          <h4 class="text-text-primary font-bold text-lg mb-4">Summary</h4>
          <div id="form-summary-content" class="space-y-2 text-text-secondary">
            <!-- Summary will be populated dynamically -->
          </div>
        </div>
      </div>
    `;
  }  
initializeStepFunctionality(stepNumber) {
    const step = this.steps[stepNumber - 1];
    
    // Initialize step-specific functionality
    switch (step.id) {
      case 'personal-info':
        this.initPersonalInfoStep();
        break;
      case 'fitness-goals':
        this.initFitnessGoalsStep();
        break;
      case 'experience-level':
        this.initExperienceLevelStep();
        break;
      case 'equipment-selection':
        this.initEquipmentSelectionStep();
        break;
      case 'preferences':
        this.initPreferencesStep();
        break;
    }
    
    // Initialize common functionality for all steps
    this.initCommonStepFunctionality();
  }
  
  initPersonalInfoStep() {
    // Initialize animated input components
    this.initAnimatedInputs();
    
    // Add real-time validation for name field
    const nameInput = this.elements.currentStepElement.querySelector('#wizard-name');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        this.validateField('name', e.target.value);
        this.saveFieldData('name', e.target.value);
        this.updateProgressIndicator();
      });
      
      nameInput.addEventListener('focus', (e) => {
        this.animateInputFocus(e.target);
      });
      
      nameInput.addEventListener('blur', (e) => {
        this.animateInputBlur(e.target);
      });
    }
    
    // Add validation for age field
    const ageInput = this.elements.currentStepElement.querySelector('#wizard-age');
    if (ageInput) {
      ageInput.addEventListener('input', (e) => {
        this.validateField('age', e.target.value);
        this.saveFieldData('age', e.target.value);
        this.updateProgressIndicator();
      });
      
      ageInput.addEventListener('focus', (e) => {
        this.animateInputFocus(e.target);
      });
      
      ageInput.addEventListener('blur', (e) => {
        this.animateInputBlur(e.target);
      });
    }
    
    // Add validation for gender selection
    const genderInputs = this.elements.currentStepElement.querySelectorAll('input[name="gender"]');
    genderInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.validateField('gender', e.target.value);
        this.saveFieldData('gender', e.target.value);
        this.animateGenderSelection(e.target);
        this.updateProgressIndicator();
      });
    });
    
    // Initialize keyboard navigation
    this.initKeyboardNavigation();
  }
  
  initAnimatedInputs() {
    const inputs = this.elements.currentStepElement.querySelectorAll('.input-field');
    inputs.forEach(input => {
      // Create floating label effect
      this.createFloatingLabel(input);
      
      // Add focus ring animation
      this.addFocusRingAnimation(input);
      
      // Add scaling animation on focus
      input.addEventListener('focus', () => {
        if (this.options.enableAnimations && animationController.isReady()) {
          animationController.createAnimation(input, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
      
      input.addEventListener('blur', () => {
        if (this.options.enableAnimations && animationController.isReady()) {
          animationController.createAnimation(input, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    });
  }
  
  createFloatingLabel(input) {
    const label = input.closest('.form-group').querySelector('label');
    if (!label) return;
    
    const labelText = label.textContent.replace(' *', '');
    const isRequired = label.textContent.includes('*');
    
    // Create floating label element
    const floatingLabel = document.createElement('div');
    floatingLabel.className = 'floating-label absolute left-4 top-3 text-text-muted transition-all duration-300 pointer-events-none';
    floatingLabel.textContent = labelText;
    
    // Position relative to input
    const inputWrapper = input.parentElement;
    inputWrapper.style.position = 'relative';
    inputWrapper.appendChild(floatingLabel);
    
    // Handle floating behavior
    const updateFloatingLabel = () => {
      const hasValue = input.value.length > 0;
      const isFocused = document.activeElement === input;
      
      if (hasValue || isFocused) {
        floatingLabel.style.transform = 'translateY(-24px) scale(0.85)';
        floatingLabel.style.color = isFocused ? '#00D4FF' : '#A0AEC0';
      } else {
        floatingLabel.style.transform = 'translateY(0) scale(1)';
        floatingLabel.style.color = '#A0AEC0';
      }
    };
    
    input.addEventListener('focus', updateFloatingLabel);
    input.addEventListener('blur', updateFloatingLabel);
    input.addEventListener('input', updateFloatingLabel);
    
    // Initial state
    updateFloatingLabel();
  }
  
  addFocusRingAnimation(input) {
    // Create animated focus ring
    const focusRing = document.createElement('div');
    focusRing.className = 'focus-ring absolute inset-0 rounded-xl border-2 border-primary-blue opacity-0 transition-all duration-300 pointer-events-none';
    
    const inputWrapper = input.parentElement;
    inputWrapper.appendChild(focusRing);
    
    input.addEventListener('focus', () => {
      if (this.options.enableAnimations && animationController.isReady()) {
        animationController.createAnimation(focusRing, {
          opacity: 0.6,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
    
    input.addEventListener('blur', () => {
      if (this.options.enableAnimations && animationController.isReady()) {
        animationController.createAnimation(focusRing, {
          opacity: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  }
  
  animateInputFocus(input) {
    if (!this.options.enableAnimations || !animationController.isReady()) return;
    
    const inputWrapper = input.parentElement;
    if (!inputWrapper) return; // Guard against missing parent element
    
    // Create glow effect
    const glowEffect = document.createElement('div');
    glowEffect.className = 'input-glow absolute inset-0 rounded-xl bg-primary-blue/20 blur-sm opacity-0 pointer-events-none';
    
    inputWrapper.appendChild(glowEffect);
    
    // Animate glow in
    animationController.createAnimation(glowEffect, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    });
    
    // Store reference for cleanup
    input._glowEffect = glowEffect;
  }
  
  animateInputBlur(input) {
    if (!this.options.enableAnimations || !animationController.isReady()) return;
    
    if (input._glowEffect) {
      // Animate glow out
      animationController.createAnimation(input._glowEffect, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          if (input._glowEffect && input._glowEffect.parentElement) {
            input._glowEffect.remove();
          }
          delete input._glowEffect;
        }
      });
    }
  }
  
  animateGenderSelection(selectedInput) {
    if (!this.options.enableAnimations || !animationController.isReady()) return;
    
    const label = selectedInput.nextElementSibling;
    if (!label) return;
    
    // Animate selection with elastic bounce
    animationController.createAnimation(label, {
      scale: 1.05,
      duration: 0.3,
      ease: "elastic.out(1, 0.3)",
      yoyo: true,
      repeat: 1
    });
    
    // Add particle effect
    this.createSelectionParticles(label);
  }
  
  createSelectionParticles(element) {
    if (!this.options.enableAnimations || !animationController.isReady()) return;
    
    const rect = element.getBoundingClientRect();
    const particles = [];
    
    // Create 6 particles
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'selection-particle absolute w-2 h-2 bg-primary-blue rounded-full pointer-events-none';
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      particle.style.zIndex = '1000';
      
      document.body.appendChild(particle);
      particles.push(particle);
      
      // Animate particle
      const angle = (i / 6) * Math.PI * 2;
      const distance = 30 + Math.random() * 20;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      animationController.createAnimation(particle, {
        x: x,
        y: y,
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          particle.remove();
        }
      });
    }
  }
  
  initKeyboardNavigation() {
    const focusableElements = this.elements.currentStepElement.querySelectorAll(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element, index) => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && element.type !== 'textarea') {
          e.preventDefault();
          
          // Move to next focusable element or submit
          const nextIndex = index + 1;
          if (nextIndex < focusableElements.length) {
            focusableElements[nextIndex].focus();
          } else {
            // Try to go to next step
            this.nextStep();
          }
        }
      });
    });
  }
  
  updateProgressIndicator() {
    if (!this.options.showProgress) return;
    
    const currentStep = this.steps[this.currentStep - 1];
    const completedFields = currentStep.fields.filter(field => {
      const value = this.formData[field];
      return value && value.toString().trim().length > 0;
    });
    
    const progress = completedFields.length / currentStep.fields.length;
    const progressElement = this.elements.wizard.querySelector('.progress-bar-fill');
    
    if (progressElement && this.options.enableAnimations && animationController.isReady()) {
      // Animate progress with elastic easing
      animationController.createAnimation(progressElement, {
        width: `${((this.currentStep - 1 + progress) / this.totalSteps) * 100}%`,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    }
  }
  
  initFitnessGoalsStep() {
    // Primary goal selection
    const primaryGoalInputs = this.elements.currentStepElement.querySelectorAll('input[name="primary_goal"]');
    primaryGoalInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.validateField('primary_goal', e.target.value);
        this.saveFieldData('primary_goal', e.target.value);
        this.animateGoalSelection(e.target.parentElement);
      });
    });
    
    // Secondary goals selection
    const secondaryGoalInputs = this.elements.currentStepElement.querySelectorAll('input[name="secondary_goals[]"]');
    secondaryGoalInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const selectedGoals = Array.from(secondaryGoalInputs)
          .filter(input => input.checked)
          .map(input => input.value);
        this.saveFieldData('secondary_goals', selectedGoals);
        this.animateGoalSelection(e.target.parentElement);
      });
    });
  }
  
  initExperienceLevelStep() {
    // Fitness level selection
    const levelInputs = this.elements.currentStepElement.querySelectorAll('input[name="fitness_level"]');
    levelInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.validateField('fitness_level', e.target.value);
        this.saveFieldData('fitness_level', e.target.value);
        this.animateLevelSelection(e.target.parentElement);
      });
    });
    
    // Years active input
    const yearsInput = this.elements.currentStepElement.querySelector('#years-active');
    if (yearsInput) {
      yearsInput.addEventListener('input', (e) => {
        this.saveFieldData('years_active', e.target.value);
      });
    }
  }
  
  initEquipmentSelectionStep() {
    // Equipment selection
    const equipmentInputs = this.elements.currentStepElement.querySelectorAll('input[name="equipment[]"]');
    equipmentInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const selectedEquipment = Array.from(equipmentInputs)
          .filter(input => input.checked)
          .map(input => input.value);
        this.validateField('equipment', selectedEquipment);
        this.saveFieldData('equipment', selectedEquipment);
        this.animateEquipmentSelection(e.target.parentElement);
      });
    });
    
    // Location selection
    const locationSelect = this.elements.currentStepElement.querySelector('#workout-location');
    if (locationSelect) {
      locationSelect.addEventListener('change', (e) => {
        this.saveFieldData('location', e.target.value);
      });
    }
  }
  
  initPreferencesStep() {
    // Duration and days selection
    const durationSelect = this.elements.currentStepElement.querySelector('#workout-duration');
    const daysSelect = this.elements.currentStepElement.querySelector('#days-per-week');
    
    if (durationSelect) {
      durationSelect.addEventListener('change', (e) => {
        this.saveFieldData('workout_duration', e.target.value);
        this.updateFormSummary();
      });
    }
    
    if (daysSelect) {
      daysSelect.addEventListener('change', (e) => {
        this.saveFieldData('days_per_week', e.target.value);
        this.updateFormSummary();
      });
    }
    
    // Time of day selection
    const timeInputs = this.elements.currentStepElement.querySelectorAll('input[name="time_of_day"]');
    timeInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.saveFieldData('time_of_day', e.target.value);
        this.animateTimeSelection(e.target.parentElement);
        this.updateFormSummary();
      });
    });
    
    // Intensity slider
    const intensitySlider = this.elements.currentStepElement.querySelector('#intensity-slider');
    const intensityValue = this.elements.currentStepElement.querySelector('#intensity-value');
    
    if (intensitySlider && intensityValue) {
      intensitySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        intensityValue.textContent = value;
        this.saveFieldData('intensity', value);
        this.animateIntensityChange(intensitySlider, value);
        this.updateFormSummary();
      });
    }
    
    // Initialize summary
    this.updateFormSummary();
  }
  
  initCommonStepFunctionality() {
    // Add focus effects to all input fields
    const inputs = this.elements.currentStepElement.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', (e) => {
        e.target.parentElement.classList.remove('focused');
      });
    });
    
    // Add hover effects to interactive elements
    const interactiveElements = this.elements.currentStepElement.querySelectorAll('.goal-option, .level-option, .equipment-option, .time-option');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        if (this.options.enableAnimations && animationController.isReady()) {
          this.animateHoverEffect(e.target, true);
        }
      });
      
      element.addEventListener('mouseleave', (e) => {
        if (this.options.enableAnimations && animationController.isReady()) {
          this.animateHoverEffect(e.target, false);
        }
      });
    });
  }
  
  initializeEventListeners() {
    // Navigation button listeners
    if (this.elements.navigationButtons.prev) {
      this.elements.navigationButtons.prev.addEventListener('click', () => {
        this.previousStep();
      });
    }
    
    if (this.elements.navigationButtons.next) {
      this.elements.navigationButtons.next.addEventListener('click', () => {
        this.nextStep();
      });
    }
    
    if (this.elements.navigationButtons.submit) {
      this.elements.navigationButtons.submit.addEventListener('click', () => {
        this.submitForm();
      });
    }
    
    // Keyboard navigation
    this.elements.wizard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (this.currentStep < this.totalSteps) {
          this.nextStep();
        } else {
          this.submitForm();
        }
      }
    });
    
    // Progress step click navigation
    if (this.elements.progressSteps) {
      this.elements.progressSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
          const targetStep = index + 1;
          if (targetStep <= this.currentStep) {
            this.goToStep(targetStep);
          }
        });
      });
    }
  }
  
  initializeAnimations() {
    // Initialize entrance animations for wizard
    if (animationController.isReady()) {
      animationController.createAnimation(this.elements.wizard, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }
  
  async nextStep() {
    if (this.isAnimating) return;
    
    // Validate current step
    const isValid = await this.validateCurrentStep();
    if (!isValid) {
      this.showValidationErrors();
      return;
    }
    
    // Check if we're at the last step
    if (this.currentStep >= this.totalSteps) {
      this.submitForm();
      return;
    }
    
    // Proceed to next step
    await this.goToStep(this.currentStep + 1);
  }
  
  async previousStep() {
    if (this.isAnimating || this.currentStep <= 1) return;
    
    await this.goToStep(this.currentStep - 1);
  }
  
  async goToStep(stepNumber) {
    if (this.isAnimating || stepNumber === this.currentStep) return;
    
    this.isAnimating = true;
    
    try {
      const direction = stepNumber > this.currentStep ? 'forward' : 'backward';
      
      // Update current step
      const previousStep = this.currentStep;
      this.currentStep = stepNumber;
      
      // Animate step transition
      if (this.options.enableAnimations && animationController.isReady()) {
        await this.animateStepTransition(direction);
      }
      
      // Render new step
      await this.renderStep(stepNumber);
      
      // Update progress bar
      this.updateProgressBar();
      
      // Update navigation buttons
      this.updateNavigationButtons();
      
      // Save progress
      if (this.options.persistData) {
        this.saveProgress();
      }
      
      // Announce step change for screen readers
      this.announceStepChange(stepNumber);
      
    } catch (error) {
      console.error('Error transitioning to step:', error);
      this.currentStep = previousStep; // Revert on error
    } finally {
      this.isAnimating = false;
    }
  }
  
  async validateCurrentStep() {
    const step = this.steps[this.currentStep - 1];
    const isValid = await step.validation();
    
    return isValid;
  }
  
  async validatePersonalInfo() {
    let isValid = true;
    
    // Validate name
    const nameValid = this.validateField('name', this.formData.name);
    if (!nameValid) isValid = false;
    
    // Validate age
    const ageValid = this.validateField('age', this.formData.age);
    if (!ageValid) isValid = false;
    
    // Validate gender
    const genderValid = this.validateField('gender', this.formData.gender);
    if (!genderValid) isValid = false;
    
    return isValid;
  }
  
  async validateFitnessGoals() {
    let isValid = true;
    
    // Validate primary goal
    const primaryGoalValid = this.validateField('primary_goal', this.formData.primary_goal);
    if (!primaryGoalValid) isValid = false;
    
    return isValid;
  }
  
  async validateExperienceLevel() {
    let isValid = true;
    
    // Validate fitness level
    const levelValid = this.validateField('fitness_level', this.formData.fitness_level);
    if (!levelValid) isValid = false;
    
    return isValid;
  }
  
  async validateEquipmentSelection() {
    let isValid = true;
    
    // Validate equipment selection (at least one item)
    const equipmentValid = this.validateField('equipment', this.formData.equipment);
    if (!equipmentValid) isValid = false;
    
    return isValid;
  }
  
  async validatePreferences() {
    // All preferences are optional or have defaults
    return true;
  }
  
  validateField(fieldName, value) {
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
      case 'name':
        if (!value || value.trim().length < 2) {
          isValid = false;
          errorMessage = 'Please enter a valid name (at least 2 characters)';
        }
        break;
        
      case 'age':
        const age = parseInt(value);
        if (!age || age < 13 || age > 100) {
          isValid = false;
          errorMessage = 'Please enter a valid age between 13 and 100';
        }
        break;
        
      case 'gender':
        if (!value) {
          isValid = false;
          errorMessage = 'Please select your gender';
        }
        break;
        
      case 'primary_goal':
        if (!value) {
          isValid = false;
          errorMessage = 'Please select your primary fitness goal';
        }
        break;
        
      case 'fitness_level':
        if (!value) {
          isValid = false;
          errorMessage = 'Please select your current fitness level';
        }
        break;
        
      case 'equipment':
        if (!value || !Array.isArray(value) || value.length === 0) {
          isValid = false;
          errorMessage = 'Please select at least one piece of equipment';
        }
        break;
    }
    
    // Update validation state
    if (isValid) {
      delete this.validationErrors[fieldName];
      this.hideFieldError(fieldName);
    } else {
      this.validationErrors[fieldName] = errorMessage;
      this.showFieldError(fieldName, errorMessage);
    }
    
    return isValid;
  }
  
  showFieldError(fieldName, message) {
    const errorElement = this.elements.currentStepElement.querySelector(`#${fieldName.replace('_', '-')}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
      errorElement.setAttribute('role', 'alert');
      errorElement.setAttribute('aria-live', 'polite');
      
      // Find associated input for styling
      const inputElement = this.elements.currentStepElement.querySelector(`[name="${fieldName}"], #wizard-${fieldName.replace('_', '-')}`);
      if (inputElement) {
        inputElement.setAttribute('aria-invalid', 'true');
        inputElement.setAttribute('aria-describedby', errorElement.id);
        
        // Add error styling
        inputElement.classList.add('border-red-500/50', 'focus:border-red-500', 'focus:ring-red-500/20');
        inputElement.classList.remove('border-white/20', 'focus:border-primary-blue', 'focus:ring-primary-blue/20');
      }
      
      // Animate error appearance with shake effect
      if (this.options.enableAnimations && animationController.isReady()) {
        // Set initial state
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(-10px)';
        
        // Animate in
        animationController.createAnimation(errorElement, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
        
        // Shake input if it exists
        if (inputElement) {
          animationController.createAnimation(inputElement, {
            x: -5,
            duration: 0.1,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 3
          });
        }
      }
    }
  }
  
  hideFieldError(fieldName) {
    const errorElement = this.elements.currentStepElement.querySelector(`#${fieldName.replace('_', '-')}-error`);
    if (errorElement) {
      // Find associated input for styling cleanup
      const inputElement = this.elements.currentStepElement.querySelector(`[name="${fieldName}"], #wizard-${fieldName.replace('_', '-')}`);
      if (inputElement) {
        inputElement.setAttribute('aria-invalid', 'false');
        inputElement.removeAttribute('aria-describedby');
        
        // Remove error styling
        inputElement.classList.remove('border-red-500/50', 'focus:border-red-500', 'focus:ring-red-500/20');
        inputElement.classList.add('border-white/20', 'focus:border-primary-blue', 'focus:ring-primary-blue/20');
      }
      
      // Animate error disappearance
      if (this.options.enableAnimations && animationController.isReady()) {
        animationController.createAnimation(errorElement, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            errorElement.classList.add('hidden');
            errorElement.removeAttribute('role');
            errorElement.removeAttribute('aria-live');
          }
        });
      } else {
        errorElement.classList.add('hidden');
        errorElement.removeAttribute('role');
        errorElement.removeAttribute('aria-live');
      }
    }
  }
  
  showValidationErrors() {
    // Animate validation error feedback
    if (this.options.enableAnimations && animationController.isReady()) {
      const errorElements = this.elements.currentStepElement.querySelectorAll('.error-message:not(.hidden)');
      if (errorElements.length > 0) {
        animationController.createStaggerAnimation(errorElements, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1
        });
      }
    }
  }
  
  updateProgressBar() {
    const progressPercentage = (this.currentStep / this.totalSteps) * 100;
    
    // Update progress bar fill
    if (this.elements.progressBar) {
      if (this.options.enableAnimations && animationController.isReady()) {
        animationController.createAnimation(this.elements.progressBar, {
          width: `${progressPercentage}%`,
          duration: 0.5,
          ease: "power2.out"
        });
      } else {
        this.elements.progressBar.style.width = `${progressPercentage}%`;
      }
    }
    
    // Update progress steps
    if (this.elements.progressSteps) {
      this.elements.progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        const stepIndicator = step.querySelector('.step-indicator');
        const stepLabel = step.querySelector('.step-label');
        
        if (stepNumber < this.currentStep) {
          // Completed step
          step.classList.add('completed');
          step.classList.remove('active');
          stepIndicator.innerHTML = '✓';
          stepIndicator.className = stepIndicator.className.replace(/bg-\w+-\w+|border-\w+-\w+|text-\w+-\w+/g, '') + ' bg-primary-green border-primary-green text-background-main';
          stepLabel.className = stepLabel.className.replace(/text-\w+-\w+/g, '') + ' text-text-primary';
        } else if (stepNumber === this.currentStep) {
          // Current step
          step.classList.add('active');
          step.classList.remove('completed');
          stepIndicator.innerHTML = this.steps[index].icon;
          stepIndicator.className = stepIndicator.className.replace(/bg-\w+-\w+|border-\w+-\w+|text-\w+-\w+/g, '') + ' bg-primary-blue border-primary-blue text-background-main';
          stepLabel.className = stepLabel.className.replace(/text-\w+-\w+/g, '') + ' text-text-primary';
        } else {
          // Future step
          step.classList.remove('active', 'completed');
          stepIndicator.innerHTML = this.steps[index].icon;
          stepIndicator.className = stepIndicator.className.replace(/bg-\w+-\w+|border-\w+-\w+|text-\w+-\w+/g, '') + ' border-white/30 text-text-muted';
          stepLabel.className = stepLabel.className.replace(/text-\w+-\w+/g, '') + ' text-text-muted';
        }
      });
    }
    
    // Update step counter
    const stepCounter = this.elements.wizard.querySelector('.step-counter');
    if (stepCounter) {
      stepCounter.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }
  }
  
  updateNavigationButtons() {
    const { prev, next, submit } = this.elements.navigationButtons;
    
    // Previous button
    if (prev) {
      if (this.currentStep <= 1) {
        prev.disabled = true;
        prev.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        prev.disabled = false;
        prev.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
    
    // Next/Submit button
    if (this.currentStep >= this.totalSteps) {
      // Show submit button, hide next button
      if (next) next.classList.add('hidden');
      if (submit) submit.classList.remove('hidden');
    } else {
      // Show next button, hide submit button
      if (next) next.classList.remove('hidden');
      if (submit) submit.classList.add('hidden');
    }
  }
  
  saveFieldData(fieldName, value) {
    this.formData[fieldName] = value;
    
    if (this.options.persistData) {
      this.saveToStorage();
    }
  }
  
  saveToStorage() {
    try {
      const dataToSave = {
        formData: this.formData,
        currentStep: this.currentStep,
        timestamp: Date.now()
      };
      localStorage.setItem('workoutWizardData', JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('Failed to save form data to localStorage:', error);
    }
  }
  
  loadSavedData() {
    try {
      const savedData = localStorage.getItem('workoutWizardData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Check if data is not too old (24 hours)
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        if (Date.now() - parsed.timestamp < maxAge) {
          this.formData = parsed.formData || {};
          // Don't restore step position on init, let user start from beginning
        }
      }
    } catch (error) {
      console.warn('Failed to load saved form data:', error);
    }
  }
  
  saveProgress() {
    this.saveToStorage();
  }
  
  clearSavedData() {
    try {
      localStorage.removeItem('workoutWizardData');
    } catch (error) {
      console.warn('Failed to clear saved form data:', error);
    }
  } 
 // Animation Methods
  async animateStepEntrance(stepElement) {
    if (!animationController.isReady()) {
      stepElement.style.opacity = '1';
      return;
    }
    
    // Animate step entrance
    await animationController.createAnimation(stepElement, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    });
    
    // Animate step content with stagger
    const animatableElements = stepElement.querySelectorAll('.form-group, .goal-card, .level-card, .equipment-card');
    if (animatableElements.length > 0) {
      animationController.createStaggerAnimation(animatableElements, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      }, { amount: 0.1 });
    }
  }
  
  async animateStepTransition(direction) {
    if (!animationController.isReady()) return;
    
    const currentElement = this.elements.currentStepElement;
    if (!currentElement) return;
    
    const xOffset = direction === 'forward' ? -50 : 50;
    
    // Animate current step out
    await animationController.createAnimation(currentElement, {
      opacity: 0,
      x: xOffset,
      duration: 0.3,
      ease: "power2.in"
    });
  }
  

  
  animateSelectionFeedback(element) {
    if (!this.options.enableAnimations || !animationController.isReady()) return;
    
    animationController.createAnimation(element, {
      scale: 1.05,
      duration: 0.3,
      ease: "back.out(1.7)",
      yoyo: true,
      repeat: 1
    });
  }
  
  animateGoalSelection(element) {
    if (!this.options.enableAnimations || !animationController.isReady()) return;
    
    // First animation
    animationController.createAnimation(element, {
      scale: 1.1,
      rotation: 2,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        // Second animation
        animationController.createAnimation(element, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "elastic.out(1, 0.3)"
        });
      }
    });
  }
  
  animateLevelSelection(element) {
    if (!this.options.enableAnimations || !animationController.isReady()) return;
    
    animationController.createAnimation(element, {
      y: -10,
      duration: 0.4,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });
  }
  
  animateEquipmentSelection(element) {
    if (!this.options.enableAnimations || !animationController.isReady()) return;
    
    animationController.createAnimation(element, {
      rotationY: 360,
      duration: 0.6,
      ease: "power2.out"
    });
  }
  
  animateTimeSelection(element) {
    if (!this.options.enableAnimations || !animationController.isReady()) return;
    
    animationController.createAnimation(element, {
      scale: 1.08,
      duration: 0.3,
      ease: "back.out(1.7)",
      yoyo: true,
      repeat: 1
    });
  }
  
  animateIntensityChange(slider, value) {
    if (!this.options.enableAnimations || !animationController.isReady()) return;
    
    // Create a pulse effect based on intensity value
    const intensity = parseInt(value) / 10;
    const scale = 1 + (intensity * 0.1);
    
    animationController.createAnimation(slider, {
      scale: scale,
      duration: 0.2,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });
  }
  
  animateHoverEffect(element, isEntering) {
    if (!this.options.enableAnimations || !animationController.isReady()) return;
    
    if (isEntering) {
      animationController.createAnimation(element, {
        scale: 1.05,
        y: -5,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      animationController.createAnimation(element, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }
  
  // Form Summary and Submission
  updateFormSummary() {
    const summaryContent = this.elements.currentStepElement?.querySelector('#form-summary-content');
    if (!summaryContent) return;
    
    const summaryItems = [];
    
    if (this.formData.name) {
      summaryItems.push(`<div><strong>Name:</strong> ${this.formData.name}</div>`);
    }
    
    if (this.formData.primary_goal) {
      const goalLabel = this.formData.primary_goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      summaryItems.push(`<div><strong>Goal:</strong> ${goalLabel}</div>`);
    }
    
    if (this.formData.fitness_level) {
      const levelLabel = this.formData.fitness_level.charAt(0).toUpperCase() + this.formData.fitness_level.slice(1);
      summaryItems.push(`<div><strong>Level:</strong> ${levelLabel}</div>`);
    }
    
    if (this.formData.equipment && this.formData.equipment.length > 0) {
      const equipmentList = this.formData.equipment.map(eq => eq.replace('_', ' ')).join(', ');
      summaryItems.push(`<div><strong>Equipment:</strong> ${equipmentList}</div>`);
    }
    
    if (this.formData.workout_duration) {
      summaryItems.push(`<div><strong>Duration:</strong> ${this.formData.workout_duration} minutes</div>`);
    }
    
    if (this.formData.days_per_week) {
      summaryItems.push(`<div><strong>Frequency:</strong> ${this.formData.days_per_week} days/week</div>`);
    }
    
    if (this.formData.intensity) {
      summaryItems.push(`<div><strong>Intensity:</strong> ${this.formData.intensity}/10</div>`);
    }
    
    summaryContent.innerHTML = summaryItems.join('');
    
    // Animate summary update
    if (this.options.enableAnimations && animationController.isReady()) {
      animationController.createAnimation(summaryContent, {
        opacity: 0.7,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  }
  
  async submitForm() {
    if (this.isAnimating) return;
    
    // Final validation
    const isValid = await this.validateCurrentStep();
    if (!isValid) {
      this.showValidationErrors();
      return;
    }
    
    this.isAnimating = true;
    
    try {
      // Show loading state
      this.showSubmissionLoading();
      
      // Prepare form data for submission
      const submissionData = this.prepareSubmissionData();
      
      // Submit to backend
      const response = await this.submitToBackend(submissionData);
      
      if (response.success) {
        // Clear saved data
        this.clearSavedData();
        
        // Redirect to results
        window.location.href = response.redirectUrl || 'workout.php';
      } else {
        throw new Error(response.message || 'Submission failed');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showSubmissionError(error.message);
    } finally {
      this.isAnimating = false;
      this.hideSubmissionLoading();
    }
  }
  
  prepareSubmissionData() {
    // Convert wizard data to format expected by generator.php
    return {
      name: this.formData.name || '',
      goal: this.formData.primary_goal || 'general_fitness',
      fitness_level: this.formData.fitness_level || 'beginner',
      days_per_week: this.formData.days_per_week || '3',
      equipment: this.formData.equipment || ['bodyweight'],
      // Additional wizard-specific data
      age: this.formData.age,
      gender: this.formData.gender,
      secondary_goals: this.formData.secondary_goals || [],
      years_active: this.formData.years_active,
      location: this.formData.location || 'home',
      workout_duration: this.formData.workout_duration || '45',
      time_of_day: this.formData.time_of_day || 'morning',
      intensity: this.formData.intensity || '5'
    };
  }
  
  async submitToBackend(data) {
    const formData = new FormData();
    
    // Add all form fields
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        data[key].forEach(value => {
          formData.append(`${key}[]`, value);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    
    const response = await fetch('generator.php', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response is JSON (API response) or HTML (redirect)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Assume successful redirect to workout page
      return { success: true, redirectUrl: 'workout.php' };
    }
  }
  
  showSubmissionLoading() {
    const submitBtn = this.elements.navigationButtons.submit;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
          Generating Your Workout...
        </div>
      `;
    }
  }
  
  hideSubmissionLoading() {
    const submitBtn = this.elements.navigationButtons.submit;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '🚀 Generate My Workout!';
    }
  }
  
  showSubmissionError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'submission-error bg-red-500/20 border border-red-500/50 rounded-xl p-4 mt-4 text-red-200';
    errorDiv.innerHTML = `
      <div class="flex items-center">
        <span class="text-2xl mr-3">⚠️</span>
        <div>
          <strong>Submission Error</strong>
          <p class="text-sm mt-1">${message}</p>
        </div>
      </div>
    `;
    
    // Insert error message
    const navigationContainer = this.elements.wizard.querySelector('.navigation-container');
    if (navigationContainer) {
      navigationContainer.insertBefore(errorDiv, navigationContainer.firstChild);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.remove();
        }
      }, 5000);
    }
  }
  
  // Accessibility Methods
  announceStepChange(stepNumber) {
    const step = this.steps[stepNumber - 1];
    const announcement = `Step ${stepNumber} of ${this.totalSteps}: ${step.title}. ${step.subtitle}`;
    
    // Create or update live region for screen readers
    let liveRegion = document.getElementById('wizard-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'wizard-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = announcement;
  }
  
  // Error Handling
  handleInitializationError(error) {
    console.error('FormWizard initialization failed:', error);
    
    // Check if container exists before trying to use it
    if (!this.container) {
      console.error('FormWizard container is null or undefined');
      return;
    }
    
    // Fallback to basic form functionality
    const existingForm = this.container.querySelector('.workout-form');
    if (existingForm) {
      existingForm.style.display = 'block';
    }
    
    // Show error message to user
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-notification bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 text-red-200';
    errorMessage.innerHTML = `
      <div class="flex items-center">
        <span class="text-2xl mr-3">⚠️</span>
        <div>
          <strong>Form Enhancement Unavailable</strong>
          <p class="text-sm mt-1">The enhanced form wizard couldn't load. Please use the basic form below.</p>
        </div>
      </div>
    `;
    
    if (this.container.firstChild) {
      this.container.insertBefore(errorMessage, this.container.firstChild);
    } else {
      this.container.appendChild(errorMessage);
    }
  }
  
  // Cleanup Methods
  destroy() {
    // Remove event listeners
    if (this.elements.wizard) {
      this.elements.wizard.removeEventListener('keydown', this.handleKeydown);
    }
    
    // Clear timelines
    if (this.progressTimeline) {
      this.progressTimeline.kill();
    }
    
    if (this.stepTransitionTimeline) {
      this.stepTransitionTimeline.kill();
    }
    
    // Remove live region
    const liveRegion = document.getElementById('wizard-live-region');
    if (liveRegion) {
      liveRegion.remove();
    }
    
    // Clear saved data if requested
    if (this.options.clearOnDestroy) {
      this.clearSavedData();
    }
  }
  
  // Public API Methods
  getCurrentStep() {
    return this.currentStep;
  }
  
  getFormData() {
    return { ...this.formData };
  }
  
  setFormData(data) {
    this.formData = { ...this.formData, ...data };
    if (this.options.persistData) {
      this.saveToStorage();
    }
  }
  
  reset() {
    this.formData = {};
    this.validationErrors = {};
    this.currentStep = 1;
    this.clearSavedData();
    this.goToStep(1);
  }
}

// Export the FormWizard class
export default FormWizard;