// API Key and Gemini instance will be loaded dynamically

document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle?.querySelector('i');

    const toggleTheme = () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            body.removeAttribute('data-theme');
            document.documentElement.classList.remove('dark');
            icon?.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
            icon?.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    };

    if (localStorage.getItem('theme') === 'dark') {
        body.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
        icon?.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle?.addEventListener('click', toggleTheme);

    // --- Step-by-Step Wizard Logic ---
    const wizardSections = Array.from(document.querySelectorAll('section'));
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const progressBar = document.getElementById('scroll-progress');
    let currentStep = 0;

    const updateWizard = () => {
        wizardSections.forEach((sec, idx) => {
            if (idx === currentStep) sec.classList.add('wizard-active');
            else sec.classList.remove('wizard-active');
        });

        navLinks.forEach((link, idx) => {
            if (idx === currentStep) {
                link.classList.add('text-primary');
                link.classList.remove('text-secondary');
            } else {
                link.classList.remove('text-primary');
                link.classList.add('text-secondary');
            }
        });

        if (progressBar) {
            const progress = (currentStep / (wizardSections.length - 1)) * 100;
            progressBar.style.width = progress + '%';
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.addEventListener('click', (e) => {
        if (e.target.closest('.wizard-next')) {
            e.preventDefault();
            if (currentStep < wizardSections.length - 1) {
                currentStep++;
                updateWizard();
            }
        }
    });

    navLinks.forEach((link, idx) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentStep = idx;
            updateWizard();
        });
    });

    updateWizard(); // Initialize wizard

    // --- Assessment Logic ---
    const assessmentData = {
        personal: [
            {
                text: "¿Cómo describes tu aprendizaje de nuevas herramientas frente al cambio?",
                options: [
                    { label: "Evito herramientas nuevas hasta que son obligatorias", value: 10 },
                    { label: "Aprendo lo básico si el trabajo me lo exige", value: 30 },
                    { label: "Busco proactivamente cursos para mantenerme actualizado", value: 60 },
                    { label: "Soy pionero; experimento con herramientas emergentes antes que otros", value: 90 }
                ]
            },
            {
                text: "¿Qué haces cuando tus métodos habituales de trabajo fallan?",
                options: [
                    { label: "Me frustro y busco excusas o instrucciones externas", value: 10 },
                    { label: "Busco soluciones rápidas a corto plazo", value: 30 },
                    { label: "Analizo la causa raíz y ajusto mi proceso de inmediato", value: 60 },
                    { label: "Transformo el fallo en una oportunidad para rediseñar todo el método", value: 90 }
                ]
            },
            {
                text: "¿Cómo gestionas tus objetivos a 3-5 años?",
                options: [
                    { label: "No tengo objetivos claros a largo plazo", value: 10 },
                    { label: "Tengo ideas generales pero sin plan escrito", value: 30 },
                    { label: "Tengo metas definidas con hitos de revisión", value: 60 },
                    { label: "Redefino mis metas constantemente basándome en disrupciones del mercado", value: 90 }
                ]
            },
            {
                text: "¿De qué forma compartes conocimiento o nuevas ideas?",
                options: [
                    { label: "Solo opino si me preguntan directamente", value: 10 },
                    { label: "Comparto ideas en reuniones formales de equipo", value: 30 },
                    { label: "Lidero iniciativas para proponer mejoras constantemente", value: 60 },
                    { label: "Mentorizo y creo redes de impacto fuera de mi equipo directo", value: 90 }
                ]
            }
        ],
        org: [
            {
                text: "¿Cómo maneja tu organización el lanzamiento de nuevos productos o servicios?",
                options: [
                    { label: "Tratamos de no cambiar lo que ya funciona bien", value: 10 },
                    { label: "Mejoramos productos solo cuando la competencia nos obliga", value: 30 },
                    { label: "Tenemos procesos continuos basados en feedback de clientes", value: 60 },
                    { label: "Dedicamos presupuesto específico a iterar y probar ideas disruptivas", value: 90 }
                ]
            },
            {
                text: "¿Qué sucede cuando un proyecto o iniciativa nueva fracasa?",
                options: [
                    { label: "Se buscan culpables y se penaliza el error", value: 10 },
                    { label: "Se ignora y tratamos de olvidarlo rápidamente", value: 30 },
                    { label: "Se hace un análisis post-mortem para documentar qué falló", value: 60 },
                    { label: "Celebramos el aprendizaje y transferimos el conocimiento a toda el área", value: 90 }
                ]
            },
            {
                text: "¿Cómo fluye la información en la estructura organizacional?",
                options: [
                    { label: "En silos; cada departamento tiene sus propios secretos", value: 10 },
                    { label: "Jerárquicamente de arriba hacia abajo", value: 30 },
                    { label: "A través de plataformas colaborativas y reuniones cruzadas", value: 60 },
                    { label: "Redes interconectadas transparentes, accesibles para cualquier talento", value: 90 }
                ]
            },
            {
                text: "¿Cuál es la postura principal hacia la adopción de Inteligencia Artificial?",
                options: [
                    { label: "Es un gasto o moda que no aplica a nosotros", value: 10 },
                    { label: "Automatizamos tareas operativas básicas de forma aislada", value: 30 },
                    { label: "La vemos como un habilitador clave para mejorar la experiencia del cliente", value: 60 },
                    { label: "Es el núcleo de nuestra estrategia; toda la organización la utiliza a diario", value: 90 }
                ]
            }
        ]
    };

    const questionnaireDiv = document.getElementById('questionnaire');
    const progressDiv = document.getElementById('question-progress');
    const scenarioBtns = document.querySelectorAll('.scenario-btn');
    const calcLoading = document.getElementById('calc-loading');
    const resultsDisplay = document.getElementById('results-display');
    const feedbackText = document.getElementById('assessment-feedback');
    
    let activeScenario = 'personal';
    let currentQuestionIdx = 0;
    let userAnswers = [];
    let growthChart;

    const renderQuestion = () => {
        if (!questionnaireDiv) return;
        
        const qList = assessmentData[activeScenario];
        if (currentQuestionIdx >= qList.length) {
            calculateAndShowResults(qList);
            return;
        }

        const q = qList[currentQuestionIdx];
        if (progressDiv) progressDiv.innerText = `Pregunta ${currentQuestionIdx + 1} de ${qList.length}`;

        questionnaireDiv.classList.add('question-fade-out');
        
        setTimeout(() => {
            questionnaireDiv.innerHTML = `
                <div class="space-y-6">
                    <h3 class="text-2xl md:text-3xl font-bold leading-tight">${q.text}</h3>
                    <div class="space-y-3 mt-8">
                        ${q.options.map((opt, i) => `
                            <button class="assessment-option group" data-val="${opt.value}" data-label="${opt.label}">
                                <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-sm font-bold flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors dark:text-gray-300">
                                    ${String.fromCharCode(65 + i)}
                                </div>
                                <span class="flex-1 text-sm md:text-base">${opt.label}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            
            const optBtns = questionnaireDiv.querySelectorAll('.assessment-option');
            optBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    userAnswers.push({ val: parseInt(btn.dataset.val), label: btn.dataset.label });
                    currentQuestionIdx++;
                    renderQuestion();
                });
            });

            questionnaireDiv.classList.remove('question-fade-out');
            questionnaireDiv.classList.add('question-slide-start');
            void questionnaireDiv.offsetWidth; // Reflow
            questionnaireDiv.classList.remove('question-slide-start');
        }, 200);
    };

    const resetAssessment = (scenario) => {
        activeScenario = scenario || 'personal';
        currentQuestionIdx = 0;
        userAnswers = [];
        if (resultsDisplay) resultsDisplay.classList.add('hidden');
        if (calcLoading) calcLoading.classList.add('hidden');
        if (questionnaireDiv) questionnaireDiv.classList.remove('hidden');
        renderQuestion();
    };

    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            scenarioBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            resetAssessment(btn.dataset.scenario);
        });
    });

    resetAssessment('personal');

    const calculateAndShowResults = async (qList) => {
        if (questionnaireDiv) questionnaireDiv.classList.add('hidden');
        if (progressDiv) progressDiv.innerText = "Analizando Resultados...";
        if (calcLoading) calcLoading.classList.remove('hidden');

        const avg = userAnswers.reduce((sum, a) => sum + a.val, 0) / userAnswers.length;
        const target = Math.min(100, Math.max(avg + 25, 80));

        let aiFeedbackHtml = `<p class="mb-4">Tu madurez actual es del <span class="font-bold text-primary">${avg.toFixed(0)}%</span> y existe una brecha del <span class="font-bold text-secondary">${(target - avg).toFixed(0)}%</span> para alcanzar el estado ideal de innovación.</p>`;
        let aiText = "";

        try {
            const promptContext = userAnswers.map((a, i) => `${qList[i].text}: ${a.label}`).join(" | ");
            const prompt = `Considérate un consultor estratega de innovación. Analiza este perfil (${activeScenario}): [${promptContext}]. Describe su fortaleza principal y su mayor debilidad/oportunidad de mejora estratégica en exactamente un párrafo impactante de no más de 50 palabras.`;
            
            const { GoogleGenerativeAI } = await import("https://esm.run/@google/generative-ai");
            const API_KEY = "AIzaSyAHytylWjDL_ZYXa41FCnAecQEm7H34AM0"; // Shared key for both tools
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            aiText = (await result.response).text();
            
            aiFeedbackHtml += `<div class="p-4 bg-primary/10 border-l-4 border-primary rounded-r-xl italic text-sm"><strong>Análisis IA:</strong> ${aiText}</div>`;
        } catch (error) {
            console.error("AI Analysis failed:", error);
            aiFeedbackHtml += `<p class="text-sm opacity-70">Nota: El análisis avanzado con IA no está disponible en este momento.</p>`;
        }

        // --- Google Sheets Integration ---
        try {
            const emailInput = document.getElementById('assessment-email');
            const userEmail = emailInput ? emailInput.value.trim() : "";
            const scriptURL = "https://script.google.com/macros/s/AKfycbzXTOtYtvxRbDkvxw3smFpaYO3oA6hjnNJgDLHRgDVzH9gd46RmMNxkwyuRnyFth3Eb/exec";
            
            const params = new URLSearchParams();
            params.append("Email", userEmail || "Anónimo");
            params.append("Tipo", activeScenario === "personal" ? "Personal" : "Organizacional");
            params.append("Madurez", avg.toFixed(0) + "%");
            params.append("Brecha", (target - avg).toFixed(0) + "%");
            params.append("Respuestas_Brutas", userAnswers.map((a, i) => `Q${i+1}: ${a.label}`).join(" | "));
            params.append("Analisis_AI", aiText || "Error o sin IA");

            fetch(scriptURL, {
                method: "POST",
                mode: "no-cors",
                body: params
            }).catch(e => console.error("Sheets Sync Request Error", e));
        } catch (e) {
            console.error("Sheets Sync Prep Error", e);
        }
        // ---------------------------------

        if (calcLoading) calcLoading.classList.add('hidden');
        if (resultsDisplay) {
            resultsDisplay.classList.remove('hidden');
            resultsDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (feedbackText) feedbackText.innerHTML = aiFeedbackHtml;

        if (growthChart) growthChart.destroy();
        const canvas = document.getElementById('growthChart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            growthChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Estado Actual', 'Aspiración'],
                    datasets: [{
                        label: 'Nivel',
                        data: [avg, target],
                        backgroundColor: ['rgba(99, 102, 241, 0.4)', 'rgba(20, 184, 166, 0.8)'],
                        borderRadius: 12,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, max: 100 } },
                    plugins: { legend: { display: false } }
                }
            });
        }
    };

    // --- AI Idea Generator (Real Gemini Integration) ---
    const aiInput = document.getElementById('ai-input');
    const generateBtn = document.getElementById('generate-btn');
    const aiOutput = document.getElementById('ai-output');
    const aiTyping = document.getElementById('ai-typing');

    const typingEffect = async (text) => {
        if (!aiTyping) return;
        aiTyping.innerHTML = '';
        for (let i = 0; i < text.length; i++) {
            aiTyping.innerHTML += text[i];
            await new Promise(resolve => setTimeout(resolve, 5 + Math.random() * 15));
        }
    };

    generateBtn?.addEventListener('click', async () => {
        if (!aiInput || !aiInput.value.trim() || !generateBtn) return;

        generateBtn.disabled = true;
        const orgText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-3"></i> Consultando a Gemini...';
        
        try {
            // Dynamic import prevents module failure from breaking the rest of the site
            const { GoogleGenerativeAI } = await import("https://esm.run/@google/generative-ai");
            const API_KEY = "AIzaSyAHytylWjDL_ZYXa41FCnAecQEm7H34AM0";
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Eres un consultor experto en innovación. Basado en el siguiente desafío, proporciona 3 estrategias de innovación impactantes, directas y creativas. Desafío: "${aiInput.value}". Responde en un formato profesional para una terminal, usando etiquetas como [ESTRATEGIA] y [ACCIÓN]. Limítate a 150 palabras.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            let formattedResponse = `> PROCESANDO DESAFÍO CON GEMINI AI...\n\n`;
            formattedResponse += text;

            if (aiOutput) aiOutput.classList.remove('hidden');
            await typingEffect(formattedResponse);
        } catch (error) {
            console.error("Error AI:", error);
            if (aiOutput) aiOutput.classList.remove('hidden');
            await typingEffect("> ERROR: No se pudo conectar con el motor de IA. Verifica tu conexión o API Key.");
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = orgText;
        }
    });

    // --- Culture Radar Chart ---
    const cultureCanvas = document.getElementById('cultureChart');
    if (cultureCanvas) {
        const cultureCtx = cultureCanvas.getContext('2d');
        new Chart(cultureCtx, {
            type: 'radar',
            data: {
                labels: ['Liderazgo', 'Experimentación', 'Agilidad', 'Recursos', 'Recompensas'],
                datasets: [{
                    label: 'Preparación Actual',
                    data: [85, 60, 45, 55, 70],
                    fill: true,
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                    pointBorderColor: '#fff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.1)' },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }

    // --- Mobile Menu ---
    const menuBtn = document.getElementById('menu-btn');
    menuBtn?.addEventListener('click', () => {
        alert('Navegación Desktop Premium habilitada. Menú móvil optimizado.');
    });
});
