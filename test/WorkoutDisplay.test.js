import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock modules first
vi.mock('gsap', () => ({
  gsap: {
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      add: vi.fn().mockReturnThis(),
      play: vi.fn().mockReturnThis(),
      reverse: vi.fn().mockReturnThis(),
      kill: vi.fn().mockReturnThis(),
      progress: vi.fn(() => 0),
      paused: true
    })),
    to: vi.fn(),
    set: vi.fn(),
    registerPlugin: vi.fn()
  }
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
    getAll: vi.fn(() => [{ kill: vi.fn() }])
  }
}));

vi.mock('../src/js/utils/gsap-config.js', () => ({
  animationConfig: {
    defaults: {
      duration: 0.6,
      ease: "power2.out"
    }
  }
}));

import { WorkoutDisplay } from '../src/js/components/WorkoutDisplay.js';

describe('WorkoutDisplay', () => {
  let workoutDisplay;
  let mockContainer;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div class="workout-grid">
        <div class="workout-card" data-day="Monday">
          <div class="card-front">
            <h2>Monday</h2>
            <ul>
              <li>
                <strong>Push-ups</strong>
                <span class="exercise-counter" data-counter="3">3 sets of 
                  <span class="exercise-counter" data-counter="10">10</span> reps
                </span>
              </li>
              <li>
                <strong>Squats</strong>
                <span class="exercise-counter" data-counter="3">3 sets of 
                  <span class="exercise-counter" data-counter="15">15</span> reps
                </span>
              </li>
            </ul>
            <button class="complete-btn">Mark as Complete</button>
          </div>
        </div>
        <div class="workout-card" data-day="Tuesday">
          <div class="card-front">
            <h2>Tuesday</h2>
            <ul>
              <li>
                <strong>Planks</strong>
                <span class="exercise-counter" data-counter="3">3 sets of 
                  <span class="exercise-counter" data-counter="30">30</span> seconds
                </span>
              </li>
            </ul>
            <button class="complete-btn">Mark as Complete</button>
          </div>
        </div>
      </div>
      <div class="collapsible-section">
        <div class="section-header">
          <h3>Reminders</h3>
          <svg class="collapse-icon"></svg>
        </div>
        <div class="section-content">
          <p>Content here</p>
        </div>
      </div>
    `;

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (workoutDisplay) {
      workoutDisplay.destroy();
    }
    document.body.innerHTML = '';
  });

  describe('Initialization', () => {
    it('should initialize without errors', () => {
      expect(() => {
        workoutDisplay = new WorkoutDisplay();
      }).not.toThrow();
    });

    it('should setup workout cards', () => {
      workoutDisplay = new WorkoutDisplay();
      
      expect(workoutDisplay.workoutCards).toHaveLength(2);
      expect(workoutDisplay.workoutCards[0].element.dataset.day).toBe('Monday');
      expect(workoutDisplay.workoutCards[1].element.dataset.day).toBe('Tuesday');
    });

    it('should setup exercise counters', () => {
      workoutDisplay = new WorkoutDisplay();
      
      expect(workoutDisplay.exerciseCounters.length).toBeGreaterThan(0);
      expect(workoutDisplay.exerciseCounters[0].targetValue).toBeGreaterThan(0);
    });

    it('should setup collapsible sections', () => {
      workoutDisplay = new WorkoutDisplay();
      
      expect(workoutDisplay.collapsibleSections).toHaveLength(1);
      expect(workoutDisplay.collapsibleSections[0].isExpanded).toBe(false);
    });
  });

  describe('Card Animations', () => {
    beforeEach(() => {
      workoutDisplay = new WorkoutDisplay();
    });

    it('should set initial card states for animation', () => {
      const { gsap } = await import('gsap');
      expect(gsap.set).toHaveBeenCalledWith(
        expect.any(Element),
        expect.objectContaining({
          opacity: 0,
          y: 50,
          rotationX: -15
        })
      );
    });

    it('should create flip animations for cards', () => {
      const card = workoutDisplay.workoutCards[0];
      expect(card.flipTimeline).toBeDefined();
    });

    it('should handle card flip toggle', () => {
      const flipTimelineMock = workoutDisplay.workoutCards[0].flipTimeline;
      
      workoutDisplay.toggleCardFlip(0);
      expect(flipTimelineMock.play).toHaveBeenCalled();
    });

    it('should create card back sides', () => {
      const card = document.querySelector('.workout-card');
      const backSide = card.querySelector('.card-back');
      
      expect(backSide).toBeTruthy();
      expect(backSide.querySelector('.exercise-details')).toBeTruthy();
    });
  });

  describe('Exercise Counters', () => {
    beforeEach(() => {
      workoutDisplay = new WorkoutDisplay();
    });

    it('should animate counters', () => {
      const counter = workoutDisplay.exerciseCounters[0];
      
      workoutDisplay.animateCounter(0);
      
      expect(counter.isAnimated).toBe(true);
      expect(mockGsap.to).toHaveBeenCalledWith(
        counter,
        expect.objectContaining({
          currentValue: counter.targetValue,
          duration: 1.5
        })
      );
    });

    it('should not animate counter twice', () => {
      workoutDisplay.animateCounter(0);
      const callCount = mockGsap.to.mock.calls.length;
      
      workoutDisplay.animateCounter(0);
      
      expect(mockGsap.to.mock.calls.length).toBe(callCount);
    });
  });

  describe('Collapsible Sections', () => {
    beforeEach(() => {
      workoutDisplay = new WorkoutDisplay();
    });

    it('should toggle section expansion', () => {
      const section = workoutDisplay.collapsibleSections[0];
      const initialState = section.isExpanded;
      
      workoutDisplay.toggleSection(0);
      
      expect(section.isExpanded).toBe(!initialState);
    });

    it('should play timeline when expanding', () => {
      const section = workoutDisplay.collapsibleSections[0];
      section.isExpanded = false;
      
      workoutDisplay.toggleSection(0);
      
      expect(section.timeline.play).toHaveBeenCalled();
    });

    it('should reverse timeline when collapsing', () => {
      const section = workoutDisplay.collapsibleSections[0];
      section.isExpanded = true;
      
      workoutDisplay.toggleSection(0);
      
      expect(section.timeline.reverse).toHaveBeenCalled();
    });
  });

  describe('Reveal Animations', () => {
    beforeEach(() => {
      workoutDisplay = new WorkoutDisplay();
    });

    it('should create reveal timeline', () => {
      expect(mockGsap.timeline).toHaveBeenCalled();
    });

    it('should setup scroll trigger for reveals', () => {
      expect(mockScrollTrigger.create).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: '.workout-grid',
          start: 'top 80%'
        })
      );
    });

    it('should reveal all cards', () => {
      workoutDisplay.revealAllCards();
      expect(workoutDisplay.revealTimeline.play).toHaveBeenCalled();
    });

    it('should hide all cards', () => {
      workoutDisplay.hideAllCards();
      expect(workoutDisplay.revealTimeline.reverse).toHaveBeenCalled();
    });
  });

  describe('Responsive Layout', () => {
    beforeEach(() => {
      workoutDisplay = new WorkoutDisplay();
    });

    it('should handle window resize', () => {
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      expect(mockScrollTrigger.refresh).toHaveBeenCalled();
    });

    it('should update grid layout classes', () => {
      const grid = document.querySelector('.workout-grid');
      
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500
      });
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      // Allow time for debounced resize handler
      setTimeout(() => {
        expect(grid.classList.contains('grid-mobile')).toBe(true);
      }, 300);
    });
  });

  describe('Public Methods', () => {
    beforeEach(() => {
      workoutDisplay = new WorkoutDisplay();
    });

    it('should expand all sections', () => {
      workoutDisplay.expandAllSections();
      
      workoutDisplay.collapsibleSections.forEach(section => {
        expect(section.isExpanded).toBe(true);
      });
    });

    it('should collapse all sections', () => {
      // First expand all
      workoutDisplay.expandAllSections();
      
      // Then collapse all
      workoutDisplay.collapseAllSections();
      
      workoutDisplay.collapsibleSections.forEach(section => {
        expect(section.isExpanded).toBe(false);
      });
    });
  });

  describe('Cleanup', () => {
    beforeEach(() => {
      workoutDisplay = new WorkoutDisplay();
    });

    it('should cleanup animations on destroy', () => {
      workoutDisplay.destroy();
      
      expect(workoutDisplay.revealTimeline.kill).toHaveBeenCalled();
      workoutDisplay.workoutCards.forEach(card => {
        expect(card.flipTimeline.kill).toHaveBeenCalled();
      });
      workoutDisplay.collapsibleSections.forEach(section => {
        expect(section.timeline.kill).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing elements gracefully', () => {
      document.body.innerHTML = '<div></div>';
      
      expect(() => {
        workoutDisplay = new WorkoutDisplay();
      }).not.toThrow();
    });

    it('should handle invalid counter values', () => {
      document.body.innerHTML = `
        <div class="workout-grid">
          <span class="exercise-counter" data-counter="invalid">text</span>
        </div>
      `;
      
      expect(() => {
        workoutDisplay = new WorkoutDisplay();
      }).not.toThrow();
    });
  });
});