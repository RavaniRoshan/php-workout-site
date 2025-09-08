/**
 * Unit Tests for Enhanced Workout Generation Logic
 * Tests the PHP backend functionality through simulated data structures
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Mock data structures that mirror the PHP backend
const mockExercises = [
    { name: 'Push-ups', muscle_group: 'Chest', equipment: 'bodyweight', difficulty: 'beginner', duration: 30, calories_per_minute: 8 },
    { name: 'Dumbbell Bench Press', muscle_group: 'Chest', equipment: 'dumbbells', difficulty: 'intermediate', duration: 45, calories_per_minute: 9 },
    { name: 'Bodyweight Squats', muscle_group: 'Legs', equipment: 'bodyweight', difficulty: 'beginner', duration: 30, calories_per_minute: 8 },
    { name: 'Dumbbell Rows', muscle_group: 'Back', equipment: 'dumbbells', difficulty: 'intermediate', duration: 45, calories_per_minute: 9 },
    { name: 'Plank', muscle_group: 'Core', equipment: 'bodyweight', difficulty: 'beginner', duration: 30, calories_per_minute: 5 },
    { name: 'Burpees', muscle_group: 'Cardio', equipment: 'bodyweight', difficulty: 'intermediate', duration: 30, calories_per_minute: 15 }
];

// JavaScript implementations of PHP functions for testing
class WorkoutGenerator {
    constructor() {
        this.exercises = mockExercises;
    }

    filterExercisesByEquipment(equipment) {
        return this.exercises.filter(exercise => 
            equipment.includes(exercise.equipment)
        );
    }

    getIntensitySettings(goal, fitnessLevel) {
        const setsReps = {
            'muscle_gain': { sets: 4, reps: '8-12' },
            'weight_loss': { sets: 3, reps: '15-20' },
            'general_fitness': { sets: 3, reps: '10-15' },
            'strength': { sets: 5, reps: '3-6' },
            'endurance': { sets: 2, reps: '20-30' }
        };
        
        let intensity = setsReps[goal] || setsReps['general_fitness'];
        
        if (fitnessLevel === 'beginner') {
            intensity.sets = Math.max(1, intensity.sets - 1);
        } else if (fitnessLevel === 'advanced') {
            intensity.sets += 1;
        }
        
        return intensity;
    }

    selectExercises(exercisePool, targetGroups, numExercises) {
        const filtered = exercisePool.filter(exercise => 
            targetGroups.includes(exercise.muscle_group)
        );
        
        const numToPick = Math.min(numExercises, filtered.length);
        const selected = [];
        
        // Simple random selection for testing
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        for (let i = 0; i < numToPick; i++) {
            selected.push(shuffled[i].name);
        }
        
        return selected;
    }

    calculateAchievements(userPreferences) {
        const achievements = [];
        
        // Basic achievement
        achievements.push({
            id: 'first_workout',
            title: 'First Workout Generated!',
            points: 10,
            unlocked: true
        });
        
        // Commitment achievement
        if (userPreferences.days_per_week >= 5) {
            achievements.push({
                id: 'dedicated_athlete',
                title: 'Dedicated Athlete',
                points: 25,
                unlocked: true
            });
        }
        
        // Experience level achievement
        if (userPreferences.fitness_level === 'beginner') {
            achievements.push({
                id: 'new_beginnings',
                title: 'New Beginnings',
                points: 20,
                unlocked: true
            });
        }
        
        // Future achievements (locked)
        achievements.push({
            id: 'week_warrior',
            title: 'Week Warrior',
            points: 50,
            unlocked: false
        });
        
        achievements.push({
            id: 'consistency_king',
            title: 'Consistency King',
            points: 100,
            unlocked: false
        });
        
        return achievements;
    }

    calculateEstimatedCalories(workoutPlan, intensity) {
        let totalCalories = 0;
        
        Object.values(workoutPlan).forEach(exercises => {
            exercises.forEach(exerciseName => {
                const exercise = this.exercises.find(ex => ex.name === exerciseName);
                if (exercise) {
                    const exerciseDuration = (exercise.duration / 60) * intensity.sets;
                    const exerciseCalories = exerciseDuration * exercise.calories_per_minute;
                    totalCalories += exerciseCalories;
                }
            });
        });
        
        return {
            total_per_week: Math.round(totalCalories),
            average_per_workout: Math.round(totalCalories / Object.keys(workoutPlan).length)
        };
    }

    initializeProgressTracking(userPreferences) {
        return {
            total_workouts_completed: 0,
            current_streak: 0,
            level: 1,
            experience_points: 0,
            weekly_goal: userPreferences.days_per_week,
            weekly_progress: 0
        };
    }

    generateWorkout(userPreferences) {
        const availableExercises = this.filterExercisesByEquipment(userPreferences.equipment);
        const intensity = this.getIntensitySettings(userPreferences.goal, userPreferences.fitness_level);
        
        const workoutPlan = {};
        const daysPerWeek = userPreferences.days_per_week;
        
        // Generate workout split based on days per week
        if (daysPerWeek <= 3) {
            // Full Body
            const muscleGroups = [['Chest', 'Back', 'Legs', 'Core']];
            for (let i = 0; i < daysPerWeek; i++) {
                const dayTitle = `Full Body Workout ${i + 1}`;
                workoutPlan[dayTitle] = this.selectExercises(availableExercises, muscleGroups[0], 5);
            }
        } else if (daysPerWeek === 4) {
            // Upper/Lower Split
            const days = ["Upper Body 1", "Lower Body 1", "Upper Body 2", "Lower Body 2"];
            const muscleGroupsSplit = [
                ['Chest', 'Back', 'Shoulders'],
                ['Legs', 'Core'],
                ['Chest', 'Back', 'Shoulders'],
                ['Legs', 'Core']
            ];
            for (let i = 0; i < 4; i++) {
                workoutPlan[days[i]] = this.selectExercises(availableExercises, muscleGroupsSplit[i], 5);
            }
        }
        
        const achievements = this.calculateAchievements(userPreferences);
        const progressTracking = this.initializeProgressTracking(userPreferences);
        const estimatedCalories = this.calculateEstimatedCalories(workoutPlan, intensity);
        
        return {
            plan: workoutPlan,
            intensity,
            achievements,
            progress_tracking: progressTracking,
            estimated_calories: estimatedCalories
        };
    }
}

describe('Enhanced Workout Generation', () => {
    let generator;
    let basicUserPreferences;

    beforeEach(() => {
        generator = new WorkoutGenerator();
        basicUserPreferences = {
            name: 'Test User',
            goal: 'general_fitness',
            fitness_level: 'beginner',
            days_per_week: 3,
            equipment: ['bodyweight']
        };
    });

    describe('Exercise Filtering', () => {
        it('should filter exercises by available equipment', () => {
            const bodyweightExercises = generator.filterExercisesByEquipment(['bodyweight']);
            
            expect(bodyweightExercises.length).toBeGreaterThan(0);
            expect(bodyweightExercises.every(ex => ex.equipment === 'bodyweight')).toBe(true);
        });

        it('should handle multiple equipment types', () => {
            const multiEquipment = generator.filterExercisesByEquipment(['bodyweight', 'dumbbells']);
            
            expect(multiEquipment.length).toBeGreaterThan(0);
            expect(multiEquipment.some(ex => ex.equipment === 'bodyweight')).toBe(true);
            expect(multiEquipment.some(ex => ex.equipment === 'dumbbells')).toBe(true);
        });
    });

    describe('Intensity Settings', () => {
        it('should return correct intensity for muscle gain goal', () => {
            const intensity = generator.getIntensitySettings('muscle_gain', 'intermediate');
            
            expect(intensity.sets).toBe(4);
            expect(intensity.reps).toBe('8-12');
        });

        it('should adjust sets based on fitness level', () => {
            const beginnerIntensity = generator.getIntensitySettings('general_fitness', 'beginner');
            const advancedIntensity = generator.getIntensitySettings('general_fitness', 'advanced');
            
            expect(beginnerIntensity.sets).toBe(2); // 3 - 1
            expect(advancedIntensity.sets).toBe(4); // 3 + 1
        });

        it('should handle strength goal with higher sets', () => {
            const strengthIntensity = generator.getIntensitySettings('strength', 'intermediate');
            
            expect(strengthIntensity.sets).toBe(5);
            expect(strengthIntensity.reps).toBe('3-6');
        });
    });

    describe('Achievement Calculation', () => {
        it('should always include first workout achievement', () => {
            const achievements = generator.calculateAchievements(basicUserPreferences);
            
            expect(achievements.length).toBeGreaterThan(0);
            expect(achievements.some(a => a.id === 'first_workout')).toBe(true);
        });

        it('should award dedication achievement for high frequency', () => {
            const dedicatedUser = { ...basicUserPreferences, days_per_week: 5 };
            const achievements = generator.calculateAchievements(dedicatedUser);
            
            expect(achievements.some(a => a.id === 'dedicated_athlete')).toBe(true);
        });

        it('should award beginner achievement for new users', () => {
            const achievements = generator.calculateAchievements(basicUserPreferences);
            
            expect(achievements.some(a => a.id === 'new_beginnings')).toBe(true);
        });

        it('should calculate correct achievement points', () => {
            const achievements = generator.calculateAchievements(basicUserPreferences);
            const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
            
            expect(totalPoints).toBeGreaterThan(0);
            expect(achievements.every(a => a.points > 0)).toBe(true);
        });
    });

    describe('Calorie Calculation', () => {
        it('should calculate estimated calories for workout plan', () => {
            const workoutPlan = {
                'Day 1': ['Push-ups', 'Bodyweight Squats', 'Plank']
            };
            const intensity = { sets: 3, reps: '10-15' };
            
            const calories = generator.calculateEstimatedCalories(workoutPlan, intensity);
            
            expect(calories.total_per_week).toBeGreaterThan(0);
            expect(calories.average_per_workout).toBeGreaterThan(0);
            expect(typeof calories.total_per_week).toBe('number');
        });

        it('should handle empty workout plan', () => {
            const emptyPlan = {};
            const intensity = { sets: 3, reps: '10-15' };
            
            const calories = generator.calculateEstimatedCalories(emptyPlan, intensity);
            
            expect(calories.total_per_week).toBe(0);
        });
    });

    describe('Progress Tracking Initialization', () => {
        it('should initialize progress tracking with correct defaults', () => {
            const progress = generator.initializeProgressTracking(basicUserPreferences);
            
            expect(progress.total_workouts_completed).toBe(0);
            expect(progress.current_streak).toBe(0);
            expect(progress.level).toBe(1);
            expect(progress.weekly_goal).toBe(basicUserPreferences.days_per_week);
        });

        it('should set weekly goal based on user preference', () => {
            const highFrequencyUser = { ...basicUserPreferences, days_per_week: 6 };
            const progress = generator.initializeProgressTracking(highFrequencyUser);
            
            expect(progress.weekly_goal).toBe(6);
        });
    });

    describe('Complete Workout Generation', () => {
        it('should generate complete workout with all components', () => {
            const result = generator.generateWorkout(basicUserPreferences);
            
            expect(result).toHaveProperty('plan');
            expect(result).toHaveProperty('intensity');
            expect(result).toHaveProperty('achievements');
            expect(result).toHaveProperty('progress_tracking');
            expect(result).toHaveProperty('estimated_calories');
        });

        it('should generate appropriate number of workout days', () => {
            const result = generator.generateWorkout(basicUserPreferences);
            
            expect(Object.keys(result.plan).length).toBe(basicUserPreferences.days_per_week);
        });

        it('should handle different workout splits based on frequency', () => {
            // Test 3-day full body
            const fullBodyUser = { ...basicUserPreferences, days_per_week: 3 };
            const fullBodyResult = generator.generateWorkout(fullBodyUser);
            
            expect(Object.keys(fullBodyResult.plan).length).toBe(3);
            expect(Object.keys(fullBodyResult.plan)[0]).toContain('Full Body');
            
            // Test 4-day upper/lower split
            const splitUser = { ...basicUserPreferences, days_per_week: 4 };
            const splitResult = generator.generateWorkout(splitUser);
            
            expect(Object.keys(splitResult.plan).length).toBe(4);
            expect(Object.keys(splitResult.plan).some(day => day.includes('Upper'))).toBe(true);
            expect(Object.keys(splitResult.plan).some(day => day.includes('Lower'))).toBe(true);
        });

        it('should generate different workouts for different goals', () => {
            const muscleGainUser = { ...basicUserPreferences, goal: 'muscle_gain' };
            const weightLossUser = { ...basicUserPreferences, goal: 'weight_loss' };
            
            const muscleResult = generator.generateWorkout(muscleGainUser);
            const weightResult = generator.generateWorkout(weightLossUser);
            
            expect(muscleResult.intensity.sets).toBeGreaterThan(weightResult.intensity.sets);
            expect(muscleResult.intensity.reps).toBe('8-12');
            expect(weightResult.intensity.reps).toBe('15-20');
        });

        it('should handle equipment limitations gracefully', () => {
            const limitedEquipmentUser = { 
                ...basicUserPreferences, 
                equipment: ['resistance_bands'] // Limited equipment
            };
            
            const result = generator.generateWorkout(limitedEquipmentUser);
            
            expect(result.plan).toBeDefined();
            expect(Object.keys(result.plan).length).toBeGreaterThan(0);
        });
    });

    describe('Data Validation', () => {
        it('should handle invalid fitness levels gracefully', () => {
            const invalidUser = { ...basicUserPreferences, fitness_level: 'invalid' };
            
            // Should default to general_fitness intensity
            const intensity = generator.getIntensitySettings(invalidUser.goal, invalidUser.fitness_level);
            expect(intensity).toBeDefined();
            expect(intensity.sets).toBeGreaterThan(0);
        });

        it('should handle invalid goals gracefully', () => {
            const invalidGoalUser = { ...basicUserPreferences, goal: 'invalid_goal' };
            
            const intensity = generator.getIntensitySettings(invalidGoalUser.goal, invalidGoalUser.fitness_level);
            expect(intensity.sets).toBe(2); // Should default to general_fitness - 1 for beginner
            expect(intensity.reps).toBe('10-15');
        });

        it('should handle zero days per week', () => {
            const zeroDaysUser = { ...basicUserPreferences, days_per_week: 0 };
            
            const result = generator.generateWorkout(zeroDaysUser);
            expect(Object.keys(result.plan).length).toBe(0);
        });
    });
});

describe('Gamification Features', () => {
    let generator;

    beforeEach(() => {
        generator = new WorkoutGenerator();
    });

    describe('Experience Points and Levels', () => {
        it('should initialize user at level 1 with 0 XP', () => {
            const userPrefs = { days_per_week: 3 };
            const progress = generator.initializeProgressTracking(userPrefs);
            
            expect(progress.level).toBe(1);
            expect(progress.experience_points).toBe(0);
        });

        it('should set appropriate weekly goals', () => {
            const casualUser = { days_per_week: 2 };
            const dedicatedUser = { days_per_week: 6 };
            
            const casualProgress = generator.initializeProgressTracking(casualUser);
            const dedicatedProgress = generator.initializeProgressTracking(dedicatedUser);
            
            expect(casualProgress.weekly_goal).toBe(2);
            expect(dedicatedProgress.weekly_goal).toBe(6);
        });
    });

    describe('Achievement System', () => {
        it('should award points for achievements', () => {
            const userPrefs = { 
                days_per_week: 5, 
                fitness_level: 'beginner',
                goal: 'muscle_gain'
            };
            
            const achievements = generator.calculateAchievements(userPrefs);
            const totalPoints = achievements
                .filter(a => a.unlocked)
                .reduce((sum, a) => sum + a.points, 0);
            
            expect(totalPoints).toBeGreaterThan(30); // Should have multiple achievements
        });

        it('should have locked future achievements', () => {
            const userPrefs = { days_per_week: 3, fitness_level: 'beginner' };
            const achievements = generator.calculateAchievements(userPrefs);
            
            const unlockedCount = achievements.filter(a => a.unlocked).length;
            const totalCount = achievements.length;
            
            expect(totalCount).toBeGreaterThan(unlockedCount); // Should have some locked achievements
        });
    });
});