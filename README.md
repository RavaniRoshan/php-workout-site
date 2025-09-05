# Personalized Workout Generator

This project is a PHP-based web application that generates personalized workout plans for users based on their fitness goals, experience level, and available equipment. It's a great example of a dynamic web application that takes user input and provides a customized output.

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

## Future Enhancements

The `database.sql` file lays the groundwork for several potential future enhancements, including:

*   **User Accounts:** Allow users to create accounts to save their workout plans and track their progress over time.
*   **Exercise Database:** A comprehensive database of exercises with detailed information, including instructions and video demonstrations.
*   **Progress Tracking:** Enable users to log their workouts and track their progress towards their fitness goals.
*   **Achievement System:** A more robust achievement system to reward users for their consistency and hard work.

## Setup and Installation

To run this project, you will need a web server with PHP support (e.g., Apache, Nginx) and a MySQL database.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/personalized-workout-generator.git
    ```
2.  **Import the database:**
    *   Create a new database in your MySQL server.
    *   Import the `database.sql` file into the newly created database.
3.  **Configure the database connection:**
    *   In a real application, you would have a `config.php` file to store your database credentials. You would need to update this file with your database host, username, password, and database name.
4.  **Start the web server:**
    *   Place the project files in the web root directory of your server.
    *   Start the server and navigate to the project's URL in your web browser.

## Contributing

Contributions are welcome! If you have any ideas for new features or improvements, please feel free to open an issue or submit a pull request.
