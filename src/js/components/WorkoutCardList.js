// WorkoutCardList.js
import { WorkoutCard } from './WorkoutCard';

export class WorkoutCardList {
    constructor(containerId, workouts) {
        this.container = document.getElementById(containerId);
        this.workouts = workouts;
        this.cards = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this._createLayout();
        this._renderCards();
        this._setupIntersectionObserver();
    }

    _createLayout() {
        this.container.innerHTML = `
            <div class="workout-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"></div>
            <div class="counter text-center py-4 text-gray-300">Showing <span class="current-count">0</span> of <span class="total-count">${this.workouts.length}</span> workouts</div>
            <div class="load-more-container text-center py-4">
                <button id="load-more-btn" class="load-more-btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center mx-auto">
                    <span class="button-text">Load More Workouts</span>
                    <div class="loading-spinner hidden ml-2">
                        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </button>
            </div>
        `;

        this.grid = this.container.querySelector('.workout-grid');
        this.loadButton = this.container.querySelector('#load-more-btn');
        this.currentCountSpan = this.container.querySelector('.current-count');
        this.totalCountSpan = this.container.querySelector('.total-count');

        this.loadButton.addEventListener('click', () => this._loadMoreWorkouts());
    }

    _renderCards() {
        this.cards = this.workouts.map(workout => new WorkoutCard(workout));
        
        // Initially render first 6 cards
        const initialCount = Math.min(6, this.workouts.length);
        for (let i = 0; i < initialCount; i++) {
            this.grid.appendChild(this.cards[i].getElement());
            this.currentIndex++;
        }

        this._updateCounter();
    }

    _setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.currentIndex < this.workouts.length) {
                    this._animateCard(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Add animation class to cards for observer
        this.cards.forEach((card, index) => {
            if (index < this.currentIndex) {
                card.getElement().classList.add('opacity-0', 'translate-y-8');
                observer.observe(card.getElement());
            }
        });
    }

    _animateCard(element) {
        setTimeout(() => {
            element.classList.remove('opacity-0', 'translate-y-8');
            element.classList.add('opacity-100', 'translate-y-0');
        }, Math.random() * 300);
    }

    _loadMoreWorkouts() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const loadButton = this.loadButton;
        const loadingSpinner = loadButton.querySelector('.loading-spinner');
        const buttonText = loadButton.querySelector('.button-text');
        
        loadingSpinner.classList.remove('hidden');
        buttonText.textContent = 'Loading...';
        
        // Simulate API delay
        setTimeout(() => {
            const nextIndex = this.currentIndex;
            const batchSize = Math.min(6, this.workouts.length - nextIndex);
            
            for (let i = nextIndex; i < nextIndex + batchSize; i++) {
                this.grid.appendChild(this.cards[i].getElement());
                this.currentIndex++;
                this.cards[i].getElement().classList.add('opacity-0', 'translate-y-8');
                observer.observe(this.cards[i].getElement());
            }
            
            this._updateCounter();
            
            if (this.currentIndex >= this.workouts.length) {
                loadButton.style.opacity = '0';
                setTimeout(() => loadButton.style.display = 'none', 300);
            }
            
            loadingSpinner.classList.add('hidden');
            buttonText.textContent = 'Load More Workouts';
            
            this.isLoading = false;
        }, 800);
    }

    _updateCounter() {
        this.currentCountSpan.textContent = this.currentIndex;
    }
}