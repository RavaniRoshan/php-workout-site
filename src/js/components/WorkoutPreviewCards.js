import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class WorkoutPreviewCards {
  constructor(container) {
    this.container = container;
    this.cards = [];
    this.timeline = gsap.timeline();
    this.init();
  }

  init() {
    this.createPreviewCards();
    this.initAnimations();
    this.initScrollTrigger();
    this.initInteractions();
  }

  createPreviewCards() {
    this.container.innerHTML = `
      <div class="preview-cards-section py-20 px-6 relative">
        <div class="container max-w-7xl mx-auto">
          <!-- Section Header -->
          <div class="section-header text-center mb-16">
            <h2 class="section-title text-4xl md:text-5xl font-bold text-text-primary mb-6 opacity-0">
              Discover Your 
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-primary-green">Perfect Workout</span>
            </h2>
            <p class="section-subtitle text-xl text-text-secondary max-w-3xl mx-auto opacity-0">
              Explore our diverse range of workout styles and find the perfect match for your fitness goals and lifestyle.
            </p>
          </div>

          <!-- Workout Preview Cards Grid -->
          <div class="preview-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <!-- Strength Training Card -->
            <div class="preview-card glass-card p-6 rounded-3xl border border-white/10 hover:border-primary-blue/50 transition-all duration-500 cursor-pointer opacity-0" data-workout="strength">
              <div class="card-icon mb-6 text-center">
                <div class="icon-container w-20 h-20 mx-auto bg-gradient-to-br from-primary-blue/20 to-primary-blue/40 rounded-2xl flex items-center justify-center">
                  <span class="text-4xl">💪</span>
                </div>
              </div>
              <div class="card-content text-center">
                <h3 class="card-title text-2xl font-bold text-text-primary mb-3">Strength Training</h3>
                <p class="card-description text-text-secondary mb-4 leading-relaxed">
                  Build muscle mass and increase strength with progressive resistance training tailored to your level.
                </p>
                <div class="card-stats flex justify-center space-x-4 mb-4">
                  <div class="stat">
                    <span class="stat-number text-primary-blue font-bold">45</span>
                    <span class="stat-label text-text-muted text-sm">min</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number text-primary-blue font-bold">3-5</span>
                    <span class="stat-label text-text-muted text-sm">days/week</span>
                  </div>
                </div>
                <div class="card-equipment flex justify-center space-x-2">
                  <span class="equipment-tag bg-primary-blue/20 text-primary-blue px-3 py-1 rounded-full text-sm">Weights</span>
                  <span class="equipment-tag bg-primary-blue/20 text-primary-blue px-3 py-1 rounded-full text-sm">Barbell</span>
                </div>
              </div>
              <div class="card-overlay absolute inset-0 bg-gradient-to-br from-primary-blue/10 to-transparent rounded-3xl opacity-0 transition-opacity duration-300"></div>
            </div>

            <!-- Cardio Training Card -->
            <div class="preview-card glass-card p-6 rounded-3xl border border-white/10 hover:border-primary-green/50 transition-all duration-500 cursor-pointer opacity-0" data-workout="cardio">
              <div class="card-icon mb-6 text-center">
                <div class="icon-container w-20 h-20 mx-auto bg-gradient-to-br from-primary-green/20 to-primary-green/40 rounded-2xl flex items-center justify-center">
                  <span class="text-4xl">🏃</span>
                </div>
              </div>
              <div class="card-content text-center">
                <h3 class="card-title text-2xl font-bold text-text-primary mb-3">Cardio Training</h3>
                <p class="card-description text-text-secondary mb-4 leading-relaxed">
                  Improve cardiovascular health and burn calories with dynamic, heart-pumping exercises.
                </p>
                <div class="card-stats flex justify-center space-x-4 mb-4">
                  <div class="stat">
                    <span class="stat-number text-primary-green font-bold">30</span>
                    <span class="stat-label text-text-muted text-sm">min</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number text-primary-green font-bold">4-6</span>
                    <span class="stat-label text-text-muted text-sm">days/week</span>
                  </div>
                </div>
                <div class="card-equipment flex justify-center space-x-2">
                  <span class="equipment-tag bg-primary-green/20 text-primary-green px-3 py-1 rounded-full text-sm">Bodyweight</span>
                  <span class="equipment-tag bg-primary-green/20 text-primary-green px-3 py-1 rounded-full text-sm">Minimal</span>
                </div>
              </div>
              <div class="card-overlay absolute inset-0 bg-gradient-to-br from-primary-green/10 to-transparent rounded-3xl opacity-0 transition-opacity duration-300"></div>
            </div>

            <!-- HIIT Training Card -->
            <div class="preview-card glass-card p-6 rounded-3xl border border-white/10 hover:border-primary-orange/50 transition-all duration-500 cursor-pointer opacity-0" data-workout="hiit">
              <div class="card-icon mb-6 text-center">
                <div class="icon-container w-20 h-20 mx-auto bg-gradient-to-br from-primary-orange/20 to-primary-orange/40 rounded-2xl flex items-center justify-center">
                  <span class="text-4xl">⚡</span>
                </div>
              </div>
              <div class="card-content text-center">
                <h3 class="card-title text-2xl font-bold text-text-primary mb-3">HIIT Training</h3>
                <p class="card-description text-text-secondary mb-4 leading-relaxed">
                  Maximize results with high-intensity interval training for efficient fat burning and conditioning.
                </p>
                <div class="card-stats flex justify-center space-x-4 mb-4">
                  <div class="stat">
                    <span class="stat-number text-primary-orange font-bold">20</span>
                    <span class="stat-label text-text-muted text-sm">min</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number text-primary-orange font-bold">3-4</span>
                    <span class="stat-label text-text-muted text-sm">days/week</span>
                  </div>
                </div>
                <div class="card-equipment flex justify-center space-x-2">
                  <span class="equipment-tag bg-primary-orange/20 text-primary-orange px-3 py-1 rounded-full text-sm">Bodyweight</span>
                  <span class="equipment-tag bg-primary-orange/20 text-primary-orange px-3 py-1 rounded-full text-sm">Kettlebells</span>
                </div>
              </div>
              <div class="card-overlay absolute inset-0 bg-gradient-to-br from-primary-orange/10 to-transparent rounded-3xl opacity-0 transition-opacity duration-300"></div>
            </div>
          </div>

          <!-- Equipment Showcase -->
          <div class="equipment-showcase">
            <div class="showcase-header text-center mb-12">
              <h3 class="showcase-title text-3xl md:text-4xl font-bold text-text-primary mb-4 opacity-0">
                Train With 
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-primary-orange">Any Equipment</span>
              </h3>
              <p class="showcase-subtitle text-lg text-text-secondary opacity-0">
                From bodyweight exercises to full gym setups, we've got you covered.
              </p>
            </div>

            <div class="equipment-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <!-- Bodyweight Equipment -->
              <div class="equipment-card glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-pointer opacity-0" data-equipment="bodyweight">
                <div class="equipment-icon text-4xl mb-3">💪</div>
                <h4 class="equipment-name text-text-primary font-semibold mb-2">Bodyweight</h4>
                <p class="equipment-desc text-text-muted text-sm">No equipment needed</p>
              </div>

              <!-- Dumbbells Equipment -->
              <div class="equipment-card glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-pointer opacity-0" data-equipment="dumbbells">
                <div class="equipment-icon text-4xl mb-3">🏋️</div>
                <h4 class="equipment-name text-text-primary font-semibold mb-2">Dumbbells</h4>
                <p class="equipment-desc text-text-muted text-sm">Versatile strength training</p>
              </div>

              <!-- Barbell Equipment -->
              <div class="equipment-card glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-pointer opacity-0" data-equipment="barbell">
                <div class="equipment-icon text-4xl mb-3">🏋️‍♂️</div>
                <h4 class="equipment-name text-text-primary font-semibold mb-2">Barbell</h4>
                <p class="equipment-desc text-text-muted text-sm">Heavy compound lifts</p>
              </div>

              <!-- Kettlebells Equipment -->
              <div class="equipment-card glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-pointer opacity-0" data-equipment="kettlebells">
                <div class="equipment-icon text-4xl mb-3">⚖️</div>
                <h4 class="equipment-name text-text-primary font-semibold mb-2">Kettlebells</h4>
                <p class="equipment-desc text-text-muted text-sm">Dynamic movements</p>
              </div>

              <!-- Resistance Bands Equipment -->
              <div class="equipment-card glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-pointer opacity-0" data-equipment="bands">
                <div class="equipment-icon text-4xl mb-3">🎯</div>
                <h4 class="equipment-name text-text-primary font-semibold mb-2">Bands</h4>
                <p class="equipment-desc text-text-muted text-sm">Portable resistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Store references to animated elements
    this.sectionTitle = this.container.querySelector('.section-title');
    this.sectionSubtitle = this.container.querySelector('.section-subtitle');
    this.previewCards = this.container.querySelectorAll('.preview-card');
    this.showcaseTitle = this.container.querySelector('.showcase-title');
    this.showcaseSubtitle = this.container.querySelector('.showcase-subtitle');
    this.equipmentCards = this.container.querySelectorAll('.equipment-card');
  }

  initAnimations() {
    // Set initial states
    gsap.set([this.sectionTitle, this.sectionSubtitle], { y: 50, opacity: 0 });
    gsap.set(this.previewCards, { y: 80, opacity: 0, scale: 0.9 });
    gsap.set([this.showcaseTitle, this.showcaseSubtitle], { y: 30, opacity: 0 });
    gsap.set(this.equipmentCards, { y: 40, opacity: 0, scale: 0.8 });
  }

  initScrollTrigger() {
    // Section header animation
    ScrollTrigger.create({
      trigger: this.sectionTitle,
      start: "top 80%",
      onEnter: () => {
        gsap.timeline()
          .to(this.sectionTitle, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
          })
          .to(this.sectionSubtitle, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
          }, "-=0.4");
      }
    });

    // Preview cards staggered animation
    ScrollTrigger.create({
      trigger: this.previewCards[0],
      start: "top 85%",
      onEnter: () => {
        gsap.to(this.previewCards, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)"
        });
      }
    });

    // Equipment showcase animation
    ScrollTrigger.create({
      trigger: this.showcaseTitle,
      start: "top 80%",
      onEnter: () => {
        gsap.timeline()
          .to([this.showcaseTitle, this.showcaseSubtitle], {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
          })
          .to(this.equipmentCards, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
          }, "-=0.3");
      }
    });
  }

  initInteractions() {
    // Preview card hover effects
    this.previewCards.forEach(card => {
      const overlay = card.querySelector('.card-overlay');
      const iconContainer = card.querySelector('.icon-container');
      
      card.addEventListener('mouseenter', () => {
        gsap.to(overlay, { opacity: 1, duration: 0.3 });
        gsap.to(card, { 
          y: -10, 
          scale: 1.02,
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.to(iconContainer, {
          scale: 1.1,
          rotation: 5,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(overlay, { opacity: 0, duration: 0.3 });
        gsap.to(card, { 
          y: 0, 
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.to(iconContainer, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      // Magnetic effect
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(card, {
          x: x * 0.1,
          y: y * 0.1,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          x: 0,
          y: -10,
          duration: 0.4,
          ease: "power2.out"
        });
      });
    });

    // Equipment card interactions
    this.equipmentCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.1,
          y: -5,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    // Click handlers for preview cards
    this.previewCards.forEach(card => {
      card.addEventListener('click', () => {
        const workoutType = card.dataset.workout;
        this.handleWorkoutSelection(workoutType, card);
      });
    });

    // Click handlers for equipment cards
    this.equipmentCards.forEach(card => {
      card.addEventListener('click', () => {
        const equipmentType = card.dataset.equipment;
        this.handleEquipmentSelection(equipmentType, card);
      });
    });
  }

  handleWorkoutSelection(workoutType, cardElement) {
    // Animate selection
    gsap.to(cardElement, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    // Scroll to form section
    const formSection = document.querySelector('.form-section');
    if (formSection) {
      gsap.to(window, {
        scrollTo: formSection,
        duration: 1,
        ease: "power2.inOut"
      });

      // Pre-select the workout goal in the form
      setTimeout(() => {
        const goalSelect = document.getElementById('goal');
        if (goalSelect) {
          switch(workoutType) {
            case 'strength':
              goalSelect.value = 'muscle_gain';
              break;
            case 'cardio':
              goalSelect.value = 'weight_loss';
              break;
            case 'hiit':
              goalSelect.value = 'general_fitness';
              break;
          }
          
          // Animate the form field
          gsap.to(goalSelect.parentElement, {
            scale: 1.05,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          });
        }
      }, 500);
    }
  }

  handleEquipmentSelection(equipmentType, cardElement) {
    // Animate selection
    gsap.to(cardElement, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    // Scroll to form and pre-select equipment
    const formSection = document.querySelector('.form-section');
    if (formSection) {
      gsap.to(window, {
        scrollTo: formSection,
        duration: 1,
        ease: "power2.inOut"
      });

      // Pre-select equipment in the form
      setTimeout(() => {
        const equipmentCheckbox = document.getElementById(equipmentType === 'bands' ? 'resistance_bands' : equipmentType);
        if (equipmentCheckbox) {
          equipmentCheckbox.checked = true;
          
          // Animate the equipment option
          gsap.to(equipmentCheckbox.parentElement, {
            scale: 1.05,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          });
        }
      }, 500);
    }
  }

  // Method to trigger animations manually
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