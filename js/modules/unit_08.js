window.modules.push({
    id: 8,
    title: "Herramientas Pro",
    icon: "fa-star",
    description: "F-strings, slicing y trucos avanzados.",
    intro: `
        <div class="neon-box p-8 mb-8 text-center">
            <h3 class="text-3xl font-bold mb-6 text-white text-center">Python Moderno</h3>
            <p class="text-gray-300 mb-8 text-lg text-center">
                Ya dominas lo básico. Ahora aprende las herramientas que usan los profesionales para escribir código limpio, eficiente y elegante.
            </p>
            <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div class="neon-box-dark p-6 text-center">
                    <div class="text-5xl text-blue-400 mb-3"><i class="fas fa-quote-right"></i></div>
                    <h4 class="text-white font-bold mb-2">F-Strings</h4>
                    <p class="text-sm text-gray-400">Formateo elegante de textos</p>
                </div>
                <div class="neon-box-dark p-6 text-center">
                    <div class="text-5xl text-yellow-400 mb-3"><i class="fas fa-cut"></i></div>
                    <h4 class="text-white font-bold mb-2">Slicing</h4>
                    <p class="text-sm text-gray-400">Extrae porciones de listas y textos</p>
                </div>
            </div>
        </div>
    `,
    lessons: [
        {
            title: "F-Strings (Formato Moderno)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">La Forma Profesional</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Los <strong>f-strings</strong> son la manera más limpia e intuitiva de insertar variables dentro de cadenas de texto. Solo necesitas poner una <code>f</code> antes de las comillas y usar llaves <code>{ }</code>.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Ventajas</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Evitas errores de tipo (no tienes que convertir números a texto) y el código es mucho más fácil de leer.
                            </p>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">Sintaxis</h4>
                            <code class="text-xs text-blue-400 block bg-black/40 p-2 rounded">
                                n = "Neo"<br>
                                print(f"Hola {n}")
                            </code>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Dato Útil</h4>
                        <p class="text-gray-300 text-sm">
                            Dentro de las llaves puedes incluso realizar operaciones matemáticas simples como <code>{edad + 1}</code>.
                        </p>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Formateo de Mensajes</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Usa un <strong>f-string</strong> para imprimir exactamente el mensaje: "Tengo 5 manzanas" usando la variable <code>cantidad</code>.
                    </p>
                    <textarea id="code-fstr-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5">cantidad = 5
# Imprime con f-string aquí:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-fstr-1').value, 'output-fstr-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Formato
                    </button>
                </div>
                <div id="output-fstr-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Componiendo texto...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Tengo 5 manzanas",
                matchType: "exact",
                requiredCode: "f\"",
                hint: "Usa print(f\"Tengo {cantidad} manzanas\")"
            }
        },
        {
            title: "Slicing (Cortar Secuencias)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Extraer Fragmentos</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        El <strong>slicing</strong> te permite "rebanar" o extraer porciones específicas de una lista o un texto usando la sintaxis <code>[inicio:fin]</code>.
                    </p>
                    
                    <div class="bg-black/30 p-4 rounded border border-gray-700 mb-8">
                        <h5 class="text-white font-bold text-sm mb-2">La Regla del Índice Final</h5>
                        <p class="text-sm text-gray-400 mb-4">El índice de inicio es inclusivo, pero el de fin es exclusivo (no se incluye):</p>
                        <code class="text-xs text-blue-400 block bg-black/40 p-2 rounded mb-4">
                            lista = [0, 1, 2, 3, 4]<br>
                            print(lista[1:3]) # [1, 2]
                        </code>
                        <ul class="text-xs text-gray-500 space-y-1 ml-4 list-disc">
                            <li><code>[:4]</code> → Desde el principio hasta la posición 3.</li>
                            <li><code>[2:]</code> → Desde la posición 2 hasta el final.</li>
                        </ul>
                    </div>

                    <div class="neon-box-secondary p-6 border-l-2 border-yellow-500">
                        <h4 class="text-lg font-bold text-white mb-2">Precisión</h4>
                        <p class="text-gray-300 text-sm">
                            Si omites el primer número, Python asume que empiezas desde el principio (0).
                        </p>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Cortando Textos</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Extrae e imprime las primeras 4 letras de la palabra "Programación" usando slicing.
                    </p>
                    <textarea id="code-slice-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5">palabra = "Programación"
# Extrae las primeras 4 letras:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-slice-1').value, 'output-slice-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Cortar Palabra
                    </button>
                </div>
                <div id="output-slice-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Separando caracteres...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Prog",
                matchType: "exact",
                hint: "Escribe print(palabra[:4])"
            }
        },
        {
            title: "Slicing Avanzado",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Inversión y Pasos</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Podemos añadir un tercer valor opcional llamado <strong>paso</strong> o salto: <code>[inicio:fin:paso]</code>. Esto permite saltar elementos o incluso recorrer la lista hacia atrás.
                    </p>
                    
                    <div class="space-y-4">
                        <div class="neon-box-dark p-4 border border-blue-900/50">
                            <h5 class="font-bold text-blue-400 mb-1">El Truco Pro</h5>
                            <p class="text-sm text-gray-400">
                                Usar <code>[::-1]</code> es la forma más rápida en Python de invertir completamente una cadena o lista.
                            </p>
                        </div>
                        
                        <div class="neon-box-dark p-4 border border-purple-900/50">
                            <h5 class="font-bold text-purple-400 mb-1">Saltos</h5>
                            <p class="text-sm text-gray-400 mb-2">
                                <code>[::2]</code> devolverá solo los elementos en posiciones pares.
                            </p>
                            <code class="text-xs text-purple-400 block bg-black/40 p-2 rounded">"12345"[::2] # "135"</code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Efecto Espejo</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Invierte la palabra "Python" usando el truco de slicing negativo e imprímela.
                    </p>
                    <textarea id="code-slice-2" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5">txt = "Python"
# Imprime invertido aquí:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-slice-2').value, 'output-slice-2')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Invertir Texto
                    </button>
                </div>
                <div id="output-slice-2" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Invirtiendo flujo...</p>
                </div>
            `,
            validation: {
                expectedOutput: "nohtyP",
                matchType: "exact",
                hint: "Usa el slicing [::-1] dentro del print."
            }
        },
        {
            title: "Join y Split (Textos y Listas)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Conversión de Formatos</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        A menudo necesitas convertir una lista en un texto o viceversa. Para eso usamos <code>split()</code> y <code>join()</code>.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">.split()</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Corta un string y lo convierte en lista. Por defecto corta en los espacios.
                            </p>
                            <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">
                                "A B".split() # ["A", "B"]
                            </code>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">.join()</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Une una lista en un solo string usando un separador.
                            </p>
                            <code class="text-xs text-blue-400 block bg-black/40 p-2 rounded">
                                "-".join(["A", "B"]) # "A-B"
                            </code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        Dada la lista <code>tags = ["python", "code", "ai"]</code>, únelos en un solo string separados por una coma y un espacio <code>", "</code> e imprímelo.
                    </p>
                    <textarea id="code-join-split" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5">tags = ["python", "code", "ai"]
# Une e imprime aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-join-split').value, 'output-join-split')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Unir Elementos
                    </button>
                </div>
                <div id="output-join-split" class="code-output p-4 text-sm mt-4">
                    <p class="text-gray-500">Esperando unión...</p>
                </div>
            `,
            validation: {
                expectedOutput: "python, code, ai",
                matchType: "include",
                requiredCode: "join",
                hint: "Usa ', '.join(tags)"
            }
        },
        {
            title: "Manejo de Errores (Try/Except)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Evita que tu App Colapse</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        A veces el código falla por razones externas (un usuario ingresa texto en lugar de números). Con <code>try</code> y <code>except</code>, puedes capturar el error y reaccionar sin que el programa se cierre.
                    </p>
                    
                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Estructura de Protección</h4>
                        <code class="text-xs text-red-400 block bg-black/40 p-3 rounded">
                            try:<br>
                            &nbsp;&nbsp;num = int(input("Dime un número: "))<br>
                            except:<br>
                            &nbsp;&nbsp;print("❌ Eso no era un número")
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        Envuelve el código de división en un bloque <code>try/except</code>. Si ocurre un error (como dividir por cero), imprime "Error en el cálculo".
                    </p>
                    <textarea id="code-try-except" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="8"># Intenta dividir 10 entre 0:
try:
    resultado = 10 / 0
except:
    # Escribe el mensaje de error aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-try-except').value, 'output-try-except')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Ejecutar Protegido
                    </button>
                </div>
                <div id="output-try-except" class="code-output p-4 text-sm mt-4">
                    <p class="text-gray-500">Probando seguridad...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Error en el cálculo",
                matchType: "include",
                requiredCode: "except",
                hint: "Usa except: y debajo print('Error en el cálculo')"
            }
        },
        {
            title: "List Comprehensions",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Listas en una Línea</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Es la forma más "Pythonica" de crear listas nuevas basadas en otras. Permite transformar o filtrar datos en una sola línea de código elegante.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Forma Tradicional</h4>
                            <code class="text-xs text-gray-500 block">
                                nueva = []<br>
                                for x in lista:<br>
                                &nbsp;&nbsp;nueva.append(x * 2)
                            </code>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">List Comprehension</h4>
                            <code class="text-xs text-blue-400 block p-2 rounded bg-black/40">
                                nueva = [x * 2 for x in lista]
                            </code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        Dada la lista <code>numeros = [1, 2, 3]</code>, usa una List Comprehension para crear una nueva lista con los números elevados al cuadrado (** 2). Imprime la nueva lista.
                    </p>
                    <textarea id="code-list-comp" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="6">numeros = [1, 2, 3]
# Crea la lista pro aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-list-comp').value, 'output-list-comp')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Generar Lista Pro
                    </button>
                </div>
                <div id="output-list-comp" class="code-output p-4 text-sm mt-4">
                    <p class="text-gray-500">Generando lista...</p>
                </div>
            `,
            validation: {
                expectedOutput: "[1, 4, 9]",
                matchType: "include",
                requiredCode: "[",
                hint: "Escribe: cuadrados = [n**2 for n in numeros]"
            }
        }
    ]
});