# Personalized Workout Generator

This project is a PHP-based web application that generates personalized workout plans for users based on their fitness goals, experience level, and available equipment. It's a great example of a dynamic web application that takes user input and provides a customized output.

## Screenshots

Here's a sneak peek of the application in action:

**Workout Input Form (`index.php`)**
![Workout Input Form](images/form.png)

**Generated Workout Plan (`workout.php`)**
![Generated Workout Plan](images/workout.png)

## Features

*   **Personalized Workout Plans:** Generates workout plans tailored to the user's specific needs.
*   **User-Friendly Interface:** A clean and simple form to input user preferences.
*   **Multiple Fitness Goals:** Supports goals for muscle gain, weight loss, and general fitness.
*   **All Fitness Levels:** Caters to beginners, intermediate, and advanced users.
*   **Equipment Selection:** Allows users to specify the equipment they have available.
*   **Gamification:** Includes achievements to motivate users.
*   **Responsive Design:** The application is styled with CSS and is responsive to different screen sizes.

## How It Works

1.  **User Input:** The user fills out a form on the `index.php` page, providing their name, fitness goal, fitness level, workout frequency, and available equipment.
2.  **Workout Generation:** The form data is sent to `generator.php`, which contains the core logic for creating the workout plan. It selects appropriate exercises from a predefined list based on the user's input.
3.  **Display Workout:** The generated plan is then displayed on the `workout.php` page, showing the exercises for each day, along with the number of sets and reps.

## Files

*   `index.php`: The main landing page with the user input form.
*   `generator.php`: The backend script that generates the workout plan.
*   `workout.php`: The page that displays the generated workout plan.
*   `style.css`: The stylesheet for the application.
*   `database.sql`: A SQL script that defines the database schema for a more advanced version of the application. This includes tables for users, exercises, workout plans, and more.
*   `config.php.example`: An example configuration file for setting up the database connection.

## Local Development Setup

To run this project locally using XAMPP, follow these steps:

1.  **Install XAMPP:**
    *   Download and install XAMPP from the [official website](https://www.apachefriends.org/index.html).
    *   Start the Apache and MySQL modules from the XAMPP control panel.

2.  **Clone the repository:**
    *   Navigate to the `htdocs` directory in your XAMPP installation folder (usually `C:\xampp\htdocs` on Windows or `/Applications/XAMPP/htdocs` on macOS).
    *   Clone the repository into this directory:
        ```bash
        git clone https://github.com/your-username/personalized-workout-generator.git
        ```
    *   This will create a `personalized-workout-generator` folder in `htdocs`.

3.  **Set up the database:**
    *   Open your web browser and go to `http://localhost/phpmyadmin/`.
    *   Click on the "Databases" tab and create a new database. You can name it whatever you like (e.g., `workout_generator`).
    *   Click on the newly created database in the left sidebar.
    *   Click on the "Import" tab.
    *   Click "Choose File" and select the `database.sql` file from the project directory.
    *   Click "Go" to import the database schema.

4.  **Configure the database connection:**
    *   In the project directory, rename `config.php.example` to `config.php`.
    *   Open `config.php` in a text editor and update the following lines with your database credentials:
        ```php
        define('DB_HOST', 'localhost');
        define('DB_USERNAME', 'root'); // Default XAMPP username
        define('DB_PASSWORD', ''); // Default XAMPP password
        define('DB_NAME', 'workout_generator'); // The name of the database you created
        ```

5.  **Run the application:**
    *   Open your web browser and navigate to `http://localhost/personalized-workout-generator/`.
    *   You should now see the application's home page.

## Future Enhancements

The `database.sql` file lays the groundwork for several potential future enhancements, including:

*   **User Accounts:** Allow users to create accounts to save their workout plans and track their progress over time.
*   **Exercise Database:** A comprehensive database of exercises with detailed information, including instructions and video demonstrations.
*   **Progress Tracking:** Enable users to log their workouts and track their progress towards their fitness goals.
*   **Achievement System:** A more robust achievement system to reward users for their consistency and hard work.

## Contributing

Contributions are welcome! If you have any ideas for new features or improvements, please feel free to open an issue or submit a pull request.
