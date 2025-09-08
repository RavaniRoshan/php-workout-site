// FormWizard Unit Tests
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock component helpers
vi.mock('../src/js/utils/component-helpers.js', () => ({
  createButton: vi.fn(),
  createInput: vi.fn(),
  createCard: vi.fn()
}));

// Mock AnimationController
vi.mock('../src/js/components/AnimationController.js', () => ({
  default: {
    isReady: () => true,
    createAnimation: vi.fn(() => ({ kill: vi.fn() })),
    createStaggerAnimation: vi.fn(() => ({ kill: vi.fn() })),
    gsap: {
      timeline: vi.fn(() => ({
        kill: vi.fn(),
        to: vi.fn(),
        fromTo: vi.fn()
      }))
    }
  }
}));

// Import after mocking
import { FormWizard } from '../src/js/components/FormWizard.js';

describe('FormWizard', () => {
  let container;
  let formWizard;
  
  beforeEach(() => {
    // Create container element
    container = document.createElement('div');
    container.innerHTML = `
      <form class="workout-form">
        <input name="name" />
        <select name="goal"></select>
      </form>
    `;
    document.body.appendChild(container);
    
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Mock fetch
    global.fetch = vi.fn();
  });
  
  afterEach(() => {
    if (formWizard) {
      formWizard.destroy();
    }
    document.body.removeChild(container);
    vi.clearAllMocks();
  });
  
  describe('Initialization', () => {
    it('should initialize with default options', async () => {
      formWizard = new FormWizard(container);
      
      expect(formWizard.currentStep).toBe(1);
      expect(formWizard.totalSteps).toBe(5);
      expect(formWizard.formData).toEqual({});
      expect(formWizard.options.enableAnimations).toBe(true);
      expect(formWizard.options.persistData).toBe(true);
    });
    
    it('should initialize with custom options', async () => {
      const customOptions = {
        enableAnimations: false,
        persistData: false,
        showProgress: false
      };
      
      formWizard = new FormWizard(container, customOptions);
      
      expect(formWizard.options.enableAnimations).toBe(false);
      expect(formWizard.options.persistData).toBe(false);
      expect(formWizard.options.showProgress).toBe(false);
    });
    
    it('should create wizard structure', async () => {
      formWizard = new FormWizard(container);
      
      // Wait for initialization
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const wizard = container.querySelector('.form-wizard');
      expect(wizard).toBeTruthy();
      
      const progressContainer = wizard.querySelector('.progress-container');
      expect(progressContainer).toBeTruthy();
      
      const stepContainer = wizard.querySelector('.step-container');
      expect(stepContainer).toBeTruthy();
      
      const navigationContainer = wizard.querySelector('.navigation-container');
      expect(navigationContainer).toBeTruthy();
    });
    
    it('should load saved data from localStorage', async () => {
      const savedData = {
        formData: { name: 'John Doe', age: 25 },
        currentStep: 2,
        timestamp: Date.now()
      };
      
      window.localStorage.getItem.mockReturnValue(JSON.stringify(savedData));
      
      formWizard = new FormWizard(container);
      
      expect(formWizard.formData.name).toBe('John Doe');
      expect(formWizard.formData.age).toBe(25);
    });
    
    it('should ignore old saved data', async () => {
      const oldData = {
        formData: { name: 'Old Data' },
        currentStep: 2,
        timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 hours ago
      };
      
      window.localStorage.getItem.mockReturnValue(JSON.stringify(oldData));
      
      formWizard = new FormWizard(container);
      
      expect(formWizard.formData).toEqual({});
    });
  });
  
  describe('Step Navigation', () => {
    beforeEach(async () => {
      formWizard = new FormWizard(container);
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    it('should start at step 1', () => {
      expect(formWizard.getCurrentStep()).toBe(1);
    });
    
    it('should navigate to next step when valid', async () => {
      // Mock validation to return true
      formWizard.validateCurrentStep = vi.fn().mockResolvedValue(true);
      
      await formWizard.nextStep();
      
      expect(formWizard.getCurrentStep()).toBe(2);
    });
    
    it('should not navigate to next step when invalid', async () => {
      // Mock validation to return false
      formWizard.validateCurrentStep = vi.fn().mockResolvedValue(false);
      formWizard.showValidationErrors = vi.fn();
      
      await formWizard.nextStep();
      
      expect(formWizard.getCurrentStep()).toBe(1);
      expect(formWizard.showValidationErrors).toHaveBeenCalled();
    });
    
    it('should navigate to previous step', async () => {
      // Go to step 2 first
      formWizard.currentStep = 2;
      
      await formWizard.previousStep();
      
      expect(formWizard.getCurrentStep()).toBe(1);
    });
    
    it('should not go below step 1', async () => {
      await formWizard.previousStep();
      
      expect(formWizard.getCurrentStep()).toBe(1);
    });
    
    it('should go to specific step', async () => {
      await formWizard.goToStep(3);
      
      expect(formWizard.getCurrentStep()).toBe(3);
    });
    
    it('should not navigate when animating', async () => {
      formWizard.isAnimating = true;
      const originalStep = formWizard.getCurrentStep();
      
      await formWizard.nextStep();
      
      expect(formWizard.getCurrentStep()).toBe(originalStep);
    });
  });
  
  describe('Form Validation', () => {
    beforeEach(async () => {
      formWizard = new FormWizard(container);
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    describe('Personal Info Validation', () => {
      it('should validate name field', () => {
        expect(formWizard.validateField('name', 'John Doe')).toBe(true);
        expect(formWizard.validateField('name', 'J')).toBe(false);
        expect(formWizard.validateField('name', '')).toBe(false);
      });
      
      it('should validate age field', () => {
        expect(formWizard.validateField('age', '25')).toBe(true);
        expect(formWizard.validateField('age', '12')).toBe(false);
        expect(formWizard.validateField('age', '101')).toBe(false);
        expect(formWizard.validateField('age', 'abc')).toBe(false);
      });
      
      it('should validate gender field', () => {
        expect(formWizard.validateField('gender', 'male')).toBe(true);
        expect(formWizard.validateField('gender', 'female')).toBe(true);
        expect(formWizard.validateField('gender', '')).toBe(false);
      });
    });
    
    describe('Fitness Goals Validation', () => {
      it('should validate primary goal', () => {
        expect(formWizard.validateField('primary_goal', 'muscle_gain')).toBe(true);
        expect(formWizard.validateField('primary_goal', '')).toBe(false);
      });
    });
    
    describe('Experience Level Validation', () => {
      it('should validate fitness level', () => {
        expect(formWizard.validateField('fitness_level', 'beginner')).toBe(true);
        expect(formWizard.validateField('fitness_level', '')).toBe(false);
      });
    });
    
    describe('Equipment Validation', () => {
      it('should validate equipment selection', () => {
        expect(formWizard.validateField('equipment', ['bodyweight'])).toBe(true);
        expect(formWizard.validateField('equipment', [])).toBe(false);
        expect(formWizard.validateField('equipment', null)).toBe(false);
      });
    });
    
    it('should store validation errors', () => {
      formWizard.validateField('name', '');
      
      expect(formWizard.validationErrors.name).toBeTruthy();
    });
    
    it('should clear validation errors when field becomes valid', () => {
      formWizard.validateField('name', '');
      expect(formWizard.validationErrors.name).toBeTruthy();
      
      formWizard.validateField('name', 'John Doe');
      expect(formWizard.validationErrors.name).toBeFalsy();
    });
  });
  
  describe('Data Management', () => {
    beforeEach(async () => {
      formWizard = new FormWizard(container);
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    it('should save field data', () => {
      formWizard.saveFieldData('name', 'John Doe');
      
      expect(formWizard.formData.name).toBe('John Doe');
    });
    
    it('should persist data to localStorage when enabled', () => {
      formWizard.options.persistData = true;
      formWizard.saveFieldData('name', 'John Doe');
      
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });
    
    it('should not persist data when disabled', () => {
      formWizard.options.persistData = false;
      formWizard.saveFieldData('name', 'John Doe');
      
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
    });
    
    it('should get form data', () => {
      formWizard.formData = { name: 'John', age: 25 };
      
      const data = formWizard.getFormData();
      
      expect(data).toEqual({ name: 'John', age: 25 });
      expect(data).not.toBe(formWizard.formData); // Should be a copy
    });
    
    it('should set form data', () => {
      formWizard.setFormData({ name: 'Jane', age: 30 });
      
      expect(formWizard.formData.name).toBe('Jane');
      expect(formWizard.formData.age).toBe(30);
    });
    
    it('should clear saved data', () => {
      formWizard.clearSavedData();
      
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('workoutWizardData');
    });
  });
  
  describe('Progress Bar', () => {
    beforeEach(async () => {
      formWizard = new FormWizard(container);
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    it('should update progress bar on step change', async () => {
      // Disable animations to ensure direct style update
      formWizard.options.enableAnimations = false;
      
      // Mock animation controller as not ready
      const animationController = (await import('../src/js/components/AnimationController.js')).default;
      animationController.isReady = vi.fn(() => false);
      
      // Ensure progress bar elements are cached
      formWizard.initializeProgressBar();
      
      // The progress bar is initially set to step 1 (20%)
      const progressBar = container.querySelector('.progress-bar-fill');
      expect(progressBar.style.width).toBe('20%'); // 1/5 * 100%
      
      // Set step to 3 and update progress
      formWizard.currentStep = 3;
      formWizard.updateProgressBar();
      
      // Check if progress bar width is updated (should be 60% for step 3 of 5)
      const expectedWidth = (3 / 5) * 100;
      expect(progressBar.style.width).toBe(`${expectedWidth}%`);
    });
    
    it('should update step indicators', () => {
      formWizard.currentStep = 2;
      formWizard.updateProgressBar();
      
      const steps = container.querySelectorAll('.progress-step');
      expect(steps[0].classList.contains('completed')).toBe(true);
      expect(steps[1].classList.contains('active')).toBe(true);
      expect(steps[2].classList.contains('active')).toBe(false);
    });
  });
  
  describe('Form Submission', () => {
    beforeEach(async () => {
      formWizard = new FormWizard(container);
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    it('should prepare submission data correctly', () => {
      formWizard.formData = {
        name: 'John Doe',
        primary_goal: 'muscle_gain',
        fitness_level: 'intermediate',
        equipment: ['dumbbells', 'barbell']
      };
      
      const submissionData = formWizard.prepareSubmissionData();
      
      expect(submissionData.name).toBe('John Doe');
      expect(submissionData.goal).toBe('muscle_gain');
      expect(submissionData.fitness_level).toBe('intermediate');
      expect(submissionData.equipment).toEqual(['dumbbells', 'barbell']);
    });
    
    it('should use defaults for missing data', () => {
      formWizard.formData = {};
      
      const submissionData = formWizard.prepareSubmissionData();
      
      expect(submissionData.goal).toBe('general_fitness');
      expect(submissionData.fitness_level).toBe('beginner');
      expect(submissionData.days_per_week).toBe('3');
      expect(submissionData.equipment).toEqual(['bodyweight']);
    });
    
    it('should submit form successfully', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({ success: true, redirectUrl: 'workout.php' })
      });
      
      formWizard.validateCurrentStep = vi.fn().mockResolvedValue(true);
      formWizard.clearSavedData = vi.fn();
      
      // Mock window.location.href
      delete window.location;
      window.location = { href: '' };
      
      await formWizard.submitForm();
      
      expect(global.fetch).toHaveBeenCalledWith('generator.php', expect.any(Object));
      expect(formWizard.clearSavedData).toHaveBeenCalled();
      expect(window.location.href).toBe('workout.php');
    });
    
    it('should handle submission errors', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      
      formWizard.validateCurrentStep = vi.fn().mockResolvedValue(true);
      formWizard.showSubmissionError = vi.fn();
      
      await formWizard.submitForm();
      
      expect(formWizard.showSubmissionError).toHaveBeenCalledWith('Network error');
    });
    
    it('should not submit if validation fails', async () => {
      formWizard.validateCurrentStep = vi.fn().mockResolvedValue(false);
      formWizard.showValidationErrors = vi.fn();
      
      await formWizard.submitForm();
      
      expect(global.fetch).not.toHaveBeenCalled();
      expect(formWizard.showValidationErrors).toHaveBeenCalled();
    });
  });
  
  describe('Animation Integration', () => {
    beforeEach(async () => {
      formWizard = new FormWizard(container);
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    it('should call animation controller for step entrance', async () => {
      // Reset animation controller mock to ready state
      const animationController = (await import('../src/js/components/AnimationController.js')).default;
      animationController.isReady = vi.fn(() => true);
      animationController.createAnimation.mockClear();
      
      const stepElement = document.createElement('div');
      
      await formWizard.animateStepEntrance(stepElement);
      
      expect(animationController.createAnimation).toHaveBeenCalled();
    });
    
    it('should skip animations when disabled', async () => {
      // Mock animation controller as not ready
      const animationController = (await import('../src/js/components/AnimationController.js')).default;
      animationController.isReady = vi.fn(() => false);
      
      const stepElement = document.createElement('div');
      stepElement.style.opacity = '0'; // Set initial opacity
      
      await formWizard.animateStepEntrance(stepElement);
      
      expect(stepElement.style.opacity).toBe('1');
    });
    
    it('should animate input focus', async () => {
      // Ensure animations are enabled
      formWizard.options.enableAnimations = true;
      
      // Reset the mock to ensure clean state
      const animationController = (await import('../src/js/components/AnimationController.js')).default;
      animationController.isReady = vi.fn(() => true);
      animationController.createAnimation.mockClear();
      
      const input = document.createElement('input');
      const wrapper = document.createElement('div');
      wrapper.appendChild(input);
      
      formWizard.animateInputFocus(input);
      
      expect(animationController.createAnimation).toHaveBeenCalledWith(
        expect.any(Element), // The glow effect element
        expect.objectContaining({
          opacity: 1,
          duration: 0.3
        })
      );
    });
  });
  
  describe('Accessibility', () => {
    beforeEach(async () => {
      formWizard = new FormWizard(container);
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    it('should announce step changes', () => {
      formWizard.announceStepChange(2);
      
      const liveRegion = document.getElementById('wizard-live-region');
      expect(liveRegion).toBeTruthy();
      expect(liveRegion.textContent).toContain('Step 2 of 5');
    });
    
    it('should have proper ARIA attributes', () => {
      const wizard = container.querySelector('.form-wizard');
      expect(wizard.getAttribute('role')).toBe('form');
      expect(wizard.getAttribute('aria-label')).toBe('Multi-step workout form');
    });
  });
  
  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', async () => {
      // Mock console.error to avoid test output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Create a valid container but force an error in init
      const testContainer = document.createElement('div');
      document.body.appendChild(testContainer);
      
      // Create FormWizard with valid container
      const wizard = new FormWizard(testContainer);
      
      // Test error handling method directly
      expect(() => {
        wizard.handleInitializationError(new Error('Test error'));
      }).not.toThrow();
      
      document.body.removeChild(testContainer);
      consoleSpy.mockRestore();
    });
  });
  
  describe('Cleanup', () => {
    beforeEach(async () => {
      formWizard = new FormWizard(container);
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    it('should cleanup resources on destroy', () => {
      formWizard.progressTimeline = { kill: vi.fn() };
      formWizard.stepTransitionTimeline = { kill: vi.fn() };
      
      formWizard.destroy();
      
      expect(formWizard.progressTimeline.kill).toHaveBeenCalled();
      expect(formWizard.stepTransitionTimeline.kill).toHaveBeenCalled();
    });
    
    it('should reset form state', () => {
      formWizard.formData = { name: 'John' };
      formWizard.currentStep = 3;
      
      formWizard.reset();
      
      expect(formWizard.formData).toEqual({});
      expect(formWizard.getCurrentStep()).toBe(1);
    });
  });
});