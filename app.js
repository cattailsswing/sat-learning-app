/**
 * SAT Learning App - Main Application Logic
 */

// Sample question data
const sampleQuestions = [
    {
        id: "5733ce30",
        number: 1,
        topic: "Lines & Angles",
        difficulty: "easy",
        conceptId: "1.3",
        text: "In the given figure, AC extends to point D. If the measure of ∠BAC is equal to the measure of ∠BCA, what is the value of x?",
        diagramImage: "diagrams/question_8_1.png",
        options: [
            { letter: "A", text: "110" },
            { letter: "B", text: "70" },
            { letter: "C", text: "55" },
            { letter: "D", text: "40" }
        ],
        correctAnswer: "D",
        explanation: "Since ∠BCD and ∠BCA form a linear pair, ∠BCA = 180° - 110° = 70°. It's given that ∠BAC = ∠BCA, so ∠BAC = 70° also. The angles in triangle ABC sum to 180°: x + 70° + 70° = 180°, so x = 40°."
    },
    {
        id: "992f4e93",
        number: 2,
        topic: "Parallel Lines",
        difficulty: "easy",
        conceptId: "1.2",
        text: "In the figure, lines j and k are parallel. What is the value of a?",
        diagramImage: "diagrams/question_11_1.png",
        options: [
            { letter: "A", text: "26" },
            { letter: "B", text: "64" },
            { letter: "C", text: "116" },
            { letter: "D", text: "154" }
        ],
        correctAnswer: "C",
        explanation: "When a transversal crosses parallel lines, corresponding angles are equal and consecutive interior angles are supplementary. The angle shown (64°) and angle a are supplementary, so a = 180° - 64° = 116°."
    }
];

// Application state
let state = {
    currentQuestionIndex: 0,
    selectedAnswer: null,
    streak: 0,
    totalXP: 0,
    level: 1,
    timeBank: 0,
    questionsCompleted: 0,
    dailyGoal: 5,
    isAnswered: false,
    attemptNumber: 1,
    watchedLessons: {}, // Track which lessons have been watched: { conceptId: { lessonIndex: true } }
    conceptsChecked: {} // Track which concepts passed the concept check: { conceptId: true }
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

// SVG Diagram Generation Functions
function createSVGDiagram(diagramData) {
    if (!diagramData || !diagramData.type) {
        return null;
    }

    switch (diagramData.type) {
        case 'intersecting-lines':
            return createIntersectingLinesDiagram(diagramData);
        case 'triangle':
            return createTriangleDiagram(diagramData);
        default:
            return null;
    }
}

function createIntersectingLinesDiagram(data) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 300 200");
    svg.setAttribute("class", "diagram-svg");

    // Create two intersecting lines
    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line1.setAttribute("x1", "30");
    line1.setAttribute("y1", "50");
    line1.setAttribute("x2", "270");
    line1.setAttribute("y2", "150");
    line1.setAttribute("stroke", "#2d3748");
    line1.setAttribute("stroke-width", "2");

    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line2.setAttribute("x1", "30");
    line2.setAttribute("y1", "150");
    line2.setAttribute("x2", "270");
    line2.setAttribute("y2", "50");
    line2.setAttribute("stroke", "#2d3748");
    line2.setAttribute("stroke-width", "2");

    // Center point
    const center = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    center.setAttribute("cx", "150");
    center.setAttribute("cy", "100");
    center.setAttribute("r", "3");
    center.setAttribute("fill", "#e53e3e");

    // Angle 1 arc (top)
    const arc1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arc1.setAttribute("d", "M 180 90 A 35 35 0 0 1 165 70");
    arc1.setAttribute("stroke", "#3182ce");
    arc1.setAttribute("stroke-width", "2");
    arc1.setAttribute("fill", "none");

    // Angle 2 arc (bottom - vertical angle)
    const arc2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arc2.setAttribute("d", "M 120 110 A 35 35 0 0 1 135 130");
    arc2.setAttribute("stroke", "#38a169");
    arc2.setAttribute("stroke-width", "2");
    arc2.setAttribute("fill", "none");

    // Labels
    const label1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label1.setAttribute("x", "185");
    label1.setAttribute("y", "75");
    label1.setAttribute("fill", "#3182ce");
    label1.setAttribute("font-size", "16");
    label1.setAttribute("font-weight", "bold");
    label1.textContent = "∠1";

    const label2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label2.setAttribute("x", "100");
    label2.setAttribute("y", "135");
    label2.setAttribute("fill", "#38a169");
    label2.setAttribute("font-size", "16");
    label2.setAttribute("font-weight", "bold");
    label2.textContent = "∠2";

    // Angle value for angle 1
    if (data.angle1) {
        const value1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        value1.setAttribute("x", "195");
        value1.setAttribute("y", "90");
        value1.setAttribute("fill", "#3182ce");
        value1.setAttribute("font-size", "14");
        value1.textContent = `${data.angle1}°`;
        svg.appendChild(value1);
    }

    svg.appendChild(line1);
    svg.appendChild(line2);
    svg.appendChild(center);
    svg.appendChild(arc1);
    svg.appendChild(arc2);
    svg.appendChild(label1);
    svg.appendChild(label2);

    return svg;
}

function createTriangleDiagram(data) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 300 220");
    svg.setAttribute("class", "diagram-svg");

    // Triangle vertices
    const ax = 150, ay = 30;  // A (top)
    const bx = 50, by = 180;   // B (bottom left)
    const cx = 250, cy = 180;  // C (bottom right)

    // Triangle sides
    const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    triangle.setAttribute("points", `${ax},${ay} ${bx},${by} ${cx},${cy}`);
    triangle.setAttribute("stroke", "#2d3748");
    triangle.setAttribute("stroke-width", "2");
    triangle.setAttribute("fill", "rgba(99, 179, 237, 0.1)");

    // Vertices
    const vertexA = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    vertexA.setAttribute("cx", ax);
    vertexA.setAttribute("cy", ay);
    vertexA.setAttribute("r", "3");
    vertexA.setAttribute("fill", "#e53e3e");

    const vertexB = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    vertexB.setAttribute("cx", bx);
    vertexB.setAttribute("cy", by);
    vertexB.setAttribute("r", "3");
    vertexB.setAttribute("fill", "#e53e3e");

    const vertexC = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    vertexC.setAttribute("cx", cx);
    vertexC.setAttribute("cy", cy);
    vertexC.setAttribute("r", "3");
    vertexC.setAttribute("fill", "#e53e3e");

    // Vertex labels
    const labelA = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelA.setAttribute("x", ax);
    labelA.setAttribute("y", ay - 10);
    labelA.setAttribute("text-anchor", "middle");
    labelA.setAttribute("fill", "#2d3748");
    labelA.setAttribute("font-size", "18");
    labelA.setAttribute("font-weight", "bold");
    labelA.textContent = "A";

    const labelB = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelB.setAttribute("x", bx - 15);
    labelB.setAttribute("y", by + 5);
    labelB.setAttribute("text-anchor", "middle");
    labelB.setAttribute("fill", "#2d3748");
    labelB.setAttribute("font-size", "18");
    labelB.setAttribute("font-weight", "bold");
    labelB.textContent = "B";

    const labelC = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelC.setAttribute("x", cx + 15);
    labelC.setAttribute("y", cy + 5);
    labelC.setAttribute("text-anchor", "middle");
    labelC.setAttribute("fill", "#2d3748");
    labelC.setAttribute("font-size", "18");
    labelC.setAttribute("font-weight", "bold");
    labelC.textContent = "C";

    // Angle arcs
    if (data.angleA) {
        const arcA = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arcA.setAttribute("d", `M ${ax - 20} ${ay + 25} A 25 25 0 0 1 ${ax + 20} ${ay + 25}`);
        arcA.setAttribute("stroke", "#805ad5");
        arcA.setAttribute("stroke-width", "2");
        arcA.setAttribute("fill", "none");
        svg.appendChild(arcA);
    }

    if (data.angleB) {
        const arcB = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arcB.setAttribute("d", `M ${bx + 25} ${by} A 25 25 0 0 1 ${bx + 18} ${by - 20}`);
        arcB.setAttribute("stroke", "#3182ce");
        arcB.setAttribute("stroke-width", "2");
        arcB.setAttribute("fill", "none");

        const angleTextB = document.createElementNS("http://www.w3.org/2000/svg", "text");
        angleTextB.setAttribute("x", bx + 35);
        angleTextB.setAttribute("y", by - 5);
        angleTextB.setAttribute("fill", "#3182ce");
        angleTextB.setAttribute("font-size", "14");
        angleTextB.setAttribute("font-weight", "bold");
        angleTextB.textContent = `${data.angleB}°`;

        svg.appendChild(arcB);
        svg.appendChild(angleTextB);
    }

    if (data.angleC) {
        const arcC = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arcC.setAttribute("d", `M ${cx - 25} ${cy} A 25 25 0 0 0 ${cx - 18} ${cy - 20}`);
        arcC.setAttribute("stroke", "#38a169");
        arcC.setAttribute("stroke-width", "2");
        arcC.setAttribute("fill", "none");

        const angleTextC = document.createElementNS("http://www.w3.org/2000/svg", "text");
        angleTextC.setAttribute("x", cx - 35);
        angleTextC.setAttribute("y", cy - 5);
        angleTextC.setAttribute("fill", "#38a169");
        angleTextC.setAttribute("font-size", "14");
        angleTextC.setAttribute("font-weight", "bold");
        angleTextC.textContent = `${data.angleC}°`;

        svg.appendChild(arcC);
        svg.appendChild(angleTextC);
    }

    svg.appendChild(triangle);
    svg.appendChild(vertexA);
    svg.appendChild(vertexB);
    svg.appendChild(vertexC);
    svg.appendChild(labelA);
    svg.appendChild(labelB);
    svg.appendChild(labelC);

    return svg;
}

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

    // Render diagram if present
    const diagramContainer = document.querySelector('.question-image');
    if (question.diagramImage) {
        diagramContainer.innerHTML = `<img src="${question.diagramImage}" alt="Question diagram" class="question-diagram-img" />`;
    } else if (question.diagram) {
        const svg = createSVGDiagram(question.diagram);
        if (svg) {
            diagramContainer.innerHTML = '';
            diagramContainer.appendChild(svg);
        } else {
            diagramContainer.innerHTML = '<div class="image-placeholder"><span>📊 Diagram not available</span></div>';
        }
    } else {
        diagramContainer.innerHTML = '<div class="image-placeholder"><span>📊 No diagram for this question</span></div>';
    }

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
    khanLessonsDiv.innerHTML = `<h4>🎓 Khan Academy Lessons</h4>`;

    concept.khan_academy_lessons.forEach((lesson, index) => {
        const lessonItem = document.createElement('div');
        lessonItem.className = 'lesson-item-container';

        const isWatched = state.watchedLessons[conceptId]?.[index];

        lessonItem.innerHTML = `
            <a href="${lesson.url}" target="_blank" class="lesson-item">
                <span class="lesson-icon">${lesson.type === 'video' ? '▶️' : '✏️'}</span>
                <div class="lesson-info">
                    <div class="lesson-title">${lesson.title}</div>
                    <div class="lesson-meta">${lesson.type === 'video' ? 'Video' : 'Practice'} • ${lesson.duration} • Earn ${lesson.reward_minutes || 2} min</div>
                </div>
                <span class="lesson-badge">${isWatched ? '✓ Watched' : 'Watch'}</span>
            </a>
            ${!isWatched ? `
                <button class="btn-mark-watched" data-concept="${conceptId}" data-lesson="${index}">
                    ✓ I watched this (earn ${lesson.reward_minutes || 2} min)
                </button>
            ` : ''}
        `;

        khanLessonsDiv.appendChild(lessonItem);
    });

    // Common mistakes
    const mistakesDiv = document.getElementById('commonMistakes');
    mistakesDiv.innerHTML = `
        <strong>⚠️ Common Mistakes:</strong>
        <ul>
            ${concept.common_mistakes.map(mistake => `<li>${mistake}</li>`).join('')}
        </ul>
    `;

    // Concept Check section
    if (concept.concept_check && !state.conceptsChecked[conceptId]) {
        const conceptCheckDiv = document.createElement('div');
        conceptCheckDiv.className = 'concept-check-section';
        conceptCheckDiv.id = 'conceptCheckSection';
        conceptCheckDiv.innerHTML = `
            <h4>✅ Concept Check - Earn 3 Bonus Minutes!</h4>
            <p class="concept-check-intro">Show you understand this concept to unlock bonus rewards</p>
            <button class="btn-primary" id="startConceptCheckBtn">Start Concept Check</button>
        `;
        elements.helpModalBody.querySelector('.concept-breakdown').appendChild(conceptCheckDiv);
    } else if (state.conceptsChecked[conceptId]) {
        const passedDiv = document.createElement('div');
        passedDiv.className = 'concept-check-passed';
        passedDiv.innerHTML = `
            <h4>✅ Concept Check Passed!</h4>
            <p>You've mastered this concept!</p>
        `;
        elements.helpModalBody.querySelector('.concept-breakdown').appendChild(passedDiv);
    }

    // Show modal
    elements.helpModal.style.display = 'block';

    // Attach event listeners for lesson tracking buttons
    document.querySelectorAll('.btn-mark-watched').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const conceptId = e.target.dataset.concept;
            const lessonIndex = parseInt(e.target.dataset.lesson);
            markLessonWatched(conceptId, lessonIndex);
        });
    });

    // Attach event listener for concept check button
    const conceptCheckBtn = document.getElementById('startConceptCheckBtn');
    if (conceptCheckBtn) {
        conceptCheckBtn.addEventListener('click', () => showConceptCheck(conceptId));
    }
}

// Mark a lesson as watched and award time
function markLessonWatched(conceptId, lessonIndex) {
    const concept = khanAcademyLessons[conceptId];
    if (!concept) return;

    const lesson = concept.khan_academy_lessons[lessonIndex];
    if (!lesson) return;

    // Initialize tracking if needed
    if (!state.watchedLessons[conceptId]) {
        state.watchedLessons[conceptId] = {};
    }

    // Mark as watched
    state.watchedLessons[conceptId][lessonIndex] = true;

    // Award time
    const rewardMinutes = lesson.reward_minutes || 2;
    state.timeBank += rewardMinutes;
    updateUI();

    // Show feedback
    showNotification(`🎉 +${rewardMinutes} minutes earned! Keep learning!`);

    // Refresh the modal to update UI
    closeHelpModal();
    setTimeout(() => showHelpModal(conceptId), 100);
}

// Show concept check mini-quiz
function showConceptCheck(conceptId) {
    const concept = khanAcademyLessons[conceptId];
    if (!concept || !concept.concept_check) return;

    const check = concept.concept_check;

    const conceptCheckSection = document.getElementById('conceptCheckSection');
    conceptCheckSection.innerHTML = `
        <h4>✅ Concept Check</h4>
        <p class="concept-check-question">${check.question}</p>
        <div class="concept-check-options">
            ${check.options.map((option, index) => `
                <button class="concept-check-option" data-index="${index}">
                    ${String.fromCharCode(65 + index)}. ${option}
                </button>
            `).join('')}
        </div>
    `;

    // Add event listeners to answer buttons
    document.querySelectorAll('.concept-check-option').forEach((btn, index) => {
        btn.addEventListener('click', () => checkConceptAnswer(conceptId, index));
    });
}

// Check concept check answer
function checkConceptAnswer(conceptId, selectedIndex) {
    const concept = khanAcademyLessons[conceptId];
    const check = concept.concept_check;

    const isCorrect = selectedIndex === check.correct_answer;

    if (isCorrect) {
        // Mark concept as checked
        state.conceptsChecked[conceptId] = true;

        // Award bonus time
        state.timeBank += 3;
        state.totalXP += 50;
        updateUI();

        const conceptCheckSection = document.getElementById('conceptCheckSection');
        conceptCheckSection.innerHTML = `
            <div class="concept-check-result correct">
                <div class="result-icon">✓</div>
                <h4>Correct!</h4>
                <p>${check.explanation}</p>
                <div class="reward-earned">
                    <span class="reward-icon">🎮</span>
                    <span>+3 minutes earned!</span>
                </div>
                <div class="reward-earned">
                    <span class="reward-icon">⭐</span>
                    <span>+50 XP earned!</span>
                </div>
            </div>
        `;

        showNotification('🎉 Concept Check passed! +3 minutes & +50 XP!');
    } else {
        const conceptCheckSection = document.getElementById('conceptCheckSection');
        conceptCheckSection.innerHTML = `
            <div class="concept-check-result incorrect">
                <div class="result-icon">✗</div>
                <h4>Not quite</h4>
                <p>${check.explanation}</p>
                <button class="btn-secondary" id="retryConceptCheckBtn">Try Again</button>
            </div>
        `;

        document.getElementById('retryConceptCheckBtn').addEventListener('click', () => {
            showConceptCheck(conceptId);
        });
    }
}

// Show notification toast
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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
