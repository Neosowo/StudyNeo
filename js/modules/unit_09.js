window.modules.push({
    id: 9,
    title: "Strings y Aleatoriedad",
    icon: "fa-magic",
    description: "Métodos avanzados de texto y el módulo random.",
    intro: `
        <div class="neon-box p-8 mb-8 text-center">
            <h3 class="text-3xl font-bold mb-6 text-white text-center">El Poder de los Textos</h3>
            <p class="text-gray-300 mb-8 text-lg text-center">
                Aprenderemos a manipular texto como profesionales y a generar datos aleatorios para juegos o simulaciones.
            </p>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="neon-box-dark p-6">
                    <h4 class="text-blue-400 font-bold mb-3">Métodos de String</h4>
                    <p class="text-xs text-gray-400">Limpieza, búsqueda y transformación de texto.</p>
                </div>
                <div class="neon-box-dark p-6 border border-purple-500">
                    <h4 class="text-purple-400 font-bold mb-3">Módulo Random</h4>
                    <p class="text-xs text-white">Generación de números al azar y elecciones aleatorias.</p>
                </div>
            </div>
        </div>
    `,
    lessons: [
        {
            title: "Métodos de String",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Manipulación de Texto</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Los strings en Python tienen métodos integrados para transformarlos. Recuerda que los strings son <b>inmutables</b>, así que estos métodos devuelven un nuevo string.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-4 mb-8">
                        <div class="neon-box-dark p-4 border-l-2 border-blue-500">
                            <h5 class="font-bold text-white mb-1">.upper() / .lower()</h5>
                            <p class="text-xs text-gray-400">Todo a mayúsculas o minúsculas.</p>
                            <code class="text-[10px] text-blue-400 block mt-1">"hola".upper() # "HOLA"</code>
                        </div>
                        <div class="neon-box-dark p-4 border-l-2 border-neon-green">
                            <h5 class="font-bold text-white mb-1">.strip()</h5>
                            <p class="text-xs text-gray-400">Elimina espacios en blanco a los lados.</p>
                            <code class="text-[10px] text-neon-green block mt-1">"  sol  ".strip() # "sol"</code>
                        </div>
                        <div class="neon-box-dark p-4 border-l-2 border-red-500">
                            <h5 class="font-bold text-white mb-1">.replace(antigo, nuevo)</h5>
                            <p class="text-xs text-gray-400">Reemplaza un texto por otro.</p>
                            <code class="text-[10px] text-red-400 block mt-1">"abc".replace("a", "z") # "zbc"</code>
                        </div>
                        <div class="neon-box-dark p-4 border-l-2 border-yellow-500">
                            <h5 class="font-bold text-white mb-1">.count(valor)</h5>
                            <p class="text-xs text-gray-400">Cuenta cuántas veces aparece algo.</p>
                            <code class="text-[10px] text-yellow-400 block mt-1">"banana".count("a") # 3</code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Limpiador de Nombres</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Dada la variable <code>sucio = "  pyThOn  "</code>, conviértela a minúsculas y elimina los espacios laterales. Imprime el resultado.
                    </p>
                    <textarea id="code-str-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5">sucio = "  pyThOn  "
# Limpia el string aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-str-1').value, 'output-str-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Limpiar Texto
                    </button>
                </div>
                <div id="output-str-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Procesando string...</p>
                </div>
            `,
            validation: {
                expectedOutput: "python",
                matchType: "include",
                requiredCode: "strip",
                hint: "Usa sucio.lower().strip()"
            }
        },
        {
            title: "Números al Azar",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Generando Números</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Para usar el azar en Python usamos el módulo <code>random</code>. Piensa en un módulo como una caja de herramientas extra que debes abrir antes de usar.
                    </p>
                    
                    <div class="space-y-6 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-yellow-500">
                            <h4 class="text-white font-bold mb-2">Paso 1: Importar</h4>
                            <p class="text-sm text-gray-400 mb-3">Siempre debe ir en la primera línea de tu código:</p>
                            <code class="text-xs text-yellow-400 block bg-black/40 p-2 rounded">import random</code>
                        </div>

                        <div class="neon-box-dark p-6 border-l-2 border-purple-500">
                            <h4 class="font-bold text-purple-400 mb-2">Paso 2: Usar randint(a, b)</h4>
                            <p class="text-sm text-gray-400 mb-3">Genera un número entero entre <b>a</b> y <b>b</b> (ambos incluidos).</p>
                            <code class="text-xs text-purple-300 block bg-black/40 p-2 rounded">n = random.randint(1, 10)</code>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo Completo</h4>
                        <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                            import random<br><br>
                            numero = random.randint(1, 100)<br>
                            print(numero)
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Dado Virtual</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Importa el módulo <code>random</code> y genera un número aleatorio entre 1 y 6. Imprime el resultado.
                    </p>
                    <textarea id="code-rand-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="6">import random

# Genera e imprime tu número aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-rand-1').value, 'output-rand-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Lanzar Dado
                    </button>
                </div>
                <div id="output-rand-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Lanzando...</p>
                </div>
            `,
            validation: {
                expectedOutput: "",
                matchType: "custom",
                requiredCode: "randint",
                hint: "Usa random.randint(1, 6)"
            }
        },
        {
            title: "Elecciones Aleatorias",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Sorteos con Listas</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        A veces no queremos un número, sino elegir un elemento al azar de una lista (como un nombre o un color). Para eso usamos <code>random.choice()</code>.
                    </p>

                    <div class="neon-box-dark p-6 border-l-2 border-blue-500 mb-8">
                        <h4 class="font-bold text-blue-400 mb-2">Uso de choice(lista)</h4>
                        <p class="text-sm text-gray-400 mb-3">Toma una lista y te devuelve uno de sus elementos al azar.</p>
                        <code class="text-xs text-blue-300 block bg-black/40 p-2 rounded">
                            fruta = random.choice(["🍎", "🍌", "🍇"])
                        </code>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo de Sorteo</h4>
                        <code class="text-xs text-yellow-400 block bg-black/40 p-3 rounded">
                            import random<br><br>
                            premios = ["💻", "📱", "🎧"]<br>
                            ganado = random.choice(premios)<br>
                            print("Has ganado un: " + ganado)
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">La Moneda de la Suerte</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Importa <code>random</code>. Crea una lista llamada <code>moneda</code> con "Cara" y "Cruz". Usa <code>choice</code> para elegir una cara e imprímela.
                    </p>
                    <textarea id="code-rand-2" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="7">import random

# Crea la lista y elige aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-rand-2').value, 'output-rand-2')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Lanzar Moneda
                    </button>
                </div>
                <div id="output-rand-2" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Girando...</p>
                </div>
            `,
            validation: {
                expectedOutput: "",
                matchType: "custom",
                requiredCode: "choice",
                hint: "Usa random.choice(moneda)"
            }
        },
        {
            title: "Mezclando el Azar (Shuffle)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Desordenando Listas</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Además de elegir un solo elemento, a veces queremos desordenar una lista completa (como barajar un mazo de cartas). Para eso usamos <code>random.shuffle()</code>.
                    </p>
                    
                    <div class="neon-box-secondary p-6 mb-8">
                        <h4 class="font-bold text-white mb-2">Importante</h4>
                        <p class="text-gray-300 text-sm">
                            <code>random.shuffle(lista)</code> modifica la lista original directamente. No devuelve una lista nueva.
                        </p>
                    </div>

                    <div class="neon-box-dark p-6 border-l-2 border-purple-500">
                        <h4 class="font-bold text-purple-400 mb-2">Sorteo de Grupos (sample)</h4>
                        <p class="text-sm text-gray-400 mb-3">Si quieres elegir varios elementos sin que se repitan, usa <code>random.sample(lista, cantidad)</code>.</p>
                        <code class="text-xs text-purple-300 block bg-black/40 p-2 rounded">random.sample(premios, 2)</code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        Dada la lista <code>numeros = [1, 2, 3, 4, 5]</code>, usa <code>random.shuffle(numeros)</code> para desordenarla y luego imprime la lista.
                    </p>
                    <textarea id="code-rand-shuffle" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="7">import random
numeros = [1, 2, 3, 4, 5]

# Desordena e imprime aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-rand-shuffle').value, 'output-rand-shuffle')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Barajar
                    </button>
                </div>
                <div id="output-rand-shuffle" class="code-output p-4 text-sm mt-4">
                    <p class="text-gray-500">Mezclando...</p>
                </div>
            `,
            validation: {
                expectedOutput: "",
                matchType: "custom",
                requiredCode: "shuffle",
                hint: "Usa random.shuffle(numeros) y luego print(numeros)"
            }
        }
    ]
});
