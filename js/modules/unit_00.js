window.modules.push({
    id: 0,
    title: "Bienvenida a Python",
    icon: "fa-rocket",
    description: "Conoce qué es la programación, por qué aprender Python y cómo empezar tu viaje.",
    intro: `
        <div class="neon-box p-8 mb-8 text-center">
            <div class="text-6xl mb-6 text-neon-green"><i class="fas fa-graduation-cap"></i></div>
            <h3 class="text-3xl font-bold mb-4 text-white">Tu Viaje Comienza Aquí</h3>
            <p class="text-gray-300 mb-8 text-lg">
                Bienvenido al mundo de la programación. Aquí aprenderás que programar no es solo escribir código, 
                sino desarrollar una nueva forma de pensar y resolver problemas.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
                <div class="neon-box-secondary p-6">
                    <h4 class="text-white font-bold mb-3"><i class="fas fa-brain mr-2 text-neon-green"></i>Pensamiento Lógico</h4>
                    <p class="text-sm text-gray-400">Aprenderás a descomponer problemas complejos en pasos simples y manejables.</p>
                </div>
                <div class="neon-box-secondary p-6">
                    <h4 class="text-white font-bold mb-3"><i class="fas fa-magic mr-2 text-neon-green"></i>Automatización</h4>
                    <p class="text-sm text-gray-400">Descubrirás cómo hacer que la computadora trabaje por ti en tareas repetitivas.</p>
                </div>
            </div>
        </div>
    `,
    lessons: [
        {
            title: "¿Qué es Programar?",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Instrucciones para Máquinas</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        La <strong>programación</strong> es el proceso de dar instrucciones precisas a una computadora. Es como escribir una receta de cocina extremadamente detallada que un robot debe seguir al pie de la letra.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Algoritmos</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Un algoritmo es simplemente una serie de pasos ordenados para resolver un problema.
                            </p>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">Lenguajes</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Como las máquinas no hablan español, usamos lenguajes como Python para comunicarnos con ellas.
                            </p>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">La Función print()</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Es nuestra herramienta básica para que la computadora nos "hable" mostrándonos mensajes en la pantalla.
                        </p>
                        <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">print("Hola Estudiante")</code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Tu Primer Comando</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Usa la función <code>print()</code> para mostrar el mensaje "Hola Mundo" en la terminal.
                    </p>
                    <textarea id="code-intro-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="3"># Escribe tu código aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-intro-1').value, 'output-intro-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Ejecutar Saludo
                    </button>
                </div>
                <div id="output-intro-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Esperando tu primer código...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Hola Mundo",
                matchType: "exact",
                hint: "Escribe print(\"Hola Mundo\") exactamente así."
            }
        },
        {
            title: "¿Por qué Python?",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">El Lenguaje de Moda</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Python es actualmente el lenguaje más popular del mundo. Su sintaxis es clara y se parece mucho al lenguaje humano, lo que lo hace ideal para principiantes.
                    </p>
                    
                    <div class="bg-black/30 p-4 rounded border border-gray-700 mb-8">
                        <h5 class="text-white font-bold text-sm mb-2">Versatilidad Total</h5>
                        <p class="text-sm text-gray-400 mb-2">Con Python puedes crear:</p>
                        <ul class="text-xs text-gray-500 space-y-1 ml-4 list-disc">
                            <li>Páginas Web (Instagram, Netflix)</li>
                            <li>Inteligencia Artificial (ChatGPT)</li>
                            <li>Ciencia de Datos y Análisis Espacial</li>
                        </ul>
                    </div>

                    <div class="neon-box-secondary p-6 border-l-2 border-yellow-500">
                        <h4 class="text-lg font-bold text-white mb-2">Símbolos Matemáticos</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Python usa los símbolos estándar: <code>+</code> (suma), <code>-</code> (resta), <code>*</code> (multiplicación) y <code>/</code> (división).
                        </p>
                        <code class="text-xs text-yellow-400 block bg-black/40 p-2 rounded">print(10 + 20) # Muestra 30</code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Python como Calculadora</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Prueba la potencia de Python resolviendo una suma. Escribe <code>print(2025 + 5)</code> para ver el resultado en la terminal.
                    </p>
                    <textarea id="code-intro-2" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="3"></textarea>
                    <button onclick="runPythonCode(document.getElementById('code-intro-2').value, 'output-intro-2')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Calcular Ahora
                    </button>
                </div>
                <div id="output-intro-2" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Realizando operación...</p>
                </div>
            `,
            validation: {
                expectedOutput: "2030",
                matchType: "include",
                hint: "Escribe print(2025 + 5) y pulsa Ejecutar."
            }
        },
        {
            title: "La Filosofía Python (Zen)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">El "Zen" de Python</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Python no es solo un lenguaje, tiene una filosofía de diseño. Tim Peters escribió 19 principios llamados el <strong>Zen de Python</strong>. El más importante es:
                    </p>
                    
                    <div class="neon-box-dark p-6 border-l-2 border-neon-green text-center italic mb-8">
                        "Lo bonito es mejor que lo feo. Lo explícito es mejor que lo implícito. Lo simple es mejor que lo complejo."
                    </div>

                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="neon-box-secondary p-4">
                            <h5 class="text-white font-bold mb-2">Código Legible</h5>
                            <p class="text-xs text-gray-400">Escribimos código pensando en que otros (uotros nosotros en el futuro) lo entiendan fácilmente.</p>
                        </div>
                        <div class="neon-box-secondary p-4">
                            <h5 class="text-white font-bold mb-2">Una Sola Forma</h5>
                            <p class="text-xs text-gray-400">Debería haber una —y preferiblemente solo una— manera obvia de hacer las cosas.</p>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        ¿Quieres ver todos los principios del Zen de Python? Escribe el comando secreto <code>import this</code> en la terminal.
                    </p>
                    <textarea id="code-zen" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="2"></textarea>
                    <button onclick="runPythonCode(document.getElementById('code-zen').value, 'output-zen')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Revelar Secreto
                    </button>
                </div>
                <div id="output-zen" class="code-output p-4 text-sm mt-4">
                    <p class="text-gray-500">Esperando revelación...</p>
                </div>
            `,
            validation: {
                expectedOutput: "The Zen of Python",
                matchType: "include",
                requiredCode: "import this",
                hint: "Escribe import this para ver el poema de la filosofía Python."
            }
        }
    ]
});
