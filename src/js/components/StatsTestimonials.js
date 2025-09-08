import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class StatsTestimonials {
  constructor(container) {
    this.container = container;
    this.currentTestimonial = 0;
    this.testimonialInterval = null;
    this.timeline = gsap.timeline();
    this.init();
  }

  init() {
    this.createStatsTestimonialsSection();
    this.initAnimations();
    this.initScrollTrigger();
    this.initTestimonialCarousel();
  }

  createStatsTestimonialsSection() {
    this.container.innerHTML = `
      <div class="stats-testimonials-section py-20 px-6 relative">
        <div class="container max-w-7xl mx-auto">
          
          <!-- Statistics Section -->
          <div class="statistics-section mb-20">
            <div class="section-header text-center mb-16">
              <h2 class="stats-title text-4xl md:text-5xl font-bold text-text-primary mb-6 opacity-0">
                Proven 
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-orange to-primary-blue">Results</span>
              </h2>
              <p class="stats-subtitle text-xl text-text-secondary max-w-3xl mx-auto opacity-0">
                Join thousands of fitness enthusiasts who have transformed their lives with our personalized workout plans.
              </p>
            </div>

            <div class="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <!-- Active Users Stat -->
              <div class="stat-card glass-card p-8 rounded-3xl text-center border border-white/10 hover:border-primary-blue/50 transition-all duration-500 opacity-0">
                <div class="stat-icon mb-6">
                  <div class="icon-container w-16 h-16 mx-auto bg-gradient-to-br from-primary-blue/20 to-primary-blue/40 rounded-2xl flex items-center justify-center">
                    <span class="text-3xl">👥</span>
                  </div>
                </div>
                <div class="stat-number text-4xl font-bold text-primary-blue mb-2" data-counter="50000">0</div>
                <div class="stat-label text-text-secondary font-medium">Active Users</div>
                <div class="stat-description text-text-muted text-sm mt-2">Worldwide community</div>
              </div>

              <!-- Workouts Generated Stat -->
              <div class="stat-card glass-card p-8 rounded-3xl text-center border border-white/10 hover:border-primary-green/50 transition-all duration-500 opacity-0">
                <div class="stat-icon mb-6">
                  <div class="icon-container w-16 h-16 mx-auto bg-gradient-to-br from-primary-green/20 to-primary-green/40 rounded-2xl flex items-center justify-center">
                    <span class="text-3xl">🏋️</span>
                  </div>
                </div>
                <div class="stat-number text-4xl font-bold text-primary-green mb-2" data-counter="250000">0</div>
                <div class="stat-label text-text-secondary font-medium">Workouts Generated</div>
                <div class="stat-description text-text-muted text-sm mt-2">Personalized plans created</div>
              </div>

              <!-- Success Rate Stat -->
              <div class="stat-card glass-card p-8 rounded-3xl text-center border border-white/10 hover:border-primary-orange/50 transition-all duration-500 opacity-0">
                <div class="stat-icon mb-6">
                  <div class="icon-container w-16 h-16 mx-auto bg-gradient-to-br from-primary-orange/20 to-primary-orange/40 rounded-2xl flex items-center justify-center">
                    <span class="text-3xl">🎯</span>
                  </div>
                </div>
                <div class="stat-number text-4xl font-bold text-primary-orange mb-2" data-counter="94">0</div>
                <div class="stat-label text-text-secondary font-medium">Success Rate %</div>
                <div class="stat-description text-text-muted text-sm mt-2">Goal achievement rate</div>
              </div>

              <!-- Average Weight Loss Stat -->
              <div class="stat-card glass-card p-8 rounded-3xl text-center border border-white/10 hover:border-primary-blue/50 transition-all duration-500 opacity-0">
                <div class="stat-icon mb-6">
                  <div class="icon-container w-16 h-16 mx-auto bg-gradient-to-br from-primary-blue/20 to-primary-green/40 rounded-2xl flex items-center justify-center">
                    <span class="text-3xl">📈</span>
                  </div>
                </div>
                <div class="stat-number text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-primary-green mb-2" data-counter="15">0</div>
                <div class="stat-label text-text-secondary font-medium">Avg. Weight Loss (lbs)</div>
                <div class="stat-description text-text-muted text-sm mt-2">In first 3 months</div>
              </div>
            </div>
          </div>

          <!-- Testimonials Section -->
          <div class="testimonials-section">
            <div class="section-header text-center mb-16">
              <h2 class="testimonials-title text-4xl md:text-5xl font-bold text-text-primary mb-6 opacity-0">
                What Our 
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-primary-orange">Community Says</span>
              </h2>
              <p class="testimonials-subtitle text-xl text-text-secondary max-w-3xl mx-auto opacity-0">
                Real stories from real people who transformed their fitness journey with our platform.
              </p>
            </div>

            <div class="testimonials-carousel relative max-w-4xl mx-auto">
              <!-- Testimonial Cards Container -->
              <div class="testimonials-container relative h-96 overflow-hidden rounded-3xl">
                
                <!-- Testimonial 1 -->
                <div class="testimonial-card absolute inset-0 glass-card p-8 rounded-3xl border border-white/10 opacity-0" data-testimonial="0">
                  <div class="testimonial-content flex flex-col md:flex-row items-center gap-8">
                    <div class="testimonial-avatar">
                      <div class="avatar-container w-24 h-24 bg-gradient-to-br from-primary-blue/30 to-primary-green/30 rounded-full flex items-center justify-center">
                        <span class="text-4xl">👨‍💼</span>
                      </div>
                    </div>
                    <div class="testimonial-text flex-1">
                      <div class="testimonial-quote text-2xl text-primary-blue mb-4">"</div>
                      <p class="testimonial-message text-lg text-text-secondary leading-relaxed mb-6">
                        "I lost 25 pounds in 4 months following the personalized workout plan. The variety kept me engaged, and the progressive difficulty helped me build real strength. Best fitness decision I've ever made!"
                      </p>
                      <div class="testimonial-author">
                        <div class="author-name text-text-primary font-semibold text-lg">Sarah Johnson</div>
                        <div class="author-role text-text-muted">Marketing Manager</div>
                        <div class="author-achievement text-primary-green text-sm font-medium mt-1">Lost 25 lbs • Gained confidence</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Testimonial 2 -->
                <div class="testimonial-card absolute inset-0 glass-card p-8 rounded-3xl border border-white/10 opacity-0" data-testimonial="1">
                  <div class="testimonial-content flex flex-col md:flex-row items-center gap-8">
                    <div class="testimonial-avatar">
                      <div class="avatar-container w-24 h-24 bg-gradient-to-br from-primary-green/30 to-primary-orange/30 rounded-full flex items-center justify-center">
                        <span class="text-4xl">👨‍🎓</span>
                      </div>
                    </div>
                    <div class="testimonial-text flex-1">
                      <div class="testimonial-quote text-2xl text-primary-green mb-4">"</div>
                      <p class="testimonial-message text-lg text-text-secondary leading-relaxed mb-6">
                        "As a busy student, I needed workouts that fit my schedule. The 20-minute HIIT sessions were perfect! I built muscle, improved my endurance, and actually look forward to working out now."
                      </p>
                      <div class="testimonial-author">
                        <div class="author-name text-text-primary font-semibold text-lg">Mike Chen</div>
                        <div class="author-role text-text-muted">Computer Science Student</div>
                        <div class="author-achievement text-primary-orange text-sm font-medium mt-1">Built muscle • Improved endurance</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Testimonial 3 -->
                <div class="testimonial-card absolute inset-0 glass-card p-8 rounded-3xl border border-white/10 opacity-0" data-testimonial="2">
                  <div class="testimonial-content flex flex-col md:flex-row items-center gap-8">
                    <div class="testimonial-avatar">
                      <div class="avatar-container w-24 h-24 bg-gradient-to-br from-primary-orange/30 to-primary-blue/30 rounded-full flex items-center justify-center">
                        <span class="text-4xl">👩‍⚕️</span>
                      </div>
                    </div>
                    <div class="testimonial-text flex-1">
                      <div class="testimonial-quote text-2xl text-primary-orange mb-4">"</div>
                      <p class="testimonial-message text-lg text-text-secondary leading-relaxed mb-6">
                        "After my injury, I thought I'd never get back to fitness. The adaptive workouts helped me rebuild my strength safely. I'm now stronger than I was before my injury!"
                      </p>
                      <div class="testimonial-author">
                        <div class="author-name text-text-primary font-semibold text-lg">Dr. Emily Rodriguez</div>
                        <div class="author-role text-text-muted">Physical Therapist</div>
                        <div class="author-achievement text-primary-blue text-sm font-medium mt-1">Recovered from injury • Stronger than before</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Carousel Navigation -->
              <div class="carousel-navigation flex justify-center items-center mt-8 gap-4">
                <button class="nav-btn prev-btn glass-card w-12 h-12 rounded-full flex items-center justify-center border border-white/20 hover:border-primary-blue/50 transition-all duration-300 opacity-0">
                  <span class="text-text-primary text-xl">‹</span>
                </button>
                
                <div class="carousel-dots flex gap-3">
                  <button class="dot w-3 h-3 rounded-full bg-white/30 hover:bg-primary-blue/50 transition-all duration-300 opacity-0" data-dot="0"></button>
                  <button class="dot w-3 h-3 rounded-full bg-white/30 hover:bg-primary-green/50 transition-all duration-300 opacity-0" data-dot="1"></button>
                  <button class="dot w-3 h-3 rounded-full bg-white/30 hover:bg-primary-orange/50 transition-all duration-300 opacity-0" data-dot="2"></button>
                </div>
                
                <button class="nav-btn next-btn glass-card w-12 h-12 rounded-full flex items-center justify-center border border-white/20 hover:border-primary-green/50 transition-all duration-300 opacity-0">
                  <span class="text-text-primary text-xl">›</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    // Store references to animated elements
    this.statsTitle = this.container.querySelector('.stats-title');
    this.statsSubtitle = this.container.querySelector('.stats-subtitle');
    this.statCards = this.container.querySelectorAll('.stat-card');
    this.statNumbers = this.container.querySelectorAll('[data-counter]');
    
    this.testimonialsTitle = this.container.querySelector('.testimonials-title');
    this.testimonialsSubtitle = this.container.querySelector('.testimonials-subtitle');
    this.testimonialCards = this.container.querySelectorAll('.testimonial-card');
    this.navButtons = this.container.querySelectorAll('.nav-btn');
    this.dots = this.container.querySelectorAll('.dot');
    
    this.prevBtn = this.container.querySelector('.prev-btn');
    this.nextBtn = this.container.querySelector('.next-btn');
  }

  initAnimations() {
    // Set initial states
    gsap.set([this.statsTitle, this.statsSubtitle], { y: 50, opacity: 0 });
    gsap.set(this.statCards, { y: 80, opacity: 0, scale: 0.9 });
    gsap.set([this.testimonialsTitle, this.testimonialsSubtitle], { y: 30, opacity: 0 });
    gsap.set([...this.navButtons, ...this.dots], { opacity: 0, scale: 0.8 });
    
    // Set first testimonial as active
    gsap.set(this.testimonialCards[0], { opacity: 1, scale: 1 });
    this.dots[0].classList.add('active');
  }

  initScrollTrigger() {
    // Statistics section animation
    ScrollTrigger.create({
      trigger: this.statsTitle,
      start: "top 80%",
      onEnter: () => {
        gsap.timeline()
          .to([this.statsTitle, this.statsSubtitle], {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
          })
          .to(this.statCards, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)"
          }, "-=0.4")
          .call(() => this.animateCounters());
      }
    });

    // Testimonials section animation
    ScrollTrigger.create({
      trigger: this.testimonialsTitle,
      start: "top 80%",
      onEnter: () => {
        gsap.timeline()
          .to([this.testimonialsTitle, this.testimonialsSubtitle], {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
          })
          .to([...this.navButtons, ...this.dots], {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(1.7)"
          }, "-=0.2");
      }
    });
  }

  animateCounters() {
    this.statNumbers.forEach(counter => {
      const endValue = parseInt(counter.dataset.counter);
      const obj = { value: 0 };
      
      gsap.to(obj, {
        value: endValue,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          counter.textContent = Math.round(obj.value).toLocaleString();
        }
      });
    });
  }

  initTestimonialCarousel() {
    // Navigation button handlers
    this.prevBtn.addEventListener('click', () => this.previousTestimonial());
    this.nextBtn.addEventListener('click', () => this.nextTestimonial());
    
    // Dot navigation handlers
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToTestimonial(index));
    });
    
    // Auto-play carousel
    this.startAutoPlay();
    
    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  nextTestimonial() {
    const nextIndex = (this.currentTestimonial + 1) % this.testimonialCards.length;
    this.goToTestimonial(nextIndex);
  }

  previousTestimonial() {
    const prevIndex = (this.currentTestimonial - 1 + this.testimonialCards.length) % this.testimonialCards.length;
    this.goToTestimonial(prevIndex);
  }

  goToTestimonial(index) {
    if (index === this.currentTestimonial) return;
    
    const currentCard = this.testimonialCards[this.currentTestimonial];
    const nextCard = this.testimonialCards[index];
    
    // Animate out current testimonial
    gsap.to(currentCard, {
      opacity: 0,
      x: index > this.currentTestimonial ? -50 : 50,
      duration: 0.4,
      ease: "power2.inOut"
    });
    
    // Animate in next testimonial
    gsap.fromTo(nextCard, 
      { 
        opacity: 0, 
        x: index > this.currentTestimonial ? 50 : -50 
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        delay: 0.2,
        ease: "power2.out"
      }
    );
    
    // Update dots
    this.dots[this.currentTestimonial].classList.remove('active');
    this.dots[index].classList.add('active');
    
    // Update dot colors based on testimonial
    const colors = ['bg-primary-blue', 'bg-primary-green', 'bg-primary-orange'];
    this.dots.forEach(dot => {
      dot.classList.remove('bg-primary-blue', 'bg-primary-green', 'bg-primary-orange');
    });
    this.dots[index].classList.add(colors[index]);
    
    this.currentTestimonial = index;
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
      this.testimonialInterval = null;
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
    this.stopAutoPlay();
    this.timeline.kill();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}