

let currentEval = null;
let currentQuestionIndex = 0;
let currentScore = 0;
let evalTimer = null;
let timeRemaining = 0;
let timerEnabled = true;


// Stores evaluation progress: { evalId: { completed: boolean, highscore: number, difficulty: string } }
let evalProgress = JSON.parse(localStorage.getItem('PyNeo-eval-progress')) || {};

document.addEventListener('DOMContentLoaded', () => {
    checkHiddenChallenges(); // Check unlocks on load
    updateUserColorBasedOnDifficulty(); // Ensure color is synced with rank
    renderEvaluations();
});

let currentFilterDifficulty = 'todos';

function filterEvaluations(difficulty) {
    currentFilterDifficulty = difficulty;


    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnText = btn.innerText.toLowerCase();
        if (btnText === difficulty.toLowerCase()) {
            btn.classList.add('active');
        } else if (difficulty === 'todos' && btnText === 'todos') {
            btn.classList.add('active');
        }
    });

    renderEvaluations();
}

function searchEvaluations() {
    renderEvaluations();
}

function renderEvaluations() {
    const grid = document.getElementById('evaluations-grid');
    if (!grid) return;

    const searchTerm = (document.getElementById('eval-search')?.value || '').toLowerCase();

    grid.innerHTML = '';


    const filteredEvals = window.evaluations.filter(evalData => {
        // Hide "oculto" difficulty unless unlocked
        if (evalData.difficulty === 'oculto' && !isHiddenUnlocked()) {
            return false;
        }

        const matchesFilter = currentFilterDifficulty === 'todos' || evalData.difficulty === currentFilterDifficulty;
        const matchesSearch = evalData.title.toLowerCase().includes(searchTerm) ||
            evalData.description.toLowerCase().includes(searchTerm);
        return matchesFilter && matchesSearch;
    });


    const sortedEvals = filteredEvals.sort((a, b) => a.id - b.id);

    if (sortedEvals.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-12 text-center neon-box">
                <i class="fas fa-search mb-4 text-4xl text-gray-700"></i>
                <p class="text-gray-500">No se encontraron ejercicios que coincidan con tu búsqueda.</p>
                <button onclick="resetFilters()" class="mt-4 text-neon-green hover:underline">Ver todos los ejercicios</button>
            </div>
        `;
        return;
    }

    sortedEvals.forEach(evalData => {
        const card = document.createElement('div');

        let colorClass = 'green';
        if (evalData.difficulty === 'intermedio') colorClass = 'yellow';
        if (evalData.difficulty === 'avanzado') colorClass = 'red';
        if (evalData.difficulty === 'experto') colorClass = 'purple';
        if (evalData.difficulty === 'máster') colorClass = 'cyan';

        card.className = `neon-box p-6 transition-all cursor-pointer hover:scale-105 duration-300 relative overflow-hidden group reveal`;
        if (colorClass === 'purple') card.classList.add('hover:border-purple-500');
        else if (colorClass === 'cyan') card.classList.add('hover:border-cyan-500');
        else if (colorClass === 'red') card.classList.add('hover:border-red-500');
        else if (colorClass === 'yellow') card.classList.add('hover:border-yellow-500');
        else card.classList.add('hover:border-green-500');

        card.onclick = () => showEvalOptions(evalData.id);

        card.innerHTML = `
            <div class="absolute inset-0 bg-${colorClass}-500/5 group-hover:bg-${colorClass}-500/10 transition-all"></div>
            <div class="relative z-10">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-bold px-3 py-1 rounded-full bg-gray-800 text-white border border-gray-600 uppercase tracking-wider ${evalData.difficulty === 'oculto' ? 'text-red-500 border-red-500 animate-pulse' : ''}">${evalData.difficulty}</span>
                    <div class="flex gap-2">
                        ${isEvalCompleted(evalData.id) ? '<i class="fas fa-check-circle text-neon-green" title="Completado"></i>' : ''}
                        <i class="fas ${evalData.icon} text-2xl text-gray-300 group-hover:text-white transition-colors"></i>
                    </div>
                </div>
                <h3 class="text-xl font-bold text-white mb-3 group-hover:text-neon-green transition-colors">${evalData.title}</h3>
                <p class="text-gray-400 text-sm mb-4 h-10 overflow-hidden">
                    ${evalData.description}
                </p>
                <div class="flex items-center justify-between text-xs text-gray-500 border-t border-gray-700 pt-3">
                    <span><i class="fas fa-tasks mr-1"></i> ${evalData.questions.length} preguntas</span>
                    <span><i class="fas fa-trophy mr-1 text-yellow-500"></i> ${getEvalHighscore(evalData.id)} pts</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });


    setTimeout(() => {
        grid.querySelectorAll('.reveal').forEach((el, i) => {
            setTimeout(() => el.classList.add('active'), i * 15);
        });
    }, 1);
}

function resetFilters() {
    const searchInput = document.getElementById('eval-search');
    if (searchInput) searchInput.value = '';
    filterEvaluations('todos');
}

function showEvalOptions(id) {

    const modalId = 'eval-options-modal';
    let modal = document.getElementById(modalId);

    if (modal) modal.remove();

    const evalData = window.evaluations.find(e => e.id === id);
    if (!evalData) return;

    modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in';
    modal.innerHTML = `
        <div class="bg-[#0a0a0a] border border-neon-green/30 rounded-xl p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(69,252,225,0.1)]">
            <button onclick="this.closest('#${modalId}').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white">
                <i class="fas fa-times text-xl"></i>
            </button>
            
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas ${evalData.icon} text-3xl text-neon-green"></i>
                </div>
                <h2 class="text-2xl font-bold text-white mb-2">${evalData.title}</h2>
                <p class="text-gray-400 text-sm">Selecciona tu modo de juego</p>
            </div>
            
            <div class="space-y-4">
                <button onclick="startEvaluation(${id}, true)" class="w-full neon-box p-4 hover:bg-neon-green/10 transition-all flex items-center justify-between group">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 group-hover:text-red-300">
                            <i class="fas fa-stopwatch"></i>
                        </div>
                        <div class="text-left">
                            <h4 class="font-bold text-white">Modo Reto</h4>
                            <p class="text-xs text-gray-400">Con límite de tiempo (${evalData.timeLimit} min)</p>
                        </div>
                    </div>
                    <i class="fas fa-chevron-right text-gray-600 group-hover:text-white"></i>
                </button>
                
                <button onclick="startEvaluation(${id}, false)" class="w-full neon-box p-4 hover:bg-neon-green/10 transition-all flex items-center justify-between group">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:text-blue-300">
                            <i class="fas fa-infinity"></i>
                        </div>
                        <div class="text-left">
                            <h4 class="font-bold text-white">Modo Práctica</h4>
                            <p class="text-xs text-gray-400">Sin presión de tiempo</p>
                        </div>
                    </div>
                    <i class="fas fa-chevron-right text-gray-600 group-hover:text-white"></i>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function startEvaluation(id, useTimer) {
    const modal = document.getElementById('eval-options-modal');
    if (modal) modal.remove();

    currentEval = window.evaluations.find(e => e.id === id);
    if (!currentEval) return;

    currentQuestionIndex = 0;
    currentScore = 0;
    timerEnabled = useTimer;

    // Resetear banderas de pasada para evitar bug de reintentos infinitos
    currentEval.questions.forEach(q => delete q._passed);

    if (timerEnabled) {
        timeRemaining = currentEval.timeLimit * 60;
    } else {
        timeRemaining = 0;
    }


    document.getElementById('exercises-section').classList.add('hidden');
    document.getElementById('hero-section').classList.add('hidden');
    document.getElementById('modules-section').classList.add('hidden');
    document.getElementById('evaluation-content').classList.remove('hidden');


    const nav = document.getElementById('main-nav');
    if (nav) nav.style.display = 'none';

    document.getElementById('eval-title').innerText = currentEval.title;
    document.getElementById('current-score').innerText = '0';


    const timerDiv = document.getElementById('eval-timer');
    if (timerEnabled) {
        timerDiv.classList.remove('hidden');
    } else {
        timerDiv.classList.add('hidden');
    }

    loadQuestion();
    startTimer();

    window.scrollTo(0, 0);
}

function closeEvaluation() {
    stopTimer();
    currentEval = null;


    const nav = document.getElementById('main-nav');
    if (nav) nav.style.display = 'block';

    document.getElementById('evaluation-content').classList.add('hidden');
    document.getElementById('exercises-section').classList.remove('hidden');
    document.getElementById('hero-section').classList.remove('hidden');
    document.getElementById('modules-section').classList.remove('hidden');
}

function loadQuestion() {
    if (!currentEval) return;


    const progress = ((currentQuestionIndex) / currentEval.questions.length) * 100;
    document.getElementById('eval-progress-bar').style.width = `${progress}%`;

    if (currentQuestionIndex >= currentEval.questions.length) {
        finishEvaluation();
        return;
    }

    const question = currentEval.questions[currentQuestionIndex];
    const container = document.getElementById('question-content');

    container.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="flex flex-col">
                <span class="text-gray-500 text-sm font-mono">Pregunta ${currentQuestionIndex + 1} / ${currentEval.questions.length}</span>
                ${currentEval.id < 9000 ? `
                <button onclick="showHelp()" class="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                    <i class="fas fa-lightbulb"></i> ¿Necesitas una pista?
                </button>
                ` : ''}
            </div>
            <span class="bg-neon-green/20 text-neon-green border border-neon-green/50 text-xs px-3 py-1 rounded font-bold">+${question.points} PTS</span>
        </div>
        <div class="text-lg leading-relaxed">
            ${question.question}
        </div>
    `;


    const editorContainer = document.querySelector('.code-editor');
    const outputContainer = document.getElementById('eval-output');

    editorContainer.classList.remove('hidden');
    outputContainer.classList.remove('hidden');

    document.getElementById('eval-code-editor').value = '';
    outputContainer.innerHTML = '<div class="text-gray-600 italic text-sm text-center py-4">El resultado de tu código aparecerá aquí...</div>';
}

function startTimer() {
    stopTimer();
    if (!timerEnabled) return;

    updateTimerDisplay();

    evalTimer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            stopTimer();

            finishEvaluation(true);
        }
    }, 1000);
}

function stopTimer() {
    if (evalTimer) {
        clearInterval(evalTimer);
        evalTimer = null;
    }
}

function updateTimerDisplay() {
    if (!timerEnabled) return;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const timerElement = document.getElementById('eval-timer').querySelector('span');
    if (timerElement) timerElement.innerText = display;

    if (timeRemaining < 60) {
        document.getElementById('eval-timer').classList.add('text-red-500', 'animate-pulse');
        document.getElementById('eval-timer').classList.remove('text-neon-green');
    } else {
        document.getElementById('eval-timer').classList.remove('text-red-500', 'animate-pulse');
        document.getElementById('eval-timer').classList.add('text-neon-green');
    }
}

function runEvaluation() {
    const code = document.getElementById('eval-code-editor').value;
    const outputElement = document.getElementById('eval-output');

    if (!code.trim()) {
        outputElement.innerHTML = '<p class="text-yellow-400 font-bold"><i class="fas fa-exclamation-triangle mr-2"></i>Escribe código para continuar.</p>';
        return;
    }

    outputElement.innerHTML = '<p class="text-neon-green animate-pulse"><i class="fas fa-terminal mr-2"></i>Ejecutando script...</p>';

    let output = '';

    Sk.configure({
        output: function (text) { output += text; },
        read: function (x) {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'";
            return Sk.builtinFiles["files"][x];
        },
        inputfun: function (prompt) {
            return new Promise((resolve) => {
                // Use global customPrompt if available (defined in app.js)
                if (typeof customPrompt === 'function') {
                    customPrompt(prompt || "Input:").then((userInput) => {
                        output += (userInput || "") + "\n";
                        resolve(userInput || "");
                    });
                } else {
                    const userInput = window.prompt(prompt || "Input:");
                    output += (userInput || "") + "\n";
                    resolve(userInput || "");
                }
            });
        }
    });

    const runBtn = document.querySelector('button[onclick="runEvaluation()"]');
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody("<stdin>", false, code, true);
    }).then(
        function (mod) {
            const escapedOutput = output
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

            outputElement.innerHTML = `
                <div class="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
                    <span class="text-xs font-bold text-gray-500 uppercase">Terminal Output</span>
                    <span class="text-xs text-gray-600">Python 3.x</span>
                </div>
                <pre class="text-white font-mono text-sm whitespace-pre-wrap">${escapedOutput}</pre>
            `;

            checkAnswer(code, output.trim());
        },
        function (err) {
            outputElement.innerHTML = `
                <div class="bg-red-500/10 border border-red-500/50 rounded p-3">
                    <p class="text-red-400 font-bold text-sm"><i class="fas fa-bug mr-2"></i>Error de Ejecución</p>
                    <pre class="text-red-300 mt-2 text-xs font-mono overflow-auto">${err.toString()}</pre>
                </div>
            `;
        }
    ).finally(() => {
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });
}

function checkAnswer(code, output) {
    const currentQ = currentEval.questions[currentQuestionIndex];
    if (currentQ._passed) return; // Si ya fue validada y punteada, ignorar

    let isCorrect = false;

    // --- LOGICA FUZZY (Flexible con espacios y mayúsculas) ---
    const fuzzyClean = (text) => {
        return text.toLowerCase()
            .split('\n')
            .map(line => line.replace(/\s+/g, ' ').trim())
            .filter(line => line.length > 0)
            .join('\n');
    };

    const cleanOutput = fuzzyClean(output);
    const cleanExpected = fuzzyClean(currentQ.expectedOutput);

    // Verificamos si el output esperado está contenido en lo que el usuario imprimió
    if (cleanOutput === cleanExpected || cleanOutput.includes(cleanExpected)) {
        isCorrect = true;
    }

    // --- DETECCIÓN DE HARDCODING (Trampa de solo imprimir) ---
    // Verificamos si hay lógica real: variables, operadores, estructuras de control, etc.
    const hasLogic = /(=|\+|\-|\*|\/|if |for |while |def |import |\[|\]|\{|\})/.test(code);

    // Verificamos si el código solo consiste en prints de texto literal
    const onlyPrints = code.split('\n').every(line => {
        const trimmed = line.trim();
        return trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith("print(");
    });

    // Si el output es correcto pero NO hay lógica (es solo print) y el ejercicio otorga puntos significativos
    const isHardcoded = onlyPrints && !hasLogic && currentQ.points > 10;

    if (isCorrect && isHardcoded) {
        const outputElement = document.getElementById('eval-output');
        outputElement.innerHTML += `
            <div class="mt-4 pt-4 border-t border-gray-700 animate-slide-up">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg border border-blue-500/50">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div>
                        <p class="text-blue-400 font-bold text-lg">Lógica no detectada</p>
                        <p class="text-xs text-gray-400">Aunque el resultado es correcto, no se puede simplemente imprimir el texto esperado.</p>
                    </div>
                </div>
                <div class="bg-blue-500/10 border border-blue-500/30 p-3 rounded mb-3">
                    <p class="text-xs text-blue-200">
                        Debes resolver el problema usando programación (variables, cálculos o estructuras de datos). 
                        ¡Demuestra tu creatividad resolviéndolo a tu manera!
                    </p>
                </div>
                <div class="flex gap-2">
                    <button onclick="runEvaluation()" class="flex-1 border border-white/20 hover:border-white text-white py-2 rounded transition-all text-sm">
                        <i class="fas fa-edit mr-2"></i>Intentar con lógica
                    </button>
                    <button onclick="nextQuestion()" class="flex-1 text-gray-500 hover:text-white py-2 transition-all text-sm">
                        Saltar (+0 pts) <i class="fas fa-forward ml-1"></i>
                    </button>
                </div>
            </div>
        `;
        return; // No se otorgan puntos por hardcoding
    }

    // Nota: Ignoramos el bloqueo estricto de requiredCode para permitir múltiples soluciones,
    // pero el sistema aún valida que el output final sea el correcto.

    const outputElement = document.getElementById('eval-output');

    if (isCorrect) {
        currentQ._passed = true;
        currentScore += currentQ.points;
        const scoreEl = document.getElementById('current-score');


        scoreEl.classList.add('text-neon-green', 'scale-125');
        setTimeout(() => scoreEl.classList.remove('scale-125'), 300);
        scoreEl.innerText = currentScore;

        outputElement.innerHTML += `
            <div class="mt-4 pt-4 border-t border-gray-700 animate-slide-up">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-lg">
                        <i class="fas fa-check"></i>
                    </div>
                    <div>
                        <p class="text-neon-green font-bold text-lg">¡Correcto!</p>
                        <p class="text-xs text-gray-500">+${currentQ.points} puntos añadidos</p>
                    </div>
                </div>
                <button onclick="nextQuestion()" class="w-full btn-neon py-3 rounded text-white font-bold hover:bg-white hover:text-black transition-all">
                    CONTINUAR <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        `;
    } else {
        outputElement.innerHTML += `
             <div class="mt-4 pt-4 border-t border-gray-700 animate-slide-up">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold text-lg border border-red-500/50">
                        <i class="fas fa-times"></i>
                    </div>
                    <div>
                        <p class="text-red-400 font-bold text-lg">Respuesta Incorrecta</p>
                        <p class="text-xs text-gray-500">Revisa tu código e inténtalo de nuevo</p>
                    </div>
                </div>
                
                <div class="bg-gray-900/50 p-3 rounded mb-3 border border-gray-700">
                    <p class="text-xs text-gray-400 mb-1">Se esperaba ver:</p>
                    <pre class="text-neon-green font-mono text-xs">${currentQ.expectedOutput}</pre>
                </div>

                <div class="flex gap-2">
                    <button onclick="runEvaluation()" class="flex-1 border border-white/20 hover:border-white text-white py-2 rounded transition-all text-sm">
                        <i class="fas fa-undo mr-2"></i>Reintentar
                    </button>
                    <button onclick="nextQuestion()" class="flex-1 text-gray-500 hover:text-white py-2 transition-all text-sm">
                        Saltar (+0 pts) <i class="fas fa-forward ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();


    const container = document.getElementById('evaluation-content');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
    }
}

function finishEvaluation(timeout = false) {
    stopTimer();
    document.getElementById('eval-progress-bar').style.width = '100%';

    const container = document.getElementById('question-content');
    const maxScore = currentEval.questions.reduce((acc, q) => acc + q.points, 0);
    const percentage = Math.round((currentScore / maxScore) * 100);

    // STREAK UPDATE
    if (typeof updateStreak === 'function') {
        updateStreak();
    }

    let message = "";
    let color = "";
    let icon = "";

    if (timeout) {
        message = "¡Se acabó el tiempo! Pero buen esfuerzo.";
        color = "text-yellow-400";
        icon = "fa-hourglass-end";
    } else if (percentage >= 90) {
        message = "¡IMPRESIONANTE!";
        color = "text-neon-green";
        icon = "fa-trophy";
    } else if (percentage >= 70) {
        message = "¡MUY BIEN!";
        color = "text-blue-400";
        icon = "fa-thumbs-up";
    } else {
        message = "Sigue practicando. ¡No te rindas!";
        color = "text-red-400";
        icon = "fa-dumbbell";
    }


    // SAVE PROGRESS LOGIC
    if (percentage >= 70) {
        saveEvalProgress(currentEval, currentScore);

        // Update User Color Logic based on highest difficulty completed
        updateUserColorBasedOnDifficulty(currentEval.difficulty);
    }

    container.innerHTML = `
        <div class="text-center py-8 animate-fade-in">
            <div class="w-24 h-24 ${color} bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-lg border-2 border-current">
                <i class="fas ${icon}"></i>
            </div>
            
            <h3 class="text-4xl font-black text-white mb-2">Evaluación Finalizada</h3>
            <p class="text-xl text-gray-300 mb-8 max-w-lg mx-auto">${message}</p>
            
            <div class="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
                <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div class="text-3xl font-black text-white mb-1">${percentage}%</div>
                    <div class="text-xs text-gray-500 uppercase">Precisión</div>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div class="text-3xl font-black text-white mb-1">${currentScore}</div>
                    <div class="text-xs text-gray-500 uppercase">Puntos Totales</div>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div class="text-3xl font-black text-white mb-1">
                        ${timerEnabled ? Math.floor((currentEval.timeLimit * 60 - timeRemaining) / 60) + ' min' : '--'}
                    </div>
                    <div class="text-xs text-gray-500 uppercase">Tiempo</div>
                </div>
            </div>
            
            ${checkBadges(percentage)}

            <button onclick="closeEvaluation()" class="btn-neon px-8 py-4 rounded-lg font-bold text-white uppercase tracking-wider text-lg shadow-lg hover:shadow-neon-green/50 transition-all transform hover:-translate-y-1">
                Volver al Menú Principal
            </button>
        </div>
    `;


    document.querySelector('.code-editor').classList.add('hidden');
    document.getElementById('eval-output').classList.add('hidden');
}

// --- HELPER FUNCTIONS FOR PROGRESS ---

function saveEvalProgress(evaluation, score) {
    if (!evalProgress[evaluation.id]) {
        evalProgress[evaluation.id] = { completed: false, highscore: 0, difficulty: evaluation.difficulty };
    }

    evalProgress[evaluation.id].completed = true;
    evalProgress[evaluation.id].highscore = Math.max(evalProgress[evaluation.id].highscore, score);

    localStorage.setItem('PyNeo-eval-progress', JSON.stringify(evalProgress));

    checkHiddenChallenges(); // Re-check unlocks
}

function isEvalCompleted(id) {
    return evalProgress[id] && evalProgress[id].completed;
}

function getEvalHighscore(id) {
    return evalProgress[id] ? evalProgress[id].highscore : 0;
}

function countCompletedByDifficulty(difficulty) {
    return Object.values(evalProgress).filter(p => p.completed && p.difficulty === difficulty).length;
}

function isHiddenUnlocked() {
    // Unlock if ALL advanced evaluations are completed
    const totalAdvanced = window.evaluations.filter(e => e.difficulty === 'avanzado').length;
    const completedAdvanced = countCompletedByDifficulty('avanzado');
    return totalAdvanced > 0 && completedAdvanced >= totalAdvanced;
}

function checkHiddenChallenges() {
    if (isHiddenUnlocked()) {
        const secretBtn = document.getElementById('secret-section-btn');
        const notification = document.getElementById('unlock-notification');

        if (secretBtn && secretBtn.classList.contains('hidden')) {
            secretBtn.classList.remove('hidden');
            if (notification) {
                notification.classList.remove('hidden');
                // Hide after 5 seconds
                setTimeout(() => notification.classList.add('hidden'), 5000);
            }
        } else if (secretBtn) {
            secretBtn.classList.remove('hidden');
        }
    }
}

function updateUserColorBasedOnDifficulty(difficulty) {
    // Priority: master > experto > avanzado > intermedio > principiante (requiere intro) > novato (blanco)
    let userColor = '#ffffff'; // Default white (novato)
    let highest = 0; // 0 = novato

    // 1. Check Principiante Requirement: Intro Module (ID 1) + 1 Principiante Eval
    const modulesProgress = JSON.parse(localStorage.getItem('PyNeo-progress')) || {};
    const introCompleted = modulesProgress[1] || modulesProgress['1']; // Check ID 1
    const beginnerEvals = Object.values(evalProgress).filter(p => p.completed && p.difficulty === 'principiante').length;

    if (introCompleted && beginnerEvals >= 1) {
        highest = 1;
        userColor = '#4ade80'; // Green
    }

    const priorities = { 'intermedio': 2, 'avanzado': 3, 'experto': 4, 'máster': 5, 'oculto': 6 };

    Object.values(evalProgress).forEach(p => {
        if (p.completed && priorities[p.difficulty] > highest) {
            highest = priorities[p.difficulty];

            if (p.difficulty === 'intermedio') userColor = '#eab308'; // Yellow
            if (p.difficulty === 'avanzado') userColor = '#ef4444'; // Red
            if (p.difficulty === 'experto') userColor = '#a855f7'; // Purple
            if (p.difficulty === 'máster') userColor = '#06b6d4'; // Cyan
            if (p.difficulty === 'oculto') userColor = 'glitch-effect'; // Special signal
        }
    });

    localStorage.setItem('PyNeo-user-color', userColor);
}


function showHelp() {
    const question = currentEval.questions[currentQuestionIndex];

    // Si no hay ayuda específica, generamos una basada en el contexto (o mensaje default)
    const helpContent = question.help || {
        title: "Guía de Resolución",
        concept: "Este ejercicio busca poner en práctica tus habilidades de lógica y sintaxis en Python.",
        steps: [
            "Lee atentamente los requisitos funcionales.",
            "Identifica qué datos necesitas pedir al usuario (input).",
            "Aplica las fórmulas o condiciones mencionadas.",
            "Asegúrate de que los mensajes de salida coincidan exactamente con el ejemplo."
        ],
        tip: "Recuerda que Python distingue entre mayúsculas y minúsculas."
    };

    const modalId = 'help-modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in';
    modal.innerHTML = `
        <div class="bg-[#0f0f0f] border border-blue-500/30 rounded-2xl p-8 max-w-2xl w-full relative shadow-[0_0_50px_rgba(59,130,246,0.2)] overflow-hidden">
            <div class="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
            
            <button onclick="this.closest('#${modalId}').remove()" class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                <i class="fas fa-times text-xl"></i>
            </button>
            
            <div class="relative z-10">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                        <i class="fas fa-graduation-cap text-2xl"></i>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-white">${helpContent.title}</h2>
                        <p class="text-blue-400/60 text-xs uppercase tracking-widest font-bold">Guía de Aprendizaje</p>
                    </div>
                </div>

                <div class="space-y-6">
                    <section>
                        <h4 class="text-sm font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                            <i class="fas fa-book-open text-blue-500"></i> Concepto Clave
                        </h4>
                        <p class="text-gray-300 leading-relaxed">${helpContent.concept}</p>
                    </section>

                    <section>
                        <h4 class="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                            <i class="fas fa-list-ol text-blue-500"></i> Paso a Paso
                        </h4>
                        <div class="space-y-3">
                            ${(helpContent.steps || []).map((step, i) => `
                                <div class="flex gap-4 items-start bg-white/5 p-3 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors">
                                    <span class="bg-blue-500 text-black font-black w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs mt-0.5">${i + 1}</span>
                                    <p class="text-gray-300 text-sm">${step}</p>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    ${helpContent.tip ? `
                    <div class="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-4 items-center">
                        <i class="fas fa-lightbulb text-yellow-500 text-2xl"></i>
                        <p class="text-yellow-200/80 text-sm font-medium">${helpContent.tip}</p>
                    </div>
                    ` : ''}
                </div>

                <div class="mt-8 pt-6 border-t border-white/5 text-center">
                    <button onclick="this.closest('#${modalId}').remove()" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
                        ¡ENTENDIDO! VOLVER AL CÓDIGO
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function checkBadges(percentage) {
    if (percentage < 100) return '';

    const totalCompleted = Object.values(evalProgress).filter(p => p.completed).length;
    let badge = '';

    if (totalCompleted === 10) {
        badge = `
            <div class="mb-8 p-4 bg-green-500/10 border border-green-500/50 rounded-xl animate-bounce">
                <div class="text-5xl mb-2">🌱</div>
                <h4 class="text-white font-bold">¡Nueva Insignia: SEMILLA!</h4>
                <p class="text-xs text-gray-400">Completaste 10 ejercicios prácticos.</p>
            </div>
        `;
    }
    if (totalCompleted === 25) {
        badge = `
            <div class="mb-8 p-4 bg-blue-500/10 border border-blue-500/50 rounded-xl animate-bounce">
                <div class="text-5xl mb-2">🐍</div>
                <h4 class="text-white font-bold">¡Nueva Insignia: SERPIENTE!</h4>
                <p class="text-xs text-gray-400">Completaste 25 ejercicios prácticos.</p>
            </div>
        `;
    }
    if (totalCompleted === 50) {
        badge = `
            <div class="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl animate-bounce">
                <div class="text-5xl mb-2">👑</div>
                <h4 class="text-white font-bold">¡Nueva Insignia: REY!</h4>
                <p class="text-xs text-gray-400">Completaste 40 ejercicios prácticos.</p>
            </div>
        `;
    }

    return badge;
}
