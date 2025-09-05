<?php
// Start the session to store user data and the generated plan.
session_start();

// --- DATABASE SIMULATION ---
// In a real application, this data would be fetched from a database.
function get_all_exercises() {
    return [
        // Chest
        ['name' => 'Push-ups', 'muscle_group' => 'Chest', 'equipment' => 'bodyweight', 'difficulty' => 'beginner'],
        ['name' => 'Dumbbell Bench Press', 'muscle_group' => 'Chest', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate'],
        ['name' => 'Barbell Bench Press', 'muscle_group' => 'Chest', 'equipment' => 'barbell', 'difficulty' => 'advanced'],
        ['name' => 'Incline Push-ups', 'muscle_group' => 'Chest', 'equipment' => 'bodyweight', 'difficulty' => 'beginner'],
        ['name' => 'Dumbbell Flyes', 'muscle_group' => 'Chest', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate'],

        // Back
        ['name' => 'Pull-ups', 'muscle_group' => 'Back', 'equipment' => 'bodyweight', 'difficulty' => 'advanced'],
        ['name' => 'Dumbbell Rows', 'muscle_group' => 'Back', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate'],
        ['name' => 'Barbell Rows', 'muscle_group' => 'Back', 'equipment' => 'barbell', 'difficulty' => 'intermediate'],
        ['name' => 'Supermans', 'muscle_group' => 'Back', 'equipment' => 'bodyweight', 'difficulty' => 'beginner'],
        ['name' => 'Resistance Band Pull-Aparts', 'muscle_group' => 'Back', 'equipment' => 'resistance_bands', 'difficulty' => 'beginner'],

        // Legs
        ['name' => 'Bodyweight Squats', 'muscle_group' => 'Legs', 'equipment' => 'bodyweight', 'difficulty' => 'beginner'],
        ['name' => 'Lunges', 'muscle_group' => 'Legs', 'equipment' => 'bodyweight', 'difficulty' => 'beginner'],
        ['name' => 'Dumbbell Goblet Squats', 'muscle_group' => 'Legs', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate'],
        ['name' => 'Barbell Squats', 'muscle_group' => 'Legs', 'equipment' => 'barbell', 'difficulty' => 'advanced'],
        ['name' => 'Kettlebell Swings', 'muscle_group' => 'Legs', 'equipment' => 'kettlebells', 'difficulty' => 'intermediate'],
        ['name' => 'Glute Bridges', 'muscle_group' => 'Legs', 'equipment' => 'bodyweight', 'difficulty' => 'beginner'],

        // Shoulders
        ['name' => 'Pike Push-ups', 'muscle_group' => 'Shoulders', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate'],
        ['name' => 'Dumbbell Overhead Press', 'muscle_group' => 'Shoulders', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate'],
        ['name' => 'Barbell Overhead Press', 'muscle_group' => 'Shoulders', 'equipment' => 'barbell', 'difficulty' => 'advanced'],
        ['name' => 'Lateral Raises', 'muscle_group' => 'Shoulders', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate'],

        // Biceps
        ['name' => 'Resistance Band Curls', 'muscle_group' => 'Biceps', 'equipment' => 'resistance_bands', 'difficulty' => 'beginner'],
        ['name' => 'Dumbbell Curls', 'muscle_group' => 'Biceps', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate'],
        ['name' => 'Barbell Curls', 'muscle_group' => 'Biceps', 'equipment' => 'barbell', 'difficulty' => 'advanced'],

        // Triceps
        ['name' => 'Dips (using a chair)', 'muscle_group' => 'Triceps', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate'],
        ['name' => 'Dumbbell Tricep Extension', 'muscle_group' => 'Triceps', 'equipment' => 'dumbbells', 'difficulty' => 'intermediate'],
        ['name' => 'Resistance Band Pushdowns', 'muscle_group' => 'Triceps', 'equipment' => 'resistance_bands', 'difficulty' => 'beginner'],

        // Core
        ['name' => 'Plank', 'muscle_group' => 'Core', 'equipment' => 'bodyweight', 'difficulty' => 'beginner'],
        ['name' => 'Crunches', 'muscle_group' => 'Core', 'equipment' => 'bodyweight', 'difficulty' => 'beginner'],
        ['name' => 'Leg Raises', 'muscle_group' => 'Core', 'equipment' => 'bodyweight', 'difficulty' => 'intermediate'],
    ];
}

// --- FORM PROCESSING ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and store user preferences
    $user_preferences = [
        'name' => htmlspecialchars($_POST['name']),
        'goal' => $_POST['goal'],
        'fitness_level' => $_POST['fitness_level'],
        'days_per_week' => (int)$_POST['days_per_week'],
        'equipment' => isset($_POST['equipment']) ? $_POST['equipment'] : ['bodyweight'],
    ];
    $_SESSION['user_preferences'] = $user_preferences;

    // --- WORKOUT GENERATION LOGIC ---
    $all_exercises = get_all_exercises();
    $available_exercises = array_filter($all_exercises, function ($exercise) use ($user_preferences) {
        return in_array($exercise['equipment'], $user_preferences['equipment']);
    });

    // Determine sets and reps based on goal and fitness level
    $sets_reps = [
        'muscle_gain' => ['sets' => 4, 'reps' => '8-12'],
        'weight_loss' => ['sets' => 3, 'reps' => '15-20'],
        'general_fitness' => ['sets' => 3, 'reps' => '10-15'],
    ];
    $intensity = $sets_reps[$user_preferences['goal']];
    if ($user_preferences['fitness_level'] === 'beginner') $intensity['sets'] -=1;
    if ($user_preferences['fitness_level'] === 'advanced') $intensity['sets'] +=1;


    // Determine workout split
    $workout_plan = [];
    switch ($user_preferences['days_per_week']) {
        case 2:
        case 3: // Full Body
            $muscle_groups_per_day = [['Chest', 'Back', 'Legs', 'Core'], ['Shoulders', 'Biceps', 'Triceps', 'Legs'], ['Chest', 'Back', 'Shoulders', 'Core']];
            for ($i = 0; $i < $user_preferences['days_per_week']; $i++) {
                $day_title = "Full Body Workout " . ($i + 1);
                $workout_plan[$day_title] = select_exercises($available_exercises, $muscle_groups_per_day[$i], 5);
            }
            break;
        case 4: // Upper/Lower Split
            $days = ["Upper Body 1", "Lower Body 1", "Upper Body 2", "Lower Body 2"];
            $muscle_groups_split = [['Chest', 'Back', 'Shoulders', 'Biceps'], ['Legs', 'Core'], ['Chest', 'Back', 'Shoulders', 'Triceps'], ['Legs', 'Core']];
            for ($i = 0; $i < 4; $i++) {
                 $workout_plan[$days[$i]] = select_exercises($available_exercises, $muscle_groups_split[$i], 5);
            }
            break;
        case 5: // Push/Pull/Legs Split
            $days = ["Push Day (Chest, Shoulders, Triceps)", "Pull Day (Back, Biceps)", "Leg Day", "Push Day 2", "Pull Day 2"];
            $muscle_groups_split = [['Chest', 'Shoulders', 'Triceps'], ['Back', 'Biceps'], ['Legs', 'Core'], ['Chest', 'Shoulders', 'Triceps'], ['Back', 'Biceps']];
             for ($i = 0; $i < 5; $i++) {
                 $workout_plan[$days[$i]] = select_exercises($available_exercises, $muscle_groups_split[$i], 5);
            }
            break;
    }

    // Store the final plan and intensity in the session
    $_SESSION['workout_plan'] = $workout_plan;
    $_SESSION['intensity'] = $intensity;

    // Redirect to the page that displays the workout
    header('Location: workout.php');
    exit();

} else {
    // If accessed directly, redirect back to the form
    header('Location: index.php');
    exit();
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
