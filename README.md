🧠 Quiz-App: Dynamic Online Trivia Challenge
Interactive quiz tool for practice and testing, featuring dynamic questions, timers, and instant scoring.

✨ Project Overview
The Quiz-App is a lightweight, frontend-only web application designed to provide a highly engaging and repeatable self-assessment experience. It solves the common problem of static quiz content by integrating with an external API to deliver fresh, randomized questions every time the quiz is played.

This project showcases a clean modular structure using HTML, CSS, and JavaScript.

🚀 Features
Dynamic Content: Fetches 10 new, random multiple-choice questions from the Open Trivia Database (OpenTDB) on every start.

Timed Challenge: Features a 90-second countdown timer to simulate real testing conditions.

Instant Scoring & Feedback: Provides immediate visual feedback (green for correct, red for incorrect) and updates the score in real-time.

Responsive Design: Fully optimized for both desktop and mobile devices using Tailwind CSS.

Modular Architecture: Separation of concerns across index.html, style.css, and script.js for maintainability.

Error Handling: Includes a dedicated screen and logic to manage API fetch failures (e.g., due to network issues).

🛠️ Technologies Used
Category

Technology

Purpose

Structure

HTML5

Defines the application's layout and content containers.

Styling

CSS3 / Tailwind CSS

Provides utility-first classes for fast, responsive styling and aesthetics.

Logic

Vanilla JavaScript (ES6+)

Handles state management, timer control, event listeners, and data processing.

Data Source

Open Trivia Database API

Provides the dynamic stream of trivia questions.

📁 File Structure
The project is organized into three files for maximum clarity:

├── index.html         // Main HTML structure, loads CSS and JS

├── style.css          // Custom styles and animations (e.g., loader spinner)

└── script.js          // All application logic, API calls, and quiz flow

Developed with ❤️ using HTML, CSS, and JavaScript.
