window.modules.push({
    id: 1,
    title: "Introducción a la Programación",
    icon: "fa-desktop",
    description: "Fundamentos teóricos, arquitectura de computadoras y lógica de algoritmos.",
    intro: `
        <div class="neon-box p-8 mb-8">
            <h3 class="text-3xl font-bold mb-6 text-white text-center">Fundamentos de la Computación</h3>
            <p class="text-gray-300 mb-6 text-lg leading-relaxed text-justify">
                Antes de escribir código, es esencial comprender cómo funcionan las máquinas que programamos. 
                La programación no es magia; es la estructuración lógica de instrucciones para manipular datos y controlar hardware.
                En esta unidad, estableceremos las bases teóricas necesarias para entender el ecosistema de desarrollo de software.
            </p>
            <div class="grid md:grid-cols-2 gap-6 mt-8">
                <div class="neon-box-secondary p-6">
                    <h4 class="font-bold text-white mb-2 border-b border-gray-600 pb-2">Conceptos Clave</h4>
                    <ul class="text-sm text-gray-400 space-y-2">
                        <li>• Arquitectura de Computadoras</li>
                        <li>• Lógica Algorítmica</li>
                        <li>• Niveles de Abstracción</li>
                    </ul>
                </div>
                <div class="neon-box-secondary p-6">
                    <h4 class="font-bold text-white mb-2 border-b border-gray-600 pb-2">Objetivo</h4>
                    <p class="text-sm text-gray-400">
                        Comprender el ciclo de vida de un programa, desde el código fuente hasta su ejecución en el procesador.
                    </p>
                </div>
            </div>
        </div>
    `,
    lessons: [
        {
            title: "Hardware vs Software",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Arquitectura del Sistema</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Un sistema computacional se compone de dos partes interdependientes:
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">Hardware (Tangible)</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Son los componentes físicos y electrónicos. Sin software, el hardware es inerte.
                            </p>
                            <ul class="text-sm text-gray-500 list-disc ml-4 space-y-1">
                                <li><strong>CPU:</strong> Unidad Central de Procesamiento (El cerebro).</li>
                                <li><strong>Memoria RAM:</strong> Almacenamiento temporal de alta velocidad.</li>
                                <li><strong>Disco Duro:</strong> Almacenamiento permanente.</li>
                                <li><strong>Periféricos:</strong> Teclado, Monitor, Mouse.</li>
                            </ul>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Software (Intangible)</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Conjunto de instrucciones y datos que le indican al hardware qué hacer.
                            </p>
                            <ul class="text-sm text-gray-500 list-disc ml-4 space-y-1">
                                <li><strong>Sistema Operativo:</strong> (Windows, Linux, macOS) Administra el hardware.</li>
                                <li><strong>Aplicaciones:</strong> (Navegadores, Editores) Herramientas para el usuario.</li>
                                <li><strong>Lenguajes de Programación:</strong> Herramientas para crear software.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Interacción</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            El Software envía instrucciones a la CPU. La CPU procesa estas instrucciones usando datos de la RAM y muestra resultados a través de los periféricos.
                        </p>
                        <code class="text-xs text-blue-400 block bg-black/40 p-2 rounded">print("Mi computadora")</code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Ejercicio de Clasificación</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Vamos a usar el comando <code>print()</code> para mostrar mensajes en pantalla. <br>
                        Escribe un código que imprima la palabra "Hola Mundo" en la pantalla.
                    </p>
                    <textarea id="code-hw-sw" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="3"># Escribe aqui tu respuesta
print("...")</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-hw-sw').value, 'output-hw-sw')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Clasificación
                    </button>
                </div>
                <div id="output-hw-sw" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Esperando ejecución...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Hola Mundo",
                matchType: "exact",
                hint: "Simplemente escribe: print(\"Hola Mundo\")"
            }
        },
        {
            title: "Algoritmos y Secuencia",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Lógica Algorítmica</h3>
                
                <div class="neon-box p-8 mb-8">
                    <div class="mb-8">
                        <h4 class="text-xl font-bold text-white mb-2">¿Qué es un Algoritmo?</h4>
                        <p class="text-gray-300 leading-relaxed mb-4">
                            Un <strong>algoritmo</strong> es una secuencia finita y ordenada de pasos para resolver un problema.
                            La palabra clave es <strong>ORDEN</strong>. Si alteras el orden de los pasos (secuencia), el resultado cambia o falla.
                        </p>
                        <div class="bg-black/30 p-4 rounded border border-gray-700">
                            <h5 class="text-white font-bold text-sm mb-2">Ejemplo: Lavarse los dientes</h5>
                            <ol class="text-sm text-gray-400 list-decimal ml-4 space-y-1 font-mono">
                                <li>Tomar cepillo</li>
                                <li>Poner pasta</li>
                                <li>Cepillar</li>
                                <li>Enjuagar</li>
                            </ol>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6 border-l-2 border-yellow-500">
                        <h4 class="text-xl font-bold text-white mb-2">Secuencia en Código</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            La computadora lee el código de <strong>arriba hacia abajo</strong>. La línea 1 siempre se ejecuta antes que la línea 2.
                        </p>
                        <code class="text-xs text-yellow-400 block bg-black/40 p-2 rounded">
                            print("Primero esto")<br>
                            print("Después esto")
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Implementando una Secuencia</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Ordena la salida correctamente. Escribe 3 líneas de código usando <code>print()</code> para mostrar los pasos de encender un auto en orden:<br>
                        1. "Abrir puerta"<br>
                        2. "Sentarse"<br>
                        3. "Encender motor"
                    </p>
                    <textarea id="code-algo" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="6"># Escribe las instrucciones en orden
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-algo').value, 'output-algo')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Ejecutar Algoritmo
                    </button>
                </div>
                <div id="output-algo" class="code-output p-4 text-sm">
                    <p class="text-gray-500">El orden importa...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Abrir puerta\nSentarse\nEncender motor",
                matchType: "exact",
                hint: "Debes escribir 3 prints, uno debajo del otro, en el orden exacto solicitado."
            }
        },
        {
            title: "Lenguajes de Programación",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Niveles de Abstracción</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6">
                        Las computadoras solo entienden voltajes (encendido/apagado), representados como unos y ceros (Binario). Para comunicarnos con ellas, usamos lenguajes de programación que actúan como traductores.
                    </p>
                    
                    <div class="space-y-4">
                        <div class="neon-box-dark p-4 border border-red-900/50">
                            <h5 class="font-bold text-red-400 mb-1">Lenguaje Máquina (Bajo Nivel)</h5>
                            <code class="text-xs text-gray-500 block mb-2">01010010 11001010</code>
                            <p class="text-sm text-gray-400">
                                Es el lenguaje nativo del CPU. Extremadamente difícil para humanos, pero muy rápido para la máquina.
                            </p>
                        </div>
                        
                        <div class="neon-box-dark p-4 border border-yellow-900/50">
                            <h5 class="font-bold text-yellow-400 mb-1">Lenguaje Ensamblador (Bajo Nivel)</h5>
                            <code class="text-xs text-gray-500 block mb-2">MOV AX, 1</code>
                            <p class="text-sm text-gray-400">
                                Usa códigos mnemotécnicos. Aún depende mucho de la arquitectura del hardware específico.
                            </p>
                        </div>

                        <div class="neon-box-dark p-4 border border-green-900/50">
                            <h5 class="font-bold text-neon-green mb-1">Lenguajes de Alto Nivel (Python, Java, C++)</h5>
                            <code class="text-xs text-gray-500 block mb-2">print("Hola")</code>
                            <p class="text-sm text-gray-400">
                                Se parecen al lenguaje humano (inglés). Son portables y fáciles de entender. Requieren un proceso de traducción para que la máquina los entienda.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                     <p class="text-gray-300 text-sm mb-4">
                        Python es un lenguaje de <strong>Alto Nivel</strong>. Escribe un comando simple que demuestre su legibilidad. Imprime: "Python es Alto Nivel".
                    </p>
                    <textarea id="code-lang" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="2">print("...")</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-lang').value, 'output-lang')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Ejecutar
                    </button>
                </div>
                <div id="output-lang" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Esperando...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Python es Alto Nivel",
                matchType: "exact"
            }
        },
        {
            title: "Compiladores vs Intérpretes",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Traductores de Código</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6">
                        El código de Alto Nivel debe convertirse a Lenguaje Máquina. Existen dos estrategias principales para esto:
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="neon-box-secondary p-6">
                            <h5 class="font-bold text-white mb-2">Compilador (Ej. C++, Go)</h5>
                            <p class="text-sm text-gray-400 mb-3">
                                Traduce <strong>TODO</strong> el programa de una sola vez antes de ejecutarlo. Crea un archivo ejecutable (.exe).
                            </p>
                            <ul class="text-xs text-gray-500 list-disc ml-4">
                                <li>Más rápido en ejecución.</li>
                                <li>Si hay un error, no compila nada.</li>
                            </ul>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h5 class="font-bold text-white mb-2">Intérprete (Ej. Python, JS)</h5>
                            <p class="text-sm text-gray-400 mb-3">
                                Traduce y ejecuta el código <strong>línea por línea</strong> en tiempo real.
                            </p>
                            <code class="text-xs text-neon-green block bg-black/40 p-2 rounded mb-3"># Python lee y ejecuta de inmediato</code>
                            <ul class="text-xs text-gray-500 list-disc ml-4">
                                <li>Más fácil para aprender y depurar.</li>
                                <li>Si hay un error en la línea 10, ejecuta las 9 primeras.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Demostración de Interpretación</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Observa cómo Python ejecuta la primera línea aunque la segunda tenga un error (división por cero). Un compilador no permitiría esto.
                    </p>
                    <textarea id="code-interp" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="4">print("Esta linea SI se ejecuta")
# Esto causará un error, pero lo anterior ya salió
print(10 / 0)</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-interp').value, 'output-interp')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Probar Error en Tiempo de Ejecución
                    </button>
                </div>
                <div id="output-interp" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Observa el comportamiento...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Esta linea SI se ejecuta",
                matchType: "include"
            }
        },
        {
            title: "Comentarios y Legibilidad",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Escribir para Humanos</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        El código lo lee la computadora, pero lo mantienen los humanos. Los <strong>comentarios</strong> son notas que el intérprete de Python ignora totalmente, pero que sirven para explicar qué hace tu código.
                    </p>
                    
                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Tipos de Notas</h4>
                        <div class="space-y-4">
                            <div>
                                <p class="text-xs text-blue-400 mb-1"># Comentario de una línea</p>
                                <p class="text-sm text-gray-400">Usa el símbolo <code>#</code> para notas rápidas.</p>
                            </div>
                            <div>
                                <p class="text-xs text-blue-400 mb-1">""" Comentario multilínea """</p>
                                <p class="text-sm text-gray-400">Usa triples comillas para explicaciones largas o documentación.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        Crea un comentario que diga "Hola" y debajo imprime "Mundo".
                    </p>
                    <textarea id="code-comments" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="4"># Escribe tu nota aquí:

print("Mundo")</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-comments').value, 'output-comments')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Limpieza
                    </button>
                </div>
                <div id="output-comments" class="code-output p-4 text-sm mt-4">
                    <p class="text-gray-500">Esperando ejecución...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Mundo",
                matchType: "include",
                requiredCode: "#",
                hint: "Usa el símbolo # seguido de cualquier texto."
            }
        },
        {
            title: "Entornos de Desarrollo",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">¿Dónde escribimos código?</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6">
                        Para programar necesitamos un <strong>IDE</strong> (Entorno de Desarrollo Integrado) o un Editor de Texto.
                    </p>
                    
                    <ul class="space-y-4">
                        <li class="flex items-start">
                            <div class="text-neon-green mr-3">•</div>
                            <div>
                                <h5 class="text-white font-bold">Editores Locales</h5>
                                <p class="text-sm text-gray-400">Software instalado en tu PC, como VS Code, PyCharm o Sublime Text. Ideal para proyectos grandes.</p>
                            </div>
                        </li>
                        <li class="flex items-start">
                            <div class="text-neon-green mr-3">•</div>
                            <div>
                                <h5 class="text-white font-bold">Notebooks en la Nube</h5>
                                <p class="text-sm text-gray-400">Herramientas como <strong>Google Colab</strong> o Jupyter. Permiten escribir código, texto y gráficos en el mismo documento. Se ejecutan en servidores remotos.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="code-editor p-6 mb-4">
                     <p class="text-gray-300 text-sm mb-4">
                        Para finalizar la Unidad 1, confirma que has entendido los conceptos básicos imprimiendo "Unidad 1 Completada".
                    </p>
                    <textarea id="code-env" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="2">print("...")</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-env').value, 'output-env')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Finalizar Unidad 1
                    </button>
                </div>
                <div id="output-env" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Esperando confirmación...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Unidad 1 Completada",
                matchType: "exact"
            }
        }
    ]
});
