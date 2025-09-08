import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class HeroSection {
  constructor(container) {
    this.container = container;
    this.timeline = gsap.timeline();
    this.floatingIcons = [];
    this.init();
  }

  init() {
    this.createHeroElements();
    this.initAnimations();
    this.initScrollTrigger();
  }

  createHeroElements() {
    this.container.innerHTML = `
      <div class="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background-main via-background-card to-background-main">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 opacity-20">
          <div class="floating-icon floating-icon-1 absolute" data-icon="💪">
            <span class="text-4xl">💪</span>
          </div>
          <div class="floating-icon floating-icon-2 absolute" data-icon="🏋️">
            <span class="text-4xl">🏋️</span>
          </div>
          <div class="floating-icon floating-icon-3 absolute" data-icon="🏃">
            <span class="text-4xl">🏃</span>
          </div>
          <div class="floating-icon floating-icon-4 absolute" data-icon="🥇">
            <span class="text-4xl">🥇</span>
          </div>
          <div class="floating-icon floating-icon-5 absolute" data-icon="⚡">
            <span class="text-4xl">⚡</span>
          </div>
        </div>

        <!-- Parallax Background Gradient -->
        <div class="parallax-bg absolute inset-0 bg-gradient-to-r from-primary-blue/10 via-primary-green/10 to-primary-orange/10"></div>

        <!-- Hero Content -->
        <div class="hero-content relative z-10 text-center px-6 max-w-6xl mx-auto">
          <!-- Main Heading with Staggered Animation -->
          <div class="hero-title-container mb-8">
            <h1 class="hero-title text-5xl md:text-7xl lg:text-8xl font-bold text-text-primary leading-tight">
              <span class="hero-word block overflow-hidden">
                <span class="hero-letter inline-block">T</span>
                <span class="hero-letter inline-block">r</span>
                <span class="hero-letter inline-block">a</span>
                <span class="hero-letter inline-block">n</span>
                <span class="hero-letter inline-block">s</span>
                <span class="hero-letter inline-block">f</span>
                <span class="hero-letter inline-block">o</span>
                <span class="hero-letter inline-block">r</span>
                <span class="hero-letter inline-block">m</span>
              </span>
              <span class="hero-word block overflow-hidden mt-2">
                <span class="hero-letter inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-primary-green">Y</span>
                <span class="hero-letter inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-primary-green">o</span>
                <span class="hero-letter inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-primary-green">u</span>
                <span class="hero-letter inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-primary-green">r</span>
              </span>
              <span class="hero-word block overflow-hidden mt-2">
                <span class="hero-letter inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-primary-orange">F</span>
                <span class="hero-letter inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-primary-orange">i</span>
                <span class="hero-letter inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-primary-orange">t</span>
                <span class="hero-letter inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-primary-orange">n</span>
                <span class="hero-letter inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-primary-orange">e</span>
                <span class="hero-letter inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-primary-orange">s</span>
                <span class="hero-letter inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-primary-orange">s</span>
              </span>
            </h1>
          </div>

          <!-- Subtitle with Fade Animation -->
          <div class="hero-subtitle-container mb-12">
            <p class="hero-subtitle text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed opacity-0">
              Create personalized workout plans tailored to your goals, fitness level, and available equipment. 
              Start your transformation journey today with AI-powered fitness guidance.
            </p>
          </div>

          <!-- CTA Button with Glow Effect -->
          <div class="hero-cta-container">
            <button class="hero-cta-btn glass-card px-8 py-4 text-lg font-semibold text-text-primary rounded-2xl border border-primary-blue/30 hover:border-primary-blue/60 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary-blue/25 opacity-0">
              <span class="relative z-10">Start Your Journey</span>
              <div class="absolute inset-0 bg-gradient-to-r from-primary-blue/20 to-primary-green/20 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
            </button>
          </div>

          <!-- Scroll Indicator -->
          <div class="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0">
            <div class="scroll-arrow w-6 h-10 border-2 border-text-secondary/50 rounded-full flex justify-center">
              <div class="scroll-dot w-1 h-3 bg-primary-blue rounded-full mt-2 animate-bounce"></div>
            </div>
            <p class="text-text-secondary/70 text-sm mt-2">Scroll to explore</p>
          </div>
        </div>
      </div>
    `;

    // Store references to animated elements
    this.heroLetters = this.container.querySelectorAll('.hero-letter');
    this.heroSubtitle = this.container.querySelector('.hero-subtitle');
    this.heroCTA = this.container.querySelector('.hero-cta-btn');
    this.scrollIndicator = this.container.querySelector('.scroll-indicator');
    this.floatingIcons = this.container.querySelectorAll('.floating-icon');
    this.parallaxBg = this.container.querySelector('.parallax-bg');
  }

  initAnimations() {
    // Set initial states
    gsap.set(this.heroLetters, { y: 100, opacity: 0 });
    gsap.set(this.heroSubtitle, { y: 50, opacity: 0 });
    gsap.set(this.heroCTA, { y: 30, opacity: 0, scale: 0.9 });
    gsap.set(this.scrollIndicator, { y: 20, opacity: 0 });
    gsap.set(this.floatingIcons, { opacity: 0, scale: 0 });

    // Position floating icons randomly
    this.floatingIcons.forEach((icon, index) => {
      const x = Math.random() * 80 + 10; // 10-90% of screen width
      const y = Math.random() * 80 + 10; // 10-90% of screen height
      gsap.set(icon, { 
        left: `${x}%`, 
        top: `${y}%`,
        rotation: Math.random() * 360
      });
    });

    // Main entrance timeline
    this.timeline
      .to(this.heroLetters, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(1.7)"
      })
      .to(this.heroSubtitle, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3")
      .to(this.heroCTA, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      }, "-=0.2")
      .to(this.scrollIndicator, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.1")
      .to(this.floatingIcons, {
        opacity: 0.6,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, "-=0.8");

    // Floating animation for icons
    this.initFloatingAnimations();
  }

  initFloatingAnimations() {
    this.floatingIcons.forEach((icon, index) => {
      // Continuous floating animation
      gsap.to(icon, {
        y: "+=20",
        rotation: "+=10",
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5
      });

      // Subtle scale breathing effect
      gsap.to(icon, {
        scale: 1.1,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.3
      });
    });
  }

  initScrollTrigger() {
    // Parallax effect for background
    gsap.to(this.parallaxBg, {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: this.container,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Hide scroll indicator on scroll
    ScrollTrigger.create({
      trigger: this.container,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        gsap.to(this.scrollIndicator, {
          opacity: 1 - self.progress,
          duration: 0.3
        });
      }
    });

    // Floating icons parallax
    this.floatingIcons.forEach((icon, index) => {
      gsap.to(icon, {
        yPercent: -30 - (index * 10),
        ease: "none",
        scrollTrigger: {
          trigger: this.container,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }

  // Method to trigger hero animations
  play() {
    this.timeline.play();
  }

  // Method to reset animations
  reset() {
    this.timeline.restart();
  }

  // Cleanup method
  destroy() {
    this.timeline.kill();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}