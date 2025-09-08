import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Setup DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

describe('Animation Utils', () => {
  let animationUtils;
  let mockController;

  beforeEach(async () => {
    // Mock AnimationController
    mockController = {
      createAnimation: vi.fn(() => ({ kill: vi.fn() })),
      createStaggerAnimation: vi.fn(() => ({ kill: vi.fn() })),
      createScrollTrigger: vi.fn(() => ({ kill: vi.fn() })),
      isReady: vi.fn(() => true),
      getPerformanceMode: vi.fn(() => 'desktop'),
      gsap: {
        set: vi.fn(),
        to: vi.fn(() => ({ kill: vi.fn() })),
        timeline: vi.fn(() => ({
          to: vi.fn(),
          set: vi.fn(),
          call: vi.fn()
        }))
      },
      ScrollTrigger: {
        create: vi.fn(() => ({ kill: vi.fn() }))
      }
    };

    // Mock the AnimationController import
    vi.doMock('../src/js/components/AnimationController.js', () => ({
      default: mockController
    }));

    // Import animation utils after mocking
    const module = await import('../src/js/utils/animation-utils.js');
    animationUtils = module.default;
  });

  describe('Fade Animations', () => {
    it('should fade in element', () => {
      const target = document.createElement('div');
      
      animationUtils.fade.fadeIn(target);
      
      expect(mockController.createAnimation).toHaveBeenCalledWith(
        target,
        expect.objectContaining({
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        })
      );
    });

    it('should fade out element', () => {
      const target = document.createElement('div');
      
      animationUtils.fade.fadeOut(target);
      
      expect(mockController.createAnimation).toHaveBeenCalledWith(
        target,
        expect.objectContaining({
          opacity: 0,
          duration: 0.4,
          ease: "power2.in"
        })
      );
    });

    it('should toggle fade based on current opacity', () => {
      const target = document.createElement('div');
      target.style.opacity = '0';
      
      // Mock getComputedStyle
      window.getComputedStyle = vi.fn(() => ({
        opacity: '0'
      }));
      
      animationUtils.fade.fadeToggle(target);
      
      expect(mockController.createAnimation).toHaveBeenCalled();
    });
  });

  describe('Slide Animations', () => {
    it('should slide in from up', () => {
      const target = document.createElement('div');
      
      animationUtils.slide.slideIn(target, 'up');
      
      expect(mockController.gsap.set).toHaveBeenCalledWith(
        target,
        expect.objectContaining({
          opacity: 0,
          y: 50
        })
      );
      
      expect(mockController.createAnimation).toHaveBeenCalledWith(
        target,
        expect.objectContaining({
          opacity: 1,
          x: 0,
          y: 0
        })
      );
    });

    it('should slide out to direction', () => {
      const target = document.createElement('div');
      
      animationUtils.slide.slideOut(target, 'left');
      
      expect(mockController.createAnimation).toHaveBeenCalledWith(
        target,
        expect.objectContaining({
          opacity: 0,
          x: -50
        })
      );
    });

    it('should slide reveal with height animation', () => {
      const target = document.createElement('div');
      
      animationUtils.slide.slideReveal(target);
      
      expect(mockController.createAnimation).toHaveBeenCalledWith(
        target,
        expect.objectContaining({
          height: 'auto'
        })
      );
    });
  });

  describe('Scale Animations', () => {
    it('should scale in element', () => {
      const target = document.createElement('div');
      
      animationUtils.scale.scaleIn(target);
      
      expect(mockController.gsap.set).toHaveBeenCalledWith(
        target,
        expect.objectContaining({
          opacity: 0,
          scale: 0.8
        })
      );
      
      expect(mockController.createAnimation).toHaveBeenCalledWith(
        target,
        expect.objectContaining({
          opacity: 1,
          scale: 1,
          ease: "back.out(1.7)"
        })
      );
    });

    it('should scale pulse with yoyo effect', () => {
      const target = document.createElement('div');
      
      animationUtils.scale.scalePulse(target);
      
      expect(mockController.createAnimation).toHaveBeenCalledWith(
        target,
        expect.objectContaining({
          scale: 1.1,
          yoyo: true,
          repeat: 1
        })
      );
    });
  });

  describe('Rotation Animations', () => {
    it('should rotate element', () => {
      const target = document.createElement('div');
      
      animationUtils.rotation.rotate(target, 180);
      
      expect(mockController.createAnimation).toHaveBeenCalledWith(
        target,
        expect.objectContaining({
          rotation: 180
        })
      );
    });

    it('should create spin animation', () => {
      const target = document.createElement('div');
      
      animationUtils.rotation.spin(target);
      
      expect(mockController.createAnimation).toHaveBeenCalledWith(
        target,
        expect.objectContaining({
          rotation: 360,
          repeat: -1,
          ease: "none"
        })
      );
    });

    it('should create wobble effect', () => {
      const target = document.createElement('div');
      
      animationUtils.rotation.wobble(target);
      
      expect(mockController.gsap.timeline).toHaveBeenCalled();
    });
  });

  describe('Stagger Animations', () => {
    it('should stagger fade in multiple elements', () => {
      const targets = [
        document.createElement('div'),
        document.createElement('div')
      ];
      
      animationUtils.stagger.staggerFadeIn(targets);
      
      expect(mockController.createStaggerAnimation).toHaveBeenCalledWith(
        targets,
        expect.objectContaining({
          opacity: 1,
          y: 0
        }),
        expect.objectContaining({
          amount: 0.1,
          from: "start"
        })
      );
    });

    it('should stagger scale in with initial state', () => {
      const targets = [document.createElement('div')];
      
      animationUtils.stagger.staggerScaleIn(targets);
      
      expect(mockController.gsap.set).toHaveBeenCalledWith(
        targets,
        expect.objectContaining({
          opacity: 0,
          scale: 0.8
        })
      );
    });
  });

  describe('Scroll Animations', () => {
    it('should create reveal on scroll', () => {
      const target = document.createElement('div');
      
      animationUtils.scroll.revealOnScroll(target);
      
      expect(mockController.gsap.fromTo).toHaveBeenCalled();
      expect(mockController.createScrollTrigger).toHaveBeenCalled();
    });

    it('should create parallax effect', () => {
      const target = document.createElement('div');
      
      animationUtils.scroll.parallax(target, 0.5);
      
      expect(mockController.createScrollTrigger).toHaveBeenCalledWith(
        target,
        null,
        expect.objectContaining({
          scrub: true,
          onUpdate: expect.any(Function)
        })
      );
    });

    it('should create counter on scroll', () => {
      const target = document.createElement('span');
      
      animationUtils.scroll.counterOnScroll(target, 100);
      
      expect(mockController.gsap.to).toHaveBeenCalled();
      expect(mockController.createScrollTrigger).toHaveBeenCalled();
    });
  });

  describe('Utility Functions', () => {
    it('should create animation sequence', () => {
      const animations = [
        {
          target: document.createElement('div'),
          props: { opacity: 1 }
        },
        {
          target: document.createElement('div'),
          props: { x: 100 },
          options: { position: 0.5 }
        }
      ];
      
      const { createSequence } = animationUtils;
      if (createSequence) {
        createSequence(animations);
        
        expect(mockController.gsap.timeline).toHaveBeenCalled();
      }
    });

    it('should animate CSS properties', () => {
      const target = document.createElement('div');
      const cssProps = { '--custom-prop': '100px' };
      
      // Import is already done in beforeEach, use the imported utils
      const { animateCSS } = animationUtils;
      if (animateCSS) {
        animateCSS(target, cssProps);
        
        expect(mockController.createAnimation).toHaveBeenCalledWith(
          target,
          expect.objectContaining(cssProps)
        );
      }
    });

    it('should handle performant animation with reduced motion', () => {
      // Mock reduced motion in gsap-config
      vi.doMock('../src/js/utils/gsap-config.js', () => ({
        shouldReduceMotion: () => true
      }));
      
      const target = document.createElement('div');
      const props = { opacity: 1, x: 100 };
      
      // Test the function directly
      const { performantAnimate } = animationUtils;
      if (performantAnimate) {
        performantAnimate(target, props);
        
        // Should apply styles directly instead of animating
        expect(target.style.opacity).toBe('1');
      }
    });

    it('should optimize animation for mobile performance', () => {
      mockController.getPerformanceMode = vi.fn(() => 'mobile');
      
      const target = document.createElement('div');
      const props = { opacity: 1, duration: 1 };
      
      const { performantAnimate } = animationUtils;
      if (performantAnimate) {
        performantAnimate(target, props);
        
        expect(mockController.createAnimation).toHaveBeenCalledWith(
          target,
          expect.objectContaining({
            duration: 0.8 // Should be reduced for mobile
          }),
          undefined
        );
      }
    });
  });

  describe('Morph Animations', () => {
    it('should morph between states', () => {
      const target = document.createElement('div');
      const fromState = { opacity: 0, scale: 0.5 };
      const toState = { opacity: 1, scale: 1 };
      
      animationUtils.morph.morph(target, fromState, toState);
      
      expect(mockController.gsap.timeline).toHaveBeenCalled();
    });

    it('should create flip card effect', () => {
      const target = document.createElement('div');
      const onFlip = vi.fn();
      
      animationUtils.morph.flipCard(target, { onFlip });
      
      expect(mockController.gsap.timeline).toHaveBeenCalled();
    });
  });
});