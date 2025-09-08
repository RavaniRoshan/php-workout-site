<?php
// Start a session to store data across pages
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transform Your Fitness - Personalized Workout Generator</title>
    <link rel="stylesheet" href="assets/css/tailwind.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js"></script>
</head>
<body class="bg-background-main text-text-primary font-inter">
    <!-- Hero Section -->
    <section id="hero-section" class="hero-wrapper">
        <!-- Hero content will be dynamically inserted here -->
    </section>

    <!-- Workout Preview Cards Section -->
    <section id="preview-cards-section" class="preview-cards-wrapper">
        <!-- Preview cards content will be dynamically inserted here -->
    </section>

    <!-- Statistics and Testimonials Section -->
    <section id="stats-testimonials-section" class="stats-testimonials-wrapper">
        <!-- Stats and testimonials content will be dynamically inserted here -->
    </section>

    <!-- Form Section -->
    <section class="form-section relative py-20 px-6">
        <div class="container max-w-4xl mx-auto">
            <div class="form-header text-center mb-12">
                <h2 class="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                    Let's Create Your 
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-primary-green">Perfect Plan</span>
                </h2>
                <p class="text-xl text-text-secondary max-w-2xl mx-auto">
                    Fill in your details below to create a custom workout plan tailored just for you.
                </p>
            </div>

            <form action="generator.php" method="POST" class="workout-form glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-lg bg-background-card/80">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group">
                        <label for="name" class="block text-text-primary font-medium mb-3 text-lg">Your Name</label>
                        <input type="text" id="name" name="name" placeholder="e.g., Alex Smith" required 
                               class="w-full px-4 py-3 bg-background-main/50 border border-white/20 rounded-xl text-text-primary placeholder-text-muted focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300">
                    </div>

                    <div class="form-group">
                        <label for="goal" class="block text-text-primary font-medium mb-3 text-lg">Primary Fitness Goal</label>
                        <select id="goal" name="goal" required 
                                class="w-full px-4 py-3 bg-background-main/50 border border-white/20 rounded-xl text-text-primary focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300">
                            <option value="muscle_gain">Muscle Gain</option>
                            <option value="weight_loss">Fat Loss / Weight Loss</option>
                            <option value="general_fitness">General Fitness</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="fitness_level" class="block text-text-primary font-medium mb-3 text-lg">Current Fitness Level</label>
                        <select id="fitness_level" name="fitness_level" required 
                                class="w-full px-4 py-3 bg-background-main/50 border border-white/20 rounded-xl text-text-primary focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="days_per_week" class="block text-text-primary font-medium mb-3 text-lg">How many days can you work out per week?</label>
                        <select id="days_per_week" name="days_per_week" required 
                                class="w-full px-4 py-3 bg-background-main/50 border border-white/20 rounded-xl text-text-primary focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300">
                            <option value="2">2 Days</option>
                            <option value="3">3 Days</option>
                            <option value="4">4 Days</option>
                            <option value="5">5 Days</option>
                        </select>
                    </div>
                </div>

                <fieldset class="form-group mt-8">
                    <legend class="block text-text-primary font-medium mb-6 text-lg">Available Equipment</legend>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div class="equipment-option">
                            <input type="checkbox" id="bodyweight" name="equipment[]" value="bodyweight" checked 
                                   class="sr-only peer">
                            <label for="bodyweight" class="flex items-center justify-center p-4 bg-background-main/30 border border-white/20 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary-blue/50 peer-checked:border-primary-blue peer-checked:bg-primary-blue/10 peer-checked:shadow-lg peer-checked:shadow-primary-blue/25">
                                <span class="text-2xl mr-3">💪</span>
                                <span class="text-text-primary font-medium">Bodyweight</span>
                            </label>
                        </div>
                        <div class="equipment-option">
                            <input type="checkbox" id="dumbbells" name="equipment[]" value="dumbbells" 
                                   class="sr-only peer">
                            <label for="dumbbells" class="flex items-center justify-center p-4 bg-background-main/30 border border-white/20 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary-green/50 peer-checked:border-primary-green peer-checked:bg-primary-green/10 peer-checked:shadow-lg peer-checked:shadow-primary-green/25">
                                <span class="text-2xl mr-3">🏋️</span>
                                <span class="text-text-primary font-medium">Dumbbells</span>
                            </label>
                        </div>
                        <div class="equipment-option">
                            <input type="checkbox" id="barbell" name="equipment[]" value="barbell" 
                                   class="sr-only peer">
                            <label for="barbell" class="flex items-center justify-center p-4 bg-background-main/30 border border-white/20 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary-orange/50 peer-checked:border-primary-orange peer-checked:bg-primary-orange/10 peer-checked:shadow-lg peer-checked:shadow-primary-orange/25">
                                <span class="text-2xl mr-3">🏋️‍♂️</span>
                                <span class="text-text-primary font-medium">Barbell</span>
                            </label>
                        </div>
                        <div class="equipment-option">
                            <input type="checkbox" id="resistance_bands" name="equipment[]" value="resistance_bands" 
                                   class="sr-only peer">
                            <label for="resistance_bands" class="flex items-center justify-center p-4 bg-background-main/30 border border-white/20 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary-blue/50 peer-checked:border-primary-blue peer-checked:bg-primary-blue/10 peer-checked:shadow-lg peer-checked:shadow-primary-blue/25">
                                <span class="text-2xl mr-3">🎯</span>
                                <span class="text-text-primary font-medium">Resistance Bands</span>
                            </label>
                        </div>
                        <div class="equipment-option">
                            <input type="checkbox" id="kettlebells" name="equipment[]" value="kettlebells" 
                                   class="sr-only peer">
                            <label for="kettlebells" class="flex items-center justify-center p-4 bg-background-main/30 border border-white/20 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary-green/50 peer-checked:border-primary-green peer-checked:bg-primary-green/10 peer-checked:shadow-lg peer-checked:shadow-primary-green/25">
                                <span class="text-2xl mr-3">⚖️</span>
                                <span class="text-text-primary font-medium">Kettlebells</span>
                            </label>
                        </div>
                    </div>
                </fieldset>

                <div class="form-submit mt-10 text-center">
                    <button type="submit" class="submit-btn inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-green text-text-primary font-bold text-lg rounded-2xl shadow-lg shadow-primary-blue/25 hover:shadow-xl hover:shadow-primary-blue/40 transform hover:scale-105 transition-all duration-300">
                        <span class="mr-3">🚀</span>
                        Generate My Workout!
                    </button>
                </div>
            </form>
        </div>
    </section>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>
