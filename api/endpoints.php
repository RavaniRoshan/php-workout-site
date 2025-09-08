<?php
/**
 * AJAX API Endpoints for Workout Generator
 * Handles form validation, session management, and workout generation
 */

// Enable CORS for development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

// Include the main generator functions
require_once '../generator.php';

// Route the request based on the action parameter
$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'validate_step':
        handleStepValidation();
        break;
    case 'save_step_data':
        handleStepDataSave();
        break;
    case 'get_session_data':
        handleGetSessionData();
        break;
    case 'generate_workout':
        handleWorkoutGeneration();
        break;
    case 'clear_session':
        handleClearSession();
        break;
    default:
        sendErrorResponse('INVALID_ACTION', 'Invalid or missing action parameter', 400);
}

/**
 * Validate form step data
 */
function handleStepValidation() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendErrorResponse('INVALID_INPUT', 'Invalid JSON input', 400);
        return;
    }
    
    $step = $input['step'] ?? 0;
    $data = $input['data'] ?? [];
    
    $validation = validateStepData($step, $data);
    
    if ($validation['valid']) {
        sendSuccessResponse(['valid' => true, 'message' => 'Validation passed']);
    } else {
        sendErrorResponse('VALIDATION_FAILED', $validation['errors'], 422);
    }
}

/**
 * Save step data to session
 */
function handleStepDataSave() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendErrorResponse('INVALID_INPUT', 'Invalid JSON input', 400);
        return;
    }
    
    $step = $input['step'] ?? 0;
    $data = $input['data'] ?? [];
    
    // Validate before saving
    $validation = validateStepData($step, $data);
    
    if (!$validation['valid']) {
        sendErrorResponse('VALIDATION_FAILED', $validation['errors'], 422);
        return;
    }
    
    // Initialize form data session if not exists
    if (!isset($_SESSION['form_data'])) {
        $_SESSION['form_data'] = [];
    }
    
    // Save step data
    $_SESSION['form_data']['step_' . $step] = $data;
    $_SESSION['form_data']['current_step'] = $step;
    $_SESSION['form_data']['last_updated'] = time();
    
    sendSuccessResponse([
        'saved' => true,
        'step' => $step,
        'message' => 'Step data saved successfully'
    ]);
}

/**
 * Get current session data
 */
function handleGetSessionData() {
    $sessionData = [
        'form_data' => $_SESSION['form_data'] ?? [],
        'user_preferences' => $_SESSION['user_preferences'] ?? null,
        'workout_plan' => $_SESSION['workout_plan'] ?? null,
        'session_id' => session_id()
    ];
    
    sendSuccessResponse($sessionData);
}

/**
 * Generate workout plan from form data
 */
function handleWorkoutGeneration() {
    if (!isset($_SESSION['form_data'])) {
        sendErrorResponse('NO_FORM_DATA', 'No form data found in session', 400);
        return;
    }
    
    try {
        // Convert multi-step form data to legacy format
        $userPreferences = convertFormDataToLegacyFormat($_SESSION['form_data']);
        
        // Validate complete form data
        $validation = validateCompleteFormData($userPreferences);
        if (!$validation['valid']) {
            sendErrorResponse('INCOMPLETE_DATA', $validation['errors'], 422);
            return;
        }
        
        // Generate workout using existing logic
        $workoutResult = generateWorkoutPlan($userPreferences);
        
        // Store in session
        $_SESSION['user_preferences'] = $userPreferences;
        $_SESSION['workout_plan'] = $workoutResult['plan'];
        $_SESSION['intensity'] = $workoutResult['intensity'];
        
        sendSuccessResponse([
            'success' => true,
            'workout_plan' => $workoutResult['plan'],
            'intensity' => $workoutResult['intensity'],
            'user_preferences' => $userPreferences,
            'redirect_url' => 'workout.php'
        ]);
        
    } catch (Exception $e) {
        sendErrorResponse('GENERATION_ERROR', 'Failed to generate workout: ' . $e->getMessage(), 500);
    }
}

/**
 * Clear session data
 */
function handleClearSession() {
    session_destroy();
    session_start();
    
    sendSuccessResponse(['cleared' => true, 'message' => 'Session cleared successfully']);
}

/**
 * Validate step data based on step number
 */
function validateStepData($step, $data) {
    $errors = [];
    
    switch ($step) {
        case 1: // Personal Information
            if (empty($data['name']) || strlen(trim($data['name'])) < 2) {
                $errors['name'] = 'Name must be at least 2 characters long';
            }
            if (empty($data['age']) || !is_numeric($data['age']) || $data['age'] < 13 || $data['age'] > 100) {
                $errors['age'] = 'Age must be between 13 and 100';
            }
            if (empty($data['gender']) || !in_array($data['gender'], ['male', 'female', 'other'])) {
                $errors['gender'] = 'Please select a valid gender';
            }
            break;
            
        case 2: // Fitness Goals
            if (empty($data['primary_goal']) || !in_array($data['primary_goal'], ['muscle_gain', 'weight_loss', 'general_fitness', 'strength', 'endurance'])) {
                $errors['primary_goal'] = 'Please select a valid primary goal';
            }
            if (empty($data['target_areas']) || !is_array($data['target_areas'])) {
                $errors['target_areas'] = 'Please select at least one target area';
            }
            break;
            
        case 3: // Experience Level
            if (empty($data['fitness_level']) || !in_array($data['fitness_level'], ['beginner', 'intermediate', 'advanced'])) {
                $errors['fitness_level'] = 'Please select a valid fitness level';
            }
            if (isset($data['years_active']) && (!is_numeric($data['years_active']) || $data['years_active'] < 0 || $data['years_active'] > 50)) {
                $errors['years_active'] = 'Years active must be between 0 and 50';
            }
            break;
            
        case 4: // Equipment Selection
            if (empty($data['equipment']) || !is_array($data['equipment'])) {
                $errors['equipment'] = 'Please select at least one equipment option';
            } else {
                $validEquipment = ['bodyweight', 'dumbbells', 'barbell', 'resistance_bands', 'kettlebells', 'machines', 'cables'];
                foreach ($data['equipment'] as $equipment) {
                    if (!in_array($equipment, $validEquipment)) {
                        $errors['equipment'] = 'Invalid equipment selection';
                        break;
                    }
                }
            }
            break;
            
        case 5: // Preferences
            if (empty($data['days_per_week']) || !is_numeric($data['days_per_week']) || $data['days_per_week'] < 1 || $data['days_per_week'] > 7) {
                $errors['days_per_week'] = 'Days per week must be between 1 and 7';
            }
            if (empty($data['workout_duration']) || !is_numeric($data['workout_duration']) || $data['workout_duration'] < 15 || $data['workout_duration'] > 180) {
                $errors['workout_duration'] = 'Workout duration must be between 15 and 180 minutes';
            }
            if (isset($data['intensity']) && (!is_numeric($data['intensity']) || $data['intensity'] < 1 || $data['intensity'] > 10)) {
                $errors['intensity'] = 'Intensity must be between 1 and 10';
            }
            break;
            
        default:
            $errors['step'] = 'Invalid step number';
    }
    
    return [
        'valid' => empty($errors),
        'errors' => $errors
    ];
}

/**
 * Validate complete form data
 */
function validateCompleteFormData($data) {
    $errors = [];
    
    // Check required fields
    $requiredFields = ['name', 'goal', 'fitness_level', 'days_per_week', 'equipment'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required';
        }
    }
    
    return [
        'valid' => empty($errors),
        'errors' => $errors
    ];
}

/**
 * Convert multi-step form data to legacy format
 */
function convertFormDataToLegacyFormat($formData) {
    $legacy = [];
    
    // Step 1: Personal Information
    if (isset($formData['step_1'])) {
        $legacy['name'] = $formData['step_1']['name'] ?? '';
        $legacy['age'] = $formData['step_1']['age'] ?? 0;
        $legacy['gender'] = $formData['step_1']['gender'] ?? '';
    }
    
    // Step 2: Fitness Goals
    if (isset($formData['step_2'])) {
        $legacy['goal'] = $formData['step_2']['primary_goal'] ?? 'general_fitness';
        $legacy['target_areas'] = $formData['step_2']['target_areas'] ?? [];
        $legacy['secondary_goals'] = $formData['step_2']['secondary_goals'] ?? [];
    }
    
    // Step 3: Experience Level
    if (isset($formData['step_3'])) {
        $legacy['fitness_level'] = $formData['step_3']['fitness_level'] ?? 'beginner';
        $legacy['years_active'] = $formData['step_3']['years_active'] ?? 0;
        $legacy['previous_injuries'] = $formData['step_3']['previous_injuries'] ?? [];
    }
    
    // Step 4: Equipment
    if (isset($formData['step_4'])) {
        $legacy['equipment'] = $formData['step_4']['equipment'] ?? ['bodyweight'];
        $legacy['workout_location'] = $formData['step_4']['location'] ?? 'home';
    }
    
    // Step 5: Preferences
    if (isset($formData['step_5'])) {
        $legacy['days_per_week'] = $formData['step_5']['days_per_week'] ?? 3;
        $legacy['workout_duration'] = $formData['step_5']['workout_duration'] ?? 45;
        $legacy['time_of_day'] = $formData['step_5']['time_of_day'] ?? 'morning';
        $legacy['intensity'] = $formData['step_5']['intensity'] ?? 5;
    }
    
    return $legacy;
}

/**
 * Generate workout plan using enhanced logic
 */
function generateWorkoutPlan($userPreferences) {
    // Use existing workout generation logic from generator.php
    $all_exercises = get_all_exercises();
    $available_exercises = array_filter($all_exercises, function ($exercise) use ($userPreferences) {
        return in_array($exercise['equipment'], $userPreferences['equipment']);
    });

    // Enhanced sets and reps based on goals and experience
    $sets_reps = [
        'muscle_gain' => ['sets' => 4, 'reps' => '8-12'],
        'weight_loss' => ['sets' => 3, 'reps' => '15-20'],
        'general_fitness' => ['sets' => 3, 'reps' => '10-15'],
        'strength' => ['sets' => 5, 'reps' => '3-6'],
        'endurance' => ['sets' => 2, 'reps' => '20-30'],
    ];
    
    $intensity = $sets_reps[$userPreferences['goal']] ?? $sets_reps['general_fitness'];
    
    // Adjust based on fitness level
    if ($userPreferences['fitness_level'] === 'beginner') {
        $intensity['sets'] = max(1, $intensity['sets'] - 1);
    } elseif ($userPreferences['fitness_level'] === 'advanced') {
        $intensity['sets'] += 1;
    }

    // Generate workout split based on days per week
    $workout_plan = [];
    $days_per_week = $userPreferences['days_per_week'];
    
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

    return [
        'plan' => $workout_plan,
        'intensity' => $intensity
    ];
}

/**
 * Send success response
 */
function sendSuccessResponse($data) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $data,
        'timestamp' => time()
    ]);
    exit();
}

/**
 * Send error response
 */
function sendErrorResponse($code, $message, $httpCode = 400) {
    http_response_code($httpCode);
    echo json_encode([
        'success' => false,
        'error' => [
            'code' => $code,
            'message' => $message
        ],
        'timestamp' => time()
    ]);
    exit();
}
?>