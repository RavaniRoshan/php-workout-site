-- This SQL schema represents the database structure for a full-featured
-- Personalized Workout Generator application.

-- Table to store user information and their preferences.
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Storing preferences as JSON allows for flexibility
    preferences JSON
);

-- Table containing all possible exercises the generator can choose from.
CREATE TABLE exercises (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    muscle_group VARCHAR(50) NOT NULL, -- e.g., 'Chest', 'Back', 'Legs'
    equipment_needed VARCHAR(50) NOT NULL, -- e.g., 'bodyweight', 'dumbbells'
    difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    description TEXT,
    video_url VARCHAR(255)
);

-- Table to store the workout plans generated for each user.
CREATE TABLE workout_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    plan_data JSON NOT NULL, -- The entire generated workout plan is stored as JSON
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Table to log each completed workout session.
CREATE TABLE workout_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT,
    session_date DATE NOT NULL,
    status ENUM('completed', 'skipped', 'in_progress') DEFAULT 'in_progress',
    duration_minutes INT, -- How long the workout took
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES workout_plans(plan_id) ON DELETE SET NULL
);

-- Table to track the specifics of each exercise within a completed session (Progress Tracking).
CREATE TABLE session_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    exercise_id INT NOT NULL,
    -- Storing sets/reps/weights as JSON for flexibility e.g., [{"reps": 12, "weight": 20}, {"reps": 10, "weight": 20}]
    performance_data JSON,
    FOREIGN KEY (session_id) REFERENCES workout_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id)
);

-- Table of all possible achievements in the system.
CREATE TABLE achievements (
    achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    icon_class VARCHAR(100) -- e.g., 'fas fa-trophy' for FontAwesome
);

-- Junction table to link users with the achievements they have earned.
CREATE TABLE user_achievements (
    user_achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id),
    UNIQUE(user_id, achievement_id) -- A user can only earn an achievement once
);
