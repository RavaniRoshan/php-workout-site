<?php
// Start a session to store data across pages
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personalized Workout Generator</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header>
            <h1>Personalized Workout Generator</h1>
            <p>Fill in your details below to create a custom workout plan tailored just for you.</p>
        </header>

        <form action="generator.php" method="POST" class="workout-form">
            <div class="form-group">
                <label for="name">Your Name</label>
                <input type="text" id="name" name="name" placeholder="e.g., Alex Smith" required>
            </div>

            <div class="form-group">
                <label for="goal">Primary Fitness Goal</label>
                <select id="goal" name="goal" required>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="weight_loss">Fat Loss / Weight Loss</option>
                    <option value="general_fitness">General Fitness</option>
                </select>
            </div>

            <div class="form-group">
                <label for="fitness_level">Current Fitness Level</label>
                <select id="fitness_level" name="fitness_level" required>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>

            <div class="form-group">
                <label for="days_per_week">How many days can you work out per week?</label>
                <select id="days_per_week" name="days_per_week" required>
                    <option value="2">2 Days</option>
                    <option value="3">3 Days</option>
                    <option value="4">4 Days</option>
                    <option value="5">5 Days</option>
                </select>
            </div>

            <fieldset class="form-group">
                <legend>Available Equipment</legend>
                <div class="checkbox-group">
                    <div>
                        <input type="checkbox" id="bodyweight" name="equipment[]" value="bodyweight" checked>
                        <label for="bodyweight">Bodyweight</label>
                    </div>
                    <div>
                        <input type="checkbox" id="dumbbells" name="equipment[]" value="dumbbells">
                        <label for="dumbbells">Dumbbells</label>
                    </div>
                    <div>
                        <input type="checkbox" id="barbell" name="equipment[]" value="barbell">
                        <label for="barbell">Barbell</label>
                    </div>
                     <div>
                        <input type="checkbox" id="resistance_bands" name="equipment[]" value="resistance_bands">
                        <label for="resistance_bands">Resistance Bands</label>
                    </div>
                    <div>
                        <input type="checkbox" id="kettlebells" name="equipment[]" value="kettlebells">
                        <label for="kettlebells">Kettlebells</label>
                    </div>
                </div>
            </fieldset>

            <button type="submit" class="submit-btn">Generate My Workout!</button>
        </form>
    </div>
</body>
</html>
