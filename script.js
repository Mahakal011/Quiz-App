// --- API & Question Configuration ---
const API_URL = "https://opentdb.com/api.php?amount=10&type=multiple";
const TOTAL_TIME = 90; // Time in seconds

// --- State Variables ---
let QUIZ_QUESTIONS = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = TOTAL_TIME;
let timerInterval = null;
let questionAnswered = false;

// --- DOM Element References ---
// We assume the HTML elements exist based on index.html
const startScreen = document.getElementById('start-screen');
const loadingScreen = document.getElementById('loading-screen');
const quizArea = document.getElementById('quiz-area');
const resultsScreen = document.getElementById('results-screen');
const errorScreen = document.getElementById('error-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const errorRetryButton = document.getElementById('error-retry-button');
const feedbackElement = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer');
const finalScoreDisplay = document.getElementById('final-score');
const statusBar = document.getElementById('status-bar');

// --- Utility Functions ---

/** Decodes HTML entities (like &quot; or &#039;) from the API response. */
function htmlDecode(input) {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

/** Shuffles an array (Fisher-Yates algorithm). */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/** Fetches questions from the Open Trivia DB API. */
async function fetchQuestions() {
    // Display loading screen and hide others
    startScreen.classList.add('hidden');
    quizArea.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    errorScreen.classList.add('hidden');
    loadingScreen.classList.remove('hidden');

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.response_code !== 0 || data.results.length === 0) {
            throw new Error("API returned no questions or an error code.");
        }

        // Process and format the questions for use
        QUIZ_QUESTIONS = data.results.map(q => {
            // Combine correct and incorrect answers
            const options = [
                q.correct_answer,
                ...q.incorrect_answers
            ].map(htmlDecode); // Decode all options

            return {
                question: htmlDecode(q.question),
                options: shuffleArray(options), // Shuffle the options
                answer: htmlDecode(q.correct_answer) // Decode the correct answer
            };
        });

        // Hide loading screen and proceed to quiz start
        loadingScreen.classList.add('hidden');
        startQuizCore();

    } catch (error) {
        console.error("Fetch error:", error);
        loadingScreen.classList.add('hidden');
        errorScreen.classList.remove('hidden');
        document.getElementById('error-message').textContent = `Error: ${error.message}`;
    }
}

// --- Core Quiz Logic ---

/** Initializes the quiz state and starts the timer. */
function startQuizCore() {
    // Reset state
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = TOTAL_TIME;
    questionAnswered = false;

    // Update UI visibility
    startScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    errorScreen.classList.add('hidden');
    quizArea.classList.remove('hidden');
    statusBar.classList.remove('hidden');

    // Reset displays
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    nextButton.disabled = true;

    startTimer();
    loadQuestion();
}

/** Handles the main quiz timer logic. */
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 10) {
            timerDisplay.classList.remove('bg-yellow-100', 'text-yellow-800');
            timerDisplay.classList.add('bg-red-100', 'text-red-600');
        } else {
             timerDisplay.classList.add('bg-yellow-100', 'text-yellow-800');
             timerDisplay.classList.remove('bg-red-100', 'text-red-600');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

/** Loads and displays the current question and its options. */
function loadQuestion() {
    if (currentQuestionIndex >= QUIZ_QUESTIONS.length) {
        endQuiz();
        return;
    }

    const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
    questionText.textContent = `${currentQuestionIndex + 1} of ${QUIZ_QUESTIONS.length}. ${currentQ.question}`;
    optionsContainer.innerHTML = '';
    feedbackElement.classList.add('hidden');
    feedbackElement.textContent = '';
    nextButton.disabled = true;
    questionAnswered = false;

    currentQ.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'option-button w-full text-left py-3 px-4 border border-gray-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150';
        button.addEventListener('click', () => checkAnswer(button, option, currentQ.answer));
        optionsContainer.appendChild(button);
    });
}

/** Checks the selected answer and provides immediate feedback. */
function checkAnswer(selectedButton, selectedOption, correctAnswer) {
    if (questionAnswered) return;

    questionAnswered = true;
    nextButton.disabled = false;

    // Highlight the selected answer
    if (selectedOption === correctAnswer) {
        selectedButton.classList.add('correct');
        feedbackElement.textContent = "Correct!";
        feedbackElement.classList.remove('text-red-500');
        feedbackElement.classList.add('text-green-600');
        score++;
    } else {
        selectedButton.classList.add('incorrect');
        feedbackElement.textContent = "Incorrect. The correct answer was: " + correctAnswer;
        feedbackElement.classList.remove('text-green-600');
        feedbackElement.classList.add('text-red-500');

        // Highlight the actual correct answer
        Array.from(optionsContainer.children).forEach(button => {
            if (button.textContent === correctAnswer) {
                button.classList.add('correct');
            }
        });
    }

    // Disable all buttons after an answer is chosen
    Array.from(optionsContainer.children).forEach(button => {
        button.classList.add('disabled');
    });

    scoreDisplay.textContent = `Score: ${score}`;
    feedbackElement.classList.remove('hidden');
}

/** Advances to the next question or ends the quiz. */
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < QUIZ_QUESTIONS.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

/** Ends the quiz, stops the timer, and displays the results. */
function endQuiz() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    quizArea.classList.add('hidden');
    statusBar.classList.add('hidden');
    resultsScreen.classList.remove('hidden');

    finalScoreDisplay.textContent = `${score} / ${QUIZ_QUESTIONS.length}`;
}

// --- Event Listeners ---
startButton.addEventListener('click', fetchQuestions);
restartButton.addEventListener('click', fetchQuestions);
errorRetryButton.addEventListener('click', fetchQuestions);
nextButton.addEventListener('click', nextQuestion);

/** Initial setup on page load (shows the start screen) */
window.onload = () => {
    // Hide all interactive screens initially
    quizArea.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    statusBar.classList.add('hidden');
    loadingScreen.classList.add('hidden');
    errorScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
};
