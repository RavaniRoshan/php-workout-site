<?php
// Start session to access stored data
session_start();

// Check if the workout plan exists in the session. If not, redirect to the form.
if (!isset($_SESSION['workout_plan']) || !isset($_SESSION['user_preferences'])) {
    header('Location: index.php');
    exit();
}

$user = $_SESSION['user_preferences'];
$plan = $_SESSION['workout_plan'];
$intensity = $_SESSION['intensity'];

// Gamification / Achievements (Conceptual)
// In a real app, you'd check the database for the user's history.
$achievements = [
    'First Workout Generated!' => 'You\'re on your way to success.',
    'Committed!' => 'You chose a ' . $user['days_per_week'] . '-day plan. Great dedication!',
];
if($user['fitness_level'] === 'beginner') {
    $achievements['New Beginnings'] = 'Starting the journey is the hardest part. You did it!';
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Custom Workout Plan</title>
    <link rel="stylesheet" href="assets/css/tailwind.css">
    <link rel="stylesheet" href="src/css/workout-display.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="workout-container">
    <div class="workout-header">
        <h1>Your Workout Plan, <?php echo htmlspecialchars($user['name']); ?>!</h1>
        <p>Here is your personalized plan for <strong><?php echo htmlspecialchars(str_replace('_', ' ', $user['goal'])); ?></strong>. Let's get started!</p>
        <a href="index.php" class="back-link">&larr; Generate a New Plan</a>
    </div>

        <div id="workout-content">
            <div id="workout-grid-container"></div>
        </div>
    </div>
    <script src="src/js/main.js"></script>
    <!-- Add WorkoutCardList module -->
    <script src="src/js/components/WorkoutCardList.js" type="module"></script>
</body>
</html>
