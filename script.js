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
    const questions = {
        personal: [
            "¿Cómo describirías tu progreso en habilidades en los últimos 3 años?",
            "¿Qué tan eficientes son tus métodos de estudio/trabajo actuales?",
            "¿Qué tan ambiciosos son tus objetivos para tu impacto en 5 años?",
            "¿Qué tan proactivo eres buscando nuevas oportunidades?"
        ],
        org: [
            "¿Cómo describirías el crecimiento de mercado de tu organización?",
            "¿Qué tan eficientes son tus procesos internos para generar valor?",
            "¿Qué tan ambiciosos son tus objetivos de expansión?",
            "¿Qué tan proactiva es tu organización con nuevas tecnologías?"
        ]
    };

    const questionnaireDiv = document.getElementById('questionnaire');
    const scenarioBtns = document.querySelectorAll('.scenario-btn');
    let activeScenario = 'personal';

    const renderQuestions = (scenario) => {
        if (!questionnaireDiv) return;
        questionnaireDiv.innerHTML = questions[scenario].map((q, i) => `
            <div class="space-y-3">
                <label class="block font-semibold text-sm uppercase tracking-wide opacity-70">${q}</label>
                <select class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all">
                    <option value="10">Incubación (10%)</option>
                    <option value="30">En Marcha (30%)</option>
                    <option value="60" selected>Consolidado (60%)</option>
                    <option value="90">Liderazgo (90%)</option>
                </select>
            </div>
        `).join('');
    };

    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            scenarioBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeScenario = btn.dataset.scenario || 'personal';
            renderQuestions(activeScenario);
        });
    });

    renderQuestions('personal');

    let growthChart;
    const calcBtn = document.getElementById('calc-results');
    const resultsDisplay = document.getElementById('results-display');

    calcBtn?.addEventListener('click', () => {
        if (!questionnaireDiv || !resultsDisplay) return;
        const selects = questionnaireDiv.querySelectorAll('select');
        const values = Array.from(selects).map(s => parseInt(s.value));
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const target = Math.min(100, Math.max(avg + 25, 80));

        resultsDisplay.classList.remove('hidden');
        resultsDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (growthChart) growthChart.destroy();
        
        const canvas = document.getElementById('growthChart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            growthChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Estado Actual', 'Aspiración de Crecimiento'],
                    datasets: [{
                        label: 'Nivel de Madurez',
                        data: [avg, target],
                        backgroundColor: ['rgba(79, 70, 229, 0.4)', 'rgba(79, 70, 229, 1)'],
                        borderRadius: 12,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        const feedback = document.getElementById('assessment-feedback');
        if (feedback) {
            feedback.innerHTML = `
                Tu madurez actual es del <span class="font-bold text-primary">${avg.toFixed(0)}%</span>. 
                Existe una brecha estratégica del <span class="font-bold text-secondary">${(target - avg).toFixed(0)}%</span> para alcanzar tus objetivos. 
                La innovación será el puente para cerrar este espacio.
            `;
        }

        // Advance to next wizard step automatically when showing results
        setTimeout(() => { 
            if(currentStep === 1) {
                currentStep++;
                updateWizard();
            }
        }, 2000);
    });

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
            const API_KEY = "AIzaSyD0hE01hfJJPq-csjNIA4ve20XOHsmfsns";
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
