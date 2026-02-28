/**
 * SAT Learning App - Main Application Logic
 */

// Sample question data
const sampleQuestions = [
    {
        id: "a456f28c",
        number: 1,
        topic: "Lines & Angles",
        difficulty: "easy",
        conceptId: "1.1",
        text: "In the figure, two lines intersect at a point. Angle 1 and angle 2 are vertical angles. The measure of angle 1 is 72°. What is the measure of angle 2?",
        options: [
            { letter: "A", text: "72°" },
            { letter: "B", text: "108°" },
            { letter: "C", text: "144°" },
            { letter: "D", text: "288°" }
        ],
        correctAnswer: "A",
        explanation: "Vertical angles have equal measures. Since angle 1 is 72°, angle 2 is also 72°."
    },
    {
        id: "f1747a6a",
        number: 2,
        topic: "Triangles",
        difficulty: "easy",
        conceptId: "2.1",
        text: "In triangle ABC, the measure of angle B is 52° and the measure of angle C is 17°. What is the measure of angle A?",
        options: [
            { letter: "A", text: "21°" },
            { letter: "B", text: "35°" },
            { letter: "C", text: "69°" },
            { letter: "D", text: "111°" }
        ],
        correctAnswer: "D",
        explanation: "The sum of the angle measures of a triangle is 180°. Adding the measures of angles B and C gives 52 + 17 = 69°. Therefore, the measure of angle A is 180 - 69 = 111°."
    }
];

// Application state
let state = {
    currentQuestionIndex: 0,
    selectedAnswer: null,
    streak: 0,
    totalXP: 250,
    level: 1,
    timeBank: 45,
    questionsCompleted: 0,
    dailyGoal: 5,
    isAnswered: false,
    attemptNumber: 1
};

// DOM elements
const elements = {
    // Navigation
    streakDisplay: document.getElementById('streak'),
    levelDisplay: document.getElementById('level'),
    timeBankDisplay: document.getElementById('timeBank'),

    // Progress
    xpText: document.getElementById('xpText'),
    xpProgress: document.getElementById('xpProgress'),

    // Question card
    questionCard: document.getElementById('questionCard'),
    feedbackCard: document.getElementById('feedbackCard'),
    submitBtn: document.getElementById('submitBtn'),
    hintBtn: document.getElementById('hintBtn'),
    nextBtn: document.getElementById('nextBtn'),

    // Help modal
    helpModal: document.getElementById('helpModal'),
    showHelpBtn: document.getElementById('showHelpBtn'),
    closeHelpBtn: document.getElementById('closeHelpBtn'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    helpModalBody: document.getElementById('helpModalBody')
};

// Khan Academy lessons data
let khanAcademyLessons = {};

// Initialize the app
async function init() {
    updateUI();
    loadQuestion(state.currentQuestionIndex);
    attachEventListeners();
    await loadKhanAcademyData();
}

// Load Khan Academy lessons data
async function loadKhanAcademyData() {
    try {
        const response = await fetch('khan-academy-lessons.json');
        const data = await response.json();
        khanAcademyLessons = data.concept_resources;
    } catch (error) {
        console.error('Failed to load Khan Academy lessons:', error);
    }
}

// Update all UI elements
function updateUI() {
    // Update navigation stats
    elements.streakDisplay.textContent = state.streak;
    elements.levelDisplay.textContent = state.level;
    elements.timeBankDisplay.textContent = state.timeBank;

    // Update XP bar
    const xpForNextLevel = getXPForLevel(state.level + 1);
    const xpForCurrentLevel = getXPForLevel(state.level);
    const xpProgress = state.totalXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const xpPercentage = (xpProgress / xpNeeded) * 100;

    elements.xpText.textContent = `${state.totalXP} / ${xpForNextLevel}`;
    elements.xpProgress.style.width = `${Math.min(xpPercentage, 100)}%`;
}

// Get XP threshold for a given level
function getXPForLevel(level) {
    const thresholds = [0, 500, 1500, 3000, 5000, 8000, 12000];
    return thresholds[level - 1] || 0;
}

// Load a question
function loadQuestion(index) {
    const question = sampleQuestions[index];
    if (!question) {
        console.log('No more questions!');
        return;
    }

    // Reset state for new question
    state.selectedAnswer = null;
    state.isAnswered = false;
    state.attemptNumber = 1;

    // Show question card, hide feedback
    elements.questionCard.style.display = 'block';
    elements.feedbackCard.style.display = 'none';

    // Update question header
    document.querySelector('.question-number').textContent = `Question ${question.number} of ${sampleQuestions.length}`;
    document.querySelector('.question-topic').textContent = question.topic;

    const difficultyBadge = document.querySelector('.difficulty-badge');
    difficultyBadge.textContent = question.difficulty;
    difficultyBadge.className = `difficulty-badge ${question.difficulty}`;

    // Update question text
    document.querySelector('.question-text').textContent = question.text;

    // Update answer options
    const optionsContainer = document.querySelector('.answer-options');
    optionsContainer.innerHTML = '';

    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'answer-option';
        button.dataset.answer = option.letter;
        button.innerHTML = `
            <span class="option-letter">${option.letter}</span>
            <span class="option-text">${option.text}</span>
        `;
        button.addEventListener('click', () => selectAnswer(option.letter));
        optionsContainer.appendChild(button);
    });

    // Reset submit button
    elements.submitBtn.disabled = true;
}

// Select an answer
function selectAnswer(letter) {
    if (state.isAnswered) return;

    state.selectedAnswer = letter;

    // Update UI
    document.querySelectorAll('.answer-option').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.answer === letter) {
            btn.classList.add('selected');
        }
    });

    // Enable submit button
    elements.submitBtn.disabled = false;
}

// Submit answer
function submitAnswer() {
    if (!state.selectedAnswer || state.isAnswered) return;

    const question = sampleQuestions[state.currentQuestionIndex];
    const isCorrect = state.selectedAnswer === question.correctAnswer;

    state.isAnswered = true;

    // Update answer options to show correct/incorrect
    document.querySelectorAll('.answer-option').forEach(btn => {
        btn.style.pointerEvents = 'none';

        if (btn.dataset.answer === question.correctAnswer) {
            btn.classList.add('correct');
        }

        if (btn.dataset.answer === state.selectedAnswer && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    // Calculate rewards
    const rewards = calculateRewards(isCorrect, state.attemptNumber);

    // Update state
    if (isCorrect) {
        state.streak++;
        state.totalXP += rewards.xp;
        state.timeBank += rewards.time;
        state.questionsCompleted++;
    } else {
        state.streak = 0;
        state.attemptNumber++;
    }

    // Check for level up
    const newLevel = calculateLevel(state.totalXP);
    if (newLevel > state.level) {
        state.level = newLevel;
        showLevelUpNotification();
    }

    // Show feedback
    setTimeout(() => {
        showFeedback(isCorrect, question.explanation, rewards);
        updateUI();
    }, 800);
}

// Calculate rewards
function calculateRewards(isCorrect, attemptNumber) {
    if (!isCorrect) {
        return { time: 0, xp: 0 };
    }

    // Base rewards
    let time = 0;
    let xp = 0;

    if (attemptNumber === 1) {
        time = 5;
        xp = 100;
    } else if (attemptNumber === 2) {
        time = 3;
        xp = 60;
    } else if (attemptNumber === 3) {
        time = 1;
        xp = 30;
    }

    // Streak bonus
    if (state.streak >= 20) time += 10;
    else if (state.streak >= 10) time += 5;
    else if (state.streak >= 5) time += 2;
    else if (state.streak >= 3) time += 1;

    // Morning bonus (simple check)
    const hour = new Date().getHours();
    if (hour < 12) {
        time *= 1.25;
    }

    return { time: Math.round(time * 10) / 10, xp };
}

// Calculate level based on XP
function calculateLevel(xp) {
    if (xp >= 12000) return 7;
    if (xp >= 8000) return 6;
    if (xp >= 5000) return 5;
    if (xp >= 3000) return 4;
    if (xp >= 1500) return 3;
    if (xp >= 500) return 2;
    return 1;
}

// Show feedback card
function showFeedback(isCorrect, explanation, rewards) {
    elements.questionCard.style.display = 'none';
    elements.feedbackCard.style.display = 'block';

    // Update feedback card
    const feedbackCard = elements.feedbackCard;
    feedbackCard.className = `feedback-card ${isCorrect ? 'correct' : 'incorrect'}`;

    const feedbackIcon = feedbackCard.querySelector('.feedback-icon');
    feedbackIcon.textContent = isCorrect ? '✓' : '✗';

    const feedbackTitle = feedbackCard.querySelector('.feedback-title');
    feedbackTitle.textContent = isCorrect ? 'Correct!' : 'Incorrect';

    const feedbackMessage = feedbackCard.querySelector('.feedback-message');
    feedbackMessage.textContent = explanation;

    // Update rewards display
    const rewardDisplay = feedbackCard.querySelector('.reward-display');
    if (isCorrect) {
        rewardDisplay.innerHTML = `
            <div class="reward-item">
                <span class="reward-icon">🎮</span>
                <span class="reward-value">+${rewards.time} min</span>
                <span class="reward-label">Game Time</span>
            </div>
            <div class="reward-item">
                <span class="reward-icon">⭐</span>
                <span class="reward-value">+${rewards.xp} XP</span>
                <span class="reward-label">Experience</span>
            </div>
            <div class="reward-item">
                <span class="reward-icon">🔥</span>
                <span class="reward-value">Streak: ${state.streak}</span>
                <span class="reward-label">Keep going!</span>
            </div>
        `;
    } else {
        // Show help resources when incorrect
        const question = sampleQuestions[state.currentQuestionIndex];
        const conceptId = getConceptIdFromQuestion(question);

        rewardDisplay.innerHTML = `
            <div class="reward-item">
                <span class="reward-icon">💪</span>
                <span class="reward-value">Try Again!</span>
                <span class="reward-label">You've got this</span>
            </div>
        `;

        // Add "Learn This Concept" button if we have resources
        if (conceptId && khanAcademyLessons[conceptId]) {
            const learnBtn = document.createElement('button');
            learnBtn.className = 'btn-help';
            learnBtn.style.marginTop = '1rem';
            learnBtn.textContent = '📚 Learn This Concept';
            learnBtn.onclick = () => showHelpModal(conceptId);
            rewardDisplay.appendChild(learnBtn);
        }
    }
}

// Get concept ID from question
function getConceptIdFromQuestion(question) {
    // Use the conceptId from the question if available
    return question.conceptId || '1.1';
}

// Show help modal with Khan Academy resources
function showHelpModal(conceptId) {
    const concept = khanAcademyLessons[conceptId];
    if (!concept) return;

    // Populate modal content
    document.getElementById('conceptTitle').textContent = concept.concept_name;
    document.getElementById('conceptExplanation').textContent = concept.simple_explanation;

    // Key formula
    const keyFormulaDiv = document.getElementById('keyFormula');
    keyFormulaDiv.innerHTML = `
        <strong>Key Formula:</strong>
        <code>${concept.key_formula}</code>
    `;

    // Prerequisites
    const prerequisitesDiv = document.getElementById('prerequisites');
    if (concept.prerequisites && concept.prerequisites.length > 0) {
        const prereqNames = concept.prerequisites.map(id => khanAcademyLessons[id]?.concept_name || id);
        prerequisitesDiv.innerHTML = `
            <strong>⚠️ Prerequisites:</strong>
            <ul>
                ${prereqNames.map(name => `<li>${name}</li>`).join('')}
            </ul>
        `;
        prerequisitesDiv.style.display = 'block';
    } else {
        prerequisitesDiv.style.display = 'none';
    }

    // Khan Academy lessons
    const khanLessonsDiv = document.getElementById('khanLessons');
    khanLessonsDiv.innerHTML = `
        <h4>🎓 Khan Academy Lessons</h4>
        ${concept.khan_academy_lessons.map(lesson => `
            <a href="${lesson.url}" target="_blank" class="lesson-item">
                <span class="lesson-icon">${lesson.type === 'video' ? '▶️' : '✏️'}</span>
                <div class="lesson-info">
                    <div class="lesson-title">${lesson.title}</div>
                    <div class="lesson-meta">${lesson.type === 'video' ? 'Video' : 'Practice'} • ${lesson.duration}</div>
                </div>
                <span class="lesson-badge">Watch</span>
            </a>
        `).join('')}
    `;

    // Common mistakes
    const mistakesDiv = document.getElementById('commonMistakes');
    mistakesDiv.innerHTML = `
        <strong>⚠️ Common Mistakes:</strong>
        <ul>
            ${concept.common_mistakes.map(mistake => `<li>${mistake}</li>`).join('')}
        </ul>
    `;

    // Show modal
    elements.helpModal.style.display = 'block';
}

// Close help modal
function closeHelpModal() {
    elements.helpModal.style.display = 'none';
}

// Show level up notification
function showLevelUpNotification() {
    // You can implement a modal or toast notification here
    console.log(`🎉 Level Up! You're now level ${state.level}!`);
}

// Next question
function nextQuestion() {
    state.currentQuestionIndex++;

    if (state.currentQuestionIndex >= sampleQuestions.length) {
        // End of questions - show completion screen
        showCompletionScreen();
    } else {
        loadQuestion(state.currentQuestionIndex);
        updateUI();
    }
}

// Show completion screen
function showCompletionScreen() {
    elements.questionCard.style.display = 'none';
    elements.feedbackCard.style.display = 'block';

    const feedbackCard = elements.feedbackCard;
    feedbackCard.className = 'feedback-card correct';

    feedbackCard.innerHTML = `
        <div class="feedback-icon">🎉</div>
        <h2 class="feedback-title">Session Complete!</h2>
        <p class="feedback-message">
            Great work! You've completed all questions in this session.
        </p>
        <div class="reward-display">
            <div class="reward-item">
                <span class="reward-icon">🎮</span>
                <span class="reward-value">${state.timeBank} min</span>
                <span class="reward-label">Total Game Time</span>
            </div>
            <div class="reward-item">
                <span class="reward-icon">⭐</span>
                <span class="reward-value">${state.totalXP} XP</span>
                <span class="reward-label">Total Experience</span>
            </div>
            <div class="reward-item">
                <span class="reward-icon">📊</span>
                <span class="reward-value">${state.questionsCompleted}/${sampleQuestions.length}</span>
                <span class="reward-label">Questions Correct</span>
            </div>
        </div>
        <button class="btn-primary large" onclick="restartSession()">
            Start New Session
        </button>
    `;
}

// Restart session
function restartSession() {
    state.currentQuestionIndex = 0;
    state.questionsCompleted = 0;
    loadQuestion(0);
    updateUI();
}

// Show hint
function showHint() {
    // Deduct 1 minute from time bank
    state.timeBank = Math.max(0, state.timeBank - 1);
    updateUI();

    // Show hint modal or tooltip
    alert('Hint: Remember that vertical angles are always equal in measure!');
}

// Attach event listeners
function attachEventListeners() {
    elements.submitBtn.addEventListener('click', submitAnswer);
    elements.nextBtn.addEventListener('click', nextQuestion);
    elements.hintBtn.addEventListener('click', showHint);

    // Help modal listeners
    elements.showHelpBtn.addEventListener('click', () => {
        const question = sampleQuestions[state.currentQuestionIndex];
        const conceptId = getConceptIdFromQuestion(question);
        showHelpModal(conceptId);
    });

    elements.closeHelpBtn.addEventListener('click', closeHelpModal);
    elements.modalBackdrop.addEventListener('click', closeHelpModal);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Close modal with Escape
        if (e.key === 'Escape' && elements.helpModal.style.display === 'block') {
            closeHelpModal();
            return;
        }

        if (state.isAnswered && e.key === 'Enter') {
            nextQuestion();
        }

        // Select answer with A, B, C, D keys
        if (!state.isAnswered && ['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
            selectAnswer(e.key.toUpperCase());
        }

        // Submit with Enter
        if (!state.isAnswered && e.key === 'Enter' && state.selectedAnswer) {
            submitAnswer();
        }
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export functions for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateRewards,
        calculateLevel,
        getXPForLevel
    };
}
