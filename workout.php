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
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header>
            <h1>Your Workout Plan, <?php echo htmlspecialchars($user['name']); ?>!</h1>
            <p>Here is your personalized plan for <strong><?php echo htmlspecialchars(str_replace('_', ' ', $user['goal'])); ?></strong>. Let's get started!</p>
            <a href="index.php" class="back-link">&larr; Generate a New Plan</a>
        </header>

        <div class="workout-grid">
            <?php foreach ($plan as $day => $exercises): ?>
            <div class="workout-card">
                <h2><?php echo htmlspecialchars($day); ?></h2>
                <?php if (empty($exercises)): ?>
                    <p>No suitable exercises found for your equipment selection. Try adding more equipment!</p>
                <?php else: ?>
                <ul>
                    <?php foreach ($exercises as $exercise): ?>
                    <li>
                        <strong><?php echo htmlspecialchars($exercise); ?>:</strong>
                        <span><?php echo $intensity['sets']; ?> sets of <?php echo $intensity['reps']; ?> reps</span>
                    </li>
                    <?php endforeach; ?>
                </ul>
                <?php endif; ?>
                <button class="complete-btn">Mark as Complete</button>
            </div>
            <?php endforeach; ?>
        </div>

        <div class="gamification-section">
            <h2>Achievements Unlocked!</h2>
            <div class="achievements-grid">
                 <?php foreach ($achievements as $title => $description): ?>
                 <div class="achievement-card">
                    <div class="icon">🏆</div>
                    <h3><?php echo htmlspecialchars($title); ?></h3>
                    <p><?php echo htmlspecialchars($description); ?></p>
                 </div>
                 <?php endforeach; ?>
            </div>
        </div>

        <div class="reminders-section">
            <h2>Friendly Reminders</h2>
            <ul>
                <li>Always warm up for 5-10 minutes before each session.</li>
                <li>Stay hydrated! Drink plenty of water throughout the day.</li>
                <li>Listen to your body. Rest is just as important as exercise.</li>
                <li>Track your progress! Note the weights you lift to see your strength increase over time.</li>
            </ul>
        </div>
    </div>
    
    <script>
        // Simple interactivity to provide feedback. In a real app, this would
        // use AJAX to save progress to the database.
        document.querySelectorAll('.complete-btn').forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.workout-card');
                card.classList.toggle('completed');
                if (card.classList.contains('completed')) {
                    button.textContent = 'Completed! Great job!';
                } else {
                    button.textContent = 'Mark as Complete';
                }
            });
        });
    </script>
</body>
</html>
