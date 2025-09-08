<?php
// Start the session to store user data and the generated plan.
session_start();

// Check if this is an AJAX request
$isAjaxRequest = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
                 strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';

// Set JSON header for AJAX requests
if ($isAjaxRequest) {
    header('Content-Type: application/json');
}

// --- ENHANCED DATABASE SIMULATION ---
// In a real application, this data would be fetched from a database.
function get_all_exercises() {
    return [
        // Chest
        ['name' => 'Push-ups', 'muscle_group' => 'Chest', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 8],
        ['name' => 'Incline Push-ups', 'muscle_group' => 'Chest', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 6],
        ['name' => 'Diamond Push-ups', 'muscle_group' => 'Chest', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate', 'duration' => 30, 'calories_per_minute' => 10],
        ['name' => 'Dumbbell Bench Press', 'muscle_group' => 'Chest', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate', 'duration' => 45, 'calories_per_minute' => 9],
        ['name' => 'Dumbbell Flyes', 'muscle_group' => 'Chest', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate', 'duration' => 45, 'calories_per_minute' => 7],
        ['name' => 'Barbell Bench Press', 'muscle_group' => 'Chest', 'equipment' => 'barbell', 'difficulty' => 'advanced', 'duration' => 60, 'calories_per_minute' => 12],
        ['name' => 'Incline Barbell Press', 'muscle_group' => 'Chest', 'equipment' => 'barbell', 'difficulty' => 'advanced', 'duration' => 60, 'calories_per_minute' => 11],

        // Back
        ['name' => 'Supermans', 'muscle_group' => 'Back', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 5],
        ['name' => 'Reverse Snow Angels', 'muscle_group' => 'Back', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 4],
        ['name' => 'Resistance Band Pull-Aparts', 'muscle_group' => 'Back', 'equipment' => 'resistance_bands', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 6],
        ['name' => 'Resistance Band Rows', 'muscle_group' => 'Back', 'equipment' => 'resistance_bands', 'difficulty' => 'intermediate', 'duration' => 45, 'calories_per_minute' => 8],
        ['name' => 'Dumbbell Rows', 'muscle_group' => 'Back', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate', 'duration' => 45, 'calories_per_minute' => 9],
        ['name' => 'Pull-ups', 'muscle_group' => 'Back', 'equipment' => 'bodyweight', 'difficulty' => 'advanced', 'duration' => 45, 'calories_per_minute' => 12],
        ['name' => 'Barbell Rows', 'muscle_group' => 'Back', 'equipment' => 'barbell', 'difficulty' => 'intermediate', 'duration' => 60, 'calories_per_minute' => 10],
        ['name' => 'Deadlifts', 'muscle_group' => 'Back', 'equipment' => 'barbell', 'difficulty' => 'advanced', 'duration' => 60, 'calories_per_minute' => 15],

        // Legs
        ['name' => 'Bodyweight Squats', 'muscle_group' => 'Legs', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 8],
        ['name' => 'Lunges', 'muscle_group' => 'Legs', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 9],
        ['name' => 'Wall Sits', 'muscle_group' => 'Legs', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 6],
        ['name' => 'Glute Bridges', 'muscle_group' => 'Legs', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 5],
        ['name' => 'Single-Leg Glute Bridges', 'muscle_group' => 'Legs', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate', 'duration' => 30, 'calories_per_minute' => 7],
        ['name' => 'Jump Squats', 'muscle_group' => 'Legs', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate', 'duration' => 30, 'calories_per_minute' => 12],
        ['name' => 'Dumbbell Goblet Squats', 'muscle_group' => 'Legs', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate', 'duration' => 45, 'calories_per_minute' => 10],
        ['name' => 'Dumbbell Lunges', 'muscle_group' => 'Legs', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate', 'duration' => 45, 'calories_per_minute' => 11],
        ['name' => 'Kettlebell Swings', 'muscle_group' => 'Legs', 'equipment' => 'kettlebells', 'difficulty' => 'intermediate', 'duration' => 45, 'calories_per_minute' => 14],
        ['name' => 'Barbell Squats', 'muscle_group' => 'Legs', 'equipment' => 'barbell', 'difficulty' => 'advanced', 'duration' => 60, 'calories_per_minute' => 13],
        ['name' => 'Bulgarian Split Squats', 'muscle_group' => 'Legs', 'equipment' => 'dumbbells', 'difficulty' => 'advanced', 'duration' => 45, 'calories_per_minute' => 12],

        // Shoulders
        ['name' => 'Arm Circles', 'muscle_group' => 'Shoulders', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 4],
        ['name' => 'Pike Push-ups', 'muscle_group' => 'Shoulders', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate', 'duration' => 30, 'calories_per_minute' => 8],
        ['name' => 'Handstand Push-ups', 'muscle_group' => 'Shoulders', 'equipment' => 'bodyweight', 'difficulty' => 'advanced', 'duration' => 30, 'calories_per_minute' => 12],
        ['name' => 'Resistance Band Shoulder Press', 'muscle_group' => 'Shoulders', 'equipment' => 'resistance_bands', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 6],
        ['name' => 'Lateral Raises', 'muscle_group' => 'Shoulders', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate', 'duration' => 45, 'calories_per_minute' => 7],
        ['name' => 'Dumbbell Overhead Press', 'muscle_group' => 'Shoulders', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate', 'duration' => 45, 'calories_per_minute' => 9],
        ['name' => 'Barbell Overhead Press', 'muscle_group' => 'Shoulders', 'equipment' => 'barbell', 'difficulty' => 'advanced', 'duration' => 60, 'calories_per_minute' => 11],

        // Biceps
        ['name' => 'Resistance Band Curls', 'muscle_group' => 'Biceps', 'equipment' => 'resistance_bands', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 5],
        ['name' => 'Hammer Curls', 'muscle_group' => 'Biceps', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate', 'duration' => 45, 'calories_per_minute' => 6],
        ['name' => 'Dumbbell Curls', 'muscle_group' => 'Biceps', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate', 'duration' => 45, 'calories_per_minute' => 6],
        ['name' => 'Barbell Curls', 'muscle_group' => 'Biceps', 'equipment' => 'barbell', 'difficulty' => 'advanced', 'duration' => 60, 'calories_per_minute' => 8],
        ['name' => 'Chin-ups', 'muscle_group' => 'Biceps', 'equipment' => 'bodyweight', 'difficulty' => 'advanced', 'duration' => 45, 'calories_per_minute' => 10],

        // Triceps
        ['name' => 'Tricep Dips (Chair)', 'muscle_group' => 'Triceps', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 7],
        ['name' => 'Tricep Dips (Parallel Bars)', 'muscle_group' => 'Triceps', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate', 'duration' => 30, 'calories_per_minute' => 9],
        ['name' => 'Resistance Band Pushdowns', 'muscle_group' => 'Triceps', 'equipment' => 'resistance_bands', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 5],
        ['name' => 'Dumbbell Tricep Extension', 'muscle_group' => 'Triceps', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate', 'duration' => 45, 'calories_per_minute' => 6],
        ['name' => 'Close-Grip Push-ups', 'muscle_group' => 'Triceps', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate', 'duration' => 30, 'calories_per_minute' => 8],

        // Core
        ['name' => 'Plank', 'muscle_group' => 'Core', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 5],
        ['name' => 'Crunches', 'muscle_group' => 'Core', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 4],
        ['name' => 'Bicycle Crunches', 'muscle_group' => 'Core', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 6],
        ['name' => 'Leg Raises', 'muscle_group' => 'Core', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate', 'duration' => 30, 'calories_per_minute' => 7],
        ['name' => 'Russian Twists', 'muscle_group' => 'Core', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate', 'duration' => 30, 'calories_per_minute' => 6],
        ['name' => 'Mountain Climbers', 'muscle_group' => 'Core', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate', 'duration' => 30, 'calories_per_minute' => 10],
        ['name' => 'Dead Bug', 'muscle_group' => 'Core', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate', 'duration' => 30, 'calories_per_minute' => 5],
        ['name' => 'Hanging Leg Raises', 'muscle_group' => 'Core', 'equipment' => 'bodyweight', 'difficulty' => 'advanced', 'duration' => 30, 'calories_per_minute' => 9],

        // Cardio
        ['name' => 'Jumping Jacks', 'muscle_group' => 'Cardio', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 10],
        ['name' => 'High Knees', 'muscle_group' => 'Cardio', 'equipment' => 'bodyweight', 'difficulty' => 'beginner', 'duration' => 30, 'calories_per_minute' => 12],
        ['name' => 'Burpees', 'muscle_group' => 'Cardio', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate', 'duration' => 30, 'calories_per_minute' => 15],
        ['name' => 'Jump Rope', 'muscle_group' => 'Cardio', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate', 'duration' => 30, 'calories_per_minute' => 13],
    ];
}

// --- FORM PROCESSING ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Handle AJAX requests
        if ($isAjaxRequest) {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                throw new Exception('Invalid JSON input');
            }
            
            // Process AJAX form submission
            $user_preferences = sanitizeUserPreferences($input);
        } else {
            // Handle traditional form submission
            $user_preferences = [
                'name' => htmlspecialchars($_POST['name']),
                'goal' => $_POST['goal'],
                'fitness_level' => $_POST['fitness_level'],
                'days_per_week' => (int)$_POST['days_per_week'],
                'equipment' => isset($_POST['equipment']) ? $_POST['equipment'] : ['bodyweight'],
            ];
        }
        
        // Validate user preferences
        $validation = validateUserPreferences($user_preferences);
        if (!$validation['valid']) {
            if ($isAjaxRequest) {
                http_response_code(422);
                echo json_encode([
                    'success' => false,
                    'error' => [
                        'code' => 'VALIDATION_FAILED',
                        'message' => 'Validation failed',
                        'details' => $validation['errors']
                    ]
                ]);
                exit();
            } else {
                // For traditional forms, redirect back with error
                $_SESSION['form_errors'] = $validation['errors'];
                header('Location: index.php?error=validation');
                exit();
            }
        }
        
        $_SESSION['user_preferences'] = $user_preferences;

        // --- WORKOUT GENERATION LOGIC ---
        $workoutResult = generateEnhancedWorkout($user_preferences);
        
        // Store the final plan and intensity in the session
        $_SESSION['workout_plan'] = $workoutResult['plan'];
        $_SESSION['intensity'] = $workoutResult['intensity'];

        if ($isAjaxRequest) {
            // Return JSON response for AJAX
            echo json_encode([
                'success' => true,
                'data' => [
                    'workout_plan' => $workoutResult['plan'],
                    'intensity' => $workoutResult['intensity'],
                    'user_preferences' => $user_preferences,
                    'redirect_url' => 'workout.php'
                ]
            ]);
            exit();
        } else {
            // Traditional redirect
            header('Location: workout.php');
            exit();
        }
        
    } catch (Exception $e) {
        if ($isAjaxRequest) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => [
                    'code' => 'GENERATION_ERROR',
                    'message' => 'Failed to generate workout: ' . $e->getMessage()
                ]
            ]);
            exit();
        } else {
            $_SESSION['form_errors'] = ['general' => 'An error occurred while generating your workout. Please try again.'];
            header('Location: index.php?error=generation');
            exit();
        }
    }

} else {
    // If accessed directly, redirect back to the form
    header('Location: index.php');
    exit();
}

/**
 * Sanitize user preferences from AJAX input
 */
function sanitizeUserPreferences($input) {
    return [
        'name' => htmlspecialchars($input['name'] ?? ''),
        'goal' => $input['goal'] ?? 'general_fitness',
        'fitness_level' => $input['fitness_level'] ?? 'beginner',
        'days_per_week' => (int)($input['days_per_week'] ?? 3),
        'equipment' => $input['equipment'] ?? ['bodyweight'],
        'age' => (int)($input['age'] ?? 0),
        'gender' => $input['gender'] ?? '',
        'target_areas' => $input['target_areas'] ?? [],
        'workout_duration' => (int)($input['workout_duration'] ?? 45),
        'intensity' => (int)($input['intensity'] ?? 5),
        'time_of_day' => $input['time_of_day'] ?? 'morning',
        'previous_injuries' => $input['previous_injuries'] ?? []
    ];
}

/**
 * Validate user preferences
 */
function validateUserPreferences($preferences) {
    $errors = [];
    
    if (empty($preferences['name']) || strlen(trim($preferences['name'])) < 2) {
        $errors['name'] = 'Name must be at least 2 characters long';
    }
    
    if (!in_array($preferences['goal'], ['muscle_gain', 'weight_loss', 'general_fitness', 'strength', 'endurance'])) {
        $errors['goal'] = 'Invalid fitness goal selected';
    }
    
    if (!in_array($preferences['fitness_level'], ['beginner', 'intermediate', 'advanced'])) {
        $errors['fitness_level'] = 'Invalid fitness level selected';
    }
    
    if ($preferences['days_per_week'] < 1 || $preferences['days_per_week'] > 7) {
        $errors['days_per_week'] = 'Days per week must be between 1 and 7';
    }
    
    if (empty($preferences['equipment']) || !is_array($preferences['equipment'])) {
        $errors['equipment'] = 'At least one equipment option must be selected';
    }
    
    return [
        'valid' => empty($errors),
        'errors' => $errors
    ];
}

/**
 * Generate enhanced workout with improved logic
 */
function generateEnhancedWorkout($user_preferences) {
    $all_exercises = get_all_exercises();
    $available_exercises = array_filter($all_exercises, function ($exercise) use ($user_preferences) {
        return in_array($exercise['equipment'], $user_preferences['equipment']);
    });

    // Enhanced sets and reps based on goals and experience
    $sets_reps = [
        'muscle_gain' => ['sets' => 4, 'reps' => '8-12'],
        'weight_loss' => ['sets' => 3, 'reps' => '15-20'],
        'general_fitness' => ['sets' => 3, 'reps' => '10-15'],
        'strength' => ['sets' => 5, 'reps' => '3-6'],
        'endurance' => ['sets' => 2, 'reps' => '20-30'],
    ];
    
    $intensity = $sets_reps[$user_preferences['goal']] ?? $sets_reps['general_fitness'];
    
    // Adjust based on fitness level
    if ($user_preferences['fitness_level'] === 'beginner') {
        $intensity['sets'] = max(1, $intensity['sets'] - 1);
    } elseif ($user_preferences['fitness_level'] === 'advanced') {
        $intensity['sets'] += 1;
    }

    // Generate workout split based on days per week
    $workout_plan = [];
    $days_per_week = $user_preferences['days_per_week'];
    
    switch ($days_per_week) {
        case 1:
        case 2:
        case 3: // Full Body
            $muscle_groups_per_day = [
                ['Chest', 'Back', 'Legs', 'Core'], 
                ['Shoulders', 'Biceps', 'Triceps', 'Legs'], 
                ['Chest', 'Back', 'Shoulders', 'Core']
            ];
            for ($i = 0; $i < $days_per_week; $i++) {
                $day_title = "Full Body Workout " . ($i + 1);
                $workout_plan[$day_title] = select_exercises($available_exercises, $muscle_groups_per_day[$i], 5);
            }
            break;
            
        case 4: // Upper/Lower Split
            $days = ["Upper Body 1", "Lower Body 1", "Upper Body 2", "Lower Body 2"];
            $muscle_groups_split = [
                ['Chest', 'Back', 'Shoulders', 'Biceps'], 
                ['Legs', 'Core'], 
                ['Chest', 'Back', 'Shoulders', 'Triceps'], 
                ['Legs', 'Core']
            ];
            for ($i = 0; $i < 4; $i++) {
                $workout_plan[$days[$i]] = select_exercises($available_exercises, $muscle_groups_split[$i], 5);
            }
            break;
            
        case 5:
        case 6:
        case 7: // Push/Pull/Legs Split
            $days = [
                "Push Day (Chest, Shoulders, Triceps)", 
                "Pull Day (Back, Biceps)", 
                "Leg Day", 
                "Push Day 2", 
                "Pull Day 2",
                "Legs & Core",
                "Active Recovery"
            ];
            $muscle_groups_split = [
                ['Chest', 'Shoulders', 'Triceps'], 
                ['Back', 'Biceps'], 
                ['Legs', 'Core'], 
                ['Chest', 'Shoulders', 'Triceps'], 
                ['Back', 'Biceps'],
                ['Legs', 'Core'],
                ['Core'] // Light core work for active recovery
            ];
            for ($i = 0; $i < $days_per_week; $i++) {
                $workout_plan[$days[$i]] = select_exercises($available_exercises, $muscle_groups_split[$i], $i == 6 ? 3 : 5);
            }
            break;
    }

    // Calculate achievements and gamification data
    $achievements = calculateAchievements($user_preferences, $workout_plan);
    $progressTracking = initializeProgressTracking($user_preferences);
    
    return [
        'plan' => $workout_plan,
        'intensity' => $intensity,
        'achievements' => $achievements,
        'progress_tracking' => $progressTracking,
        'estimated_calories' => calculateEstimatedCalories($workout_plan, $intensity),
        'difficulty_progression' => calculateDifficultyProgression($user_preferences)
    ];
}

/**
 * Calculate achievements based on user preferences and workout plan
 */
function calculateAchievements($user_preferences, $workout_plan) {
    $achievements = [];
    
    // Basic achievements
    $achievements[] = [
        'id' => 'first_workout',
        'title' => 'First Workout Generated!',
        'description' => 'You\'re on your way to success.',
        'icon' => '🏆',
        'points' => 10,
        'unlocked' => true,
        'category' => 'milestone'
    ];
    
    // Commitment based achievements
    $days_per_week = $user_preferences['days_per_week'];
    if ($days_per_week >= 5) {
        $achievements[] = [
            'id' => 'dedicated_athlete',
            'title' => 'Dedicated Athlete',
            'description' => 'Committed to ' . $days_per_week . ' days per week. Outstanding dedication!',
            'icon' => '💪',
            'points' => 25,
            'unlocked' => true,
            'category' => 'commitment'
        ];
    } elseif ($days_per_week >= 3) {
        $achievements[] = [
            'id' => 'committed',
            'title' => 'Committed!',
            'description' => 'You chose a ' . $days_per_week . '-day plan. Great dedication!',
            'icon' => '🎯',
            'points' => 15,
            'unlocked' => true,
            'category' => 'commitment'
        ];
    }
    
    // Experience level achievements
    if ($user_preferences['fitness_level'] === 'beginner') {
        $achievements[] = [
            'id' => 'new_beginnings',
            'title' => 'New Beginnings',
            'description' => 'Starting the journey is the hardest part. You did it!',
            'icon' => '🌱',
            'points' => 20,
            'unlocked' => true,
            'category' => 'milestone'
        ];
    } elseif ($user_preferences['fitness_level'] === 'advanced') {
        $achievements[] = [
            'id' => 'fitness_veteran',
            'title' => 'Fitness Veteran',
            'description' => 'Advanced level training - you\'re a true athlete!',
            'icon' => '🥇',
            'points' => 30,
            'unlocked' => true,
            'category' => 'expertise'
        ];
    }
    
    // Goal-specific achievements
    switch ($user_preferences['goal']) {
        case 'muscle_gain':
            $achievements[] = [
                'id' => 'muscle_builder',
                'title' => 'Muscle Builder',
                'description' => 'Ready to build serious muscle mass!',
                'icon' => '💪',
                'points' => 15,
                'unlocked' => true,
                'category' => 'goal'
            ];
            break;
        case 'weight_loss':
            $achievements[] = [
                'id' => 'fat_burner',
                'title' => 'Fat Burner',
                'description' => 'Focused on burning fat and losing weight!',
                'icon' => '🔥',
                'points' => 15,
                'unlocked' => true,
                'category' => 'goal'
            ];
            break;
        case 'strength':
            $achievements[] = [
                'id' => 'strength_seeker',
                'title' => 'Strength Seeker',
                'description' => 'Building raw power and strength!',
                'icon' => '⚡',
                'points' => 15,
                'unlocked' => true,
                'category' => 'goal'
            ];
            break;
    }
    
    // Equipment diversity achievement
    $equipment_count = count($user_preferences['equipment']);
    if ($equipment_count >= 4) {
        $achievements[] = [
            'id' => 'equipment_master',
            'title' => 'Equipment Master',
            'description' => 'Using ' . $equipment_count . ' different equipment types. Versatile!',
            'icon' => '🛠️',
            'points' => 20,
            'unlocked' => true,
            'category' => 'versatility'
        ];
    }
    
    // Future achievements (locked)
    $achievements[] = [
        'id' => 'week_warrior',
        'title' => 'Week Warrior',
        'description' => 'Complete 7 consecutive days of workouts',
        'icon' => '🗓️',
        'points' => 50,
        'unlocked' => false,
        'category' => 'streak'
    ];
    
    $achievements[] = [
        'id' => 'consistency_king',
        'title' => 'Consistency King',
        'description' => 'Complete 30 workouts',
        'icon' => '👑',
        'points' => 100,
        'unlocked' => false,
        'category' => 'milestone'
    ];
    
    return $achievements;
}

/**
 * Initialize progress tracking data
 */
function initializeProgressTracking($user_preferences) {
    return [
        'total_workouts_completed' => 0,
        'current_streak' => 0,
        'longest_streak' => 0,
        'total_exercises_completed' => 0,
        'total_calories_burned' => 0,
        'total_workout_time' => 0,
        'level' => 1,
        'experience_points' => 0,
        'next_level_points' => 100,
        'weekly_goal' => $user_preferences['days_per_week'],
        'weekly_progress' => 0,
        'favorite_muscle_groups' => [],
        'personal_records' => [],
        'workout_history' => []
    ];
}

/**
 * Calculate estimated calories burned for the workout plan
 */
function calculateEstimatedCalories($workout_plan, $intensity) {
    $all_exercises = get_all_exercises();
    $total_calories = 0;
    
    foreach ($workout_plan as $day => $exercises) {
        $day_calories = 0;
        foreach ($exercises as $exercise_name) {
            // Find exercise data
            $exercise_data = null;
            foreach ($all_exercises as $exercise) {
                if ($exercise['name'] === $exercise_name) {
                    $exercise_data = $exercise;
                    break;
                }
            }
            
            if ($exercise_data) {
                // Calculate calories based on sets, duration, and calories per minute
                $exercise_duration = ($exercise_data['duration'] / 60) * $intensity['sets'];
                $exercise_calories = $exercise_duration * $exercise_data['calories_per_minute'];
                $day_calories += $exercise_calories;
            }
        }
        $total_calories += $day_calories;
    }
    
    return [
        'total_per_week' => round($total_calories),
        'average_per_workout' => round($total_calories / count($workout_plan)),
        'breakdown_by_day' => [] // Could be populated with per-day calculations
    ];
}

/**
 * Calculate difficulty progression plan
 */
function calculateDifficultyProgression($user_preferences) {
    $fitness_level = $user_preferences['fitness_level'];
    $goal = $user_preferences['goal'];
    
    $progression = [
        'current_level' => $fitness_level,
        'weeks_to_next_level' => 0,
        'progression_plan' => []
    ];
    
    switch ($fitness_level) {
        case 'beginner':
            $progression['weeks_to_next_level'] = 4;
            $progression['progression_plan'] = [
                'week_1_2' => 'Focus on form and consistency',
                'week_3_4' => 'Increase repetitions by 2-3 per exercise',
                'week_5_6' => 'Add 1 additional set to each exercise',
                'week_7_8' => 'Ready for intermediate level exercises'
            ];
            break;
            
        case 'intermediate':
            $progression['weeks_to_next_level'] = 6;
            $progression['progression_plan'] = [
                'week_1_3' => 'Master current exercise variations',
                'week_4_6' => 'Increase weight/resistance by 10-15%',
                'week_7_9' => 'Add advanced exercise variations',
                'week_10_12' => 'Ready for advanced level training'
            ];
            break;
            
        case 'advanced':
            $progression['weeks_to_next_level'] = 0; // Already at max level
            $progression['progression_plan'] = [
                'ongoing' => 'Focus on periodization and specialized training phases',
                'monthly' => 'Vary intensity and volume for continued progress',
                'quarterly' => 'Reassess goals and adjust training methodology'
            ];
            break;
    }
    
    return $progression;
}


/**
 * Helper function to select exercises for a given day.
 *
 * @param array $exercise_pool The list of all available exercises.
 * @param array $target_groups The muscle groups to target for the day.
 * @param int $num_exercises The number of exercises to select.
 * @return array The list of selected exercises.
 */
function select_exercises($exercise_pool, $target_groups, $num_exercises) {
    $selected = [];
    // Filter exercises that match the target muscle groups
    $filtered_pool = array_filter($exercise_pool, function ($exercise) use ($target_groups) {
        return in_array($exercise['muscle_group'], $target_groups);
    });

    // Ensure we don't try to pick more exercises than are available
    $num_to_pick = min($num_exercises, count($filtered_pool));

    if ($num_to_pick > 0) {
        // Get random keys from the filtered pool
        $random_keys = array_rand($filtered_pool, $num_to_pick);
        if (is_array($random_keys)) {
            foreach ($random_keys as $key) {
                $selected[] = $filtered_pool[$key]['name'];
            }
        } else {
             $selected[] = $filtered_pool[$random_keys]['name'];
        }
    }
    
    // Add a core exercise if none was selected
    if (!in_array('Core', $target_groups) && count($selected) < $num_exercises) {
        $core_exercises = array_filter($exercise_pool, function($ex) { return $ex['muscle_group'] === 'Core'; });
        if(count($core_exercises) > 0) {
            $selected[] = $core_exercises[array_rand($core_exercises)]['name'];
        }
    }

    return $selected;
}

?>
