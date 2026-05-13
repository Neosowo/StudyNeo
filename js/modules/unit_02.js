window.modules.push({
    id: 2,
    title: "Variables y Datos",
    icon: "fa-database",
    description: "Aprende a guardar información y usar los tipos de datos básicos.",
    intro: `
        <div class="neon-box p-8 mb-8 text-center">
            <h3 class="text-3xl font-bold mb-6 text-white text-center">La Memoria de la Computadora</h3>
            <p class="text-gray-300 mb-8 text-lg text-center">
                Imagina que tienes miles de cajitas vacías. En programación, usamos esas cajitas para guardar información:
                nombres, puntuaciones, contraseñas, ¡de todo!
            </p>
            <div class="flex justify-center gap-8 mb-8">
                <div class="relative w-32 h-32 bg-gray-800 border-2 border-neon-green rounded-lg flex items-center justify-center">
                    <span class="text-4xl">📦</span>
                    <div class="absolute -bottom-8 text-white font-mono">variable</div>
                </div>
                <div class="text-4xl flex items-center text-white">⬅️</div>
                <div class="relative w-32 h-32 bg-gray-800 border-2 border-blue-500 rounded-lg flex items-center justify-center">
                    <span class="text-2xl text-white font-bold">"Dato"</span>
                    <div class="absolute -bottom-8 text-white font-mono">valor</div>
                </div>
            </div>
        </div>
    `,
    lessons: [
        {
            title: "¿Qué es una Variable?",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Etiquetando Información</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Una <strong>variable</strong> es un nombre que apunta a un valor guardado en la memoria. Es como una caja etiquetada donde puedes meter, sacar o cambiar contenido.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Asignación</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Usamos el signo <code>=</code> para guardar el valor de la derecha en el nombre de la izquierda.
                            </p>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">Sintaxis</h4>
                            <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">
                                score = 10<br>
                                nombre = "Neo"
                            </code>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Reglas de Oro</h4>
                        <ul class="text-sm text-gray-400 space-y-1">
                            <li>- No pueden empezar con números.</li>
                            <li>- No pueden tener espacios (usa_guiones_bajos).</li>
                            <li>- Diferencian entre MAYÚSCULAS y minúsculas.</li>
                        </ul>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Desafío: Identidad</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Crea una variable llamada <code>heroe</code> con el valor "Batman" y luego imprímela usando <code>print()</code>.
                    </p>
                    <textarea id="code-var-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5"># Crea tu variable aquí:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-var-1').value, 'output-var-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Variable
                    </button>
                </div>
                <div id="output-var-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Esperando asignación...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Batman",
                matchType: "include",
                hint: "Escribe heroe = \"Batman\" y luego print(heroe)."
            }
        },
        {
            title: "Los 4 Tipos Básicos",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Diversidad de Datos</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Python reconoce automáticamente qué tipo de dato estás usando. Estos son los cuatro "sabores" fundamentales de la información:
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="neon-box-dark p-4 border-l-4 border-blue-500">
                            <h5 class="font-bold text-white">Enteros (int)</h5>
                            <p class="text-[11px] text-gray-400">Números sin decimales: <code>10, -5, 0</code></p>
                        </div>
                        <div class="neon-box-dark p-4 border-l-4 border-purple-500">
                            <h5 class="font-bold text-white">Flotantes (float)</h5>
                            <p class="text-[11px] text-gray-400">Números con decimales: <code>3.14, 9.99</code></p>
                        </div>
                        <div class="neon-box-dark p-4 border-l-4 border-yellow-500">
                            <h5 class="font-bold text-white">Cadenas (str)</h5>
                            <p class="text-[11px] text-gray-400">Texto entre comillas: <code>"Hola", 'Neo'</code></p>
                        </div>
                        <div class="neon-box-dark p-4 border-l-4 border-red-500">
                            <h5 class="font-bold text-white">Booleanos (bool)</h5>
                            <p class="text-[11px] text-gray-400">Solo dos valores: <code>True, False</code></p>
                        </div>
                    </div>
                    <code class="text-xs text-blue-400 block bg-black/40 p-3 rounded mt-6">
                        # Ejemplo de cada uno:<br>
                        a = 5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# int<br>
                        b = 3.5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# float<br>
                        c = "Hola" &nbsp;&nbsp;&nbsp;# str<br>
                        d = True &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# bool
                    </code>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Detectando Tipos</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Ejecuta este código para ver cómo Python identifica cada variable usando la función <code>type()</code>.
                    </p>
                    <textarea id="code-types" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="6">texto = "Fundamentos"
numero = 100
decimal = 3.14

print(type(texto))
print(type(numero))
print(type(decimal))</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-types').value, 'output-types')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Analizar Tipos
                    </button>
                </div>
                <div id="output-types" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Observa las clases...</p>
                </div>
            `,
            validation: {
                expectedOutput: "str",
                matchType: "include",
                requiredCode: "type",
                hint: "Presiona el botón Ejecutar para ver el análisis de tipos."
            }
        },
        {
            title: "Operaciones Matemáticas",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Calculadora Inteligente</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Puedes usar variables para realizar cálculos matemáticos. Python usará los valores guardados en ellas para resolver la operación.
                    </p>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                        <div class="neon-box-dark p-4">
                            <span class="text-white block font-bold">+ - * /</span>
                            <span class="text-[10px] text-gray-500 uppercase">Basics</span>
                        </div>
                        <div class="neon-box-dark p-4">
                            <span class="text-white block font-bold">//</span>
                            <span class="text-[10px] text-gray-500 uppercase">División Entera</span>
                        </div>
                        <div class="neon-box-dark p-4">
                            <span class="text-white block font-bold">%</span>
                            <span class="text-[10px] text-gray-500 uppercase">Módulo</span>
                        </div>
                        <div class="neon-box-dark p-4">
                            <span class="text-white block font-bold">**</span>
                            <span class="text-[10px] text-gray-500 uppercase">Potencia</span>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo Rápido</h4>
                        <code class="text-xs text-yellow-400 block bg-black/40 p-2 rounded mb-3">
                            radio = 10<br>
                            pi = 3.14<br>
                            circulo = pi * (radio ** 2)
                        </code>
                        <p class="text-gray-300 text-sm">
                            En lugar de <code>x = x + 1</code>, los profesionales usan <code>x += 1</code>.
                        </p>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Cálculo de Área</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Si el lado de un cuadrado es 5, calcula el área (lado * lado) y guárdala en una variable llamada <code>area</code>. Luego imprímela.
                    </p>
                    <textarea id="code-math-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5">lado = 5
# Calcula el área aquí:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-math-1').value, 'output-math-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Calcular
                    </button>
                </div>
                <div id="output-math-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Esperando resultado...</p>
                </div>
            `,
            validation: {
                expectedOutput: "25",
                matchType: "include",
                hint: "Escribe area = lado * lado y luego print(area)."
            }
        },
        {
            title: "Lógica y Comparación",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Buscando la Verdad</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Los operadores lógicos nos permiten combinar condiciones. Son la base de la inteligencia artificial y la toma de decisiones.
                    </p>
                    
                    <div class="grid md:grid-cols-3 gap-4 mb-8">
                        <div class="neon-box-dark p-4 border-t-2 border-blue-500">
                            <h5 class="text-white font-bold mb-1">AND</h5>
                            <p class="text-[10px] text-gray-400">Verdadero si AMBOS son ciertos.</p>
                        </div>
                        <div class="neon-box-dark p-4 border-t-2 border-neon-green">
                            <h5 class="text-white font-bold mb-1">OR</h5>
                            <p class="text-[10px] text-gray-400">Verdadero si AL MENOS UNO es cierto.</p>
                        </div>
                        <div class="neon-box-dark p-4 border-t-2 border-red-500">
                            <h5 class="text-white font-bold mb-1">NOT</h5>
                            <p class="text-[10px] text-gray-400">Invierte el valor (True → False).</p>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo de Decisión</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Imagina que para entrar a un juego necesitas nivel 10 <b>Y</b> tener el pase:
                        </p>
                        <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                            nivel = 15<br>
                            tiene_pase = True<br><br>
                            # ¿Cumple ambas?<br>
                            print(nivel >= 10 and tiene_pase) # True
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">El Portero Virtual</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Verifica si una persona puede entrar al club. Debe tener <code>edad</code> mayor o igual a 18 <b>y</b> tener <code>dinero</code> mayor o igual a 50. Imprime el resultado de esa comparación lógica.
                    </p>
                    <textarea id="code-logic-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5">edad = 20
dinero = 100

# Imprime el resultado de (edad >= 18 and dinero >= 50):
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-logic-1').value, 'output-logic-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Lógica
                    </button>
                </div>
                <div id="output-logic-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Evaluando condiciones...</p>
                </div>
            `,
            validation: {
                expectedOutput: "True",
                matchType: "include",
                requiredCode: "and",
                hint: "Escribe print(edad >= 18 and dinero >= 50)"
            }
        },
        {
            title: "Entradas y Escapes",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Interactuando con el Usuario</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        La función <code>input()</code> permite que el programa pida información al usuario. <b>¡Cuidado!</b> Todo lo que recibe es texto (string), así que si quieres números deberás usar <code>int()</code> o <code>float()</code>.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-6 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-yellow-500">
                            <h4 class="text-xl font-bold text-white mb-3">La Trampa del input()</h4>
                            <p class="text-gray-400 text-sm mb-2">Todo lo que entra es texto. Para sumar números, debes convertirlos:</p>
                            <code class="text-xs text-yellow-400 block p-3 bg-black/40 rounded">
                                edad = input("Tu edad: ") # "25"<br>
                                edad = int(edad) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# 25 (Ahora es número)
                            </code>
                        </div>
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">Escapes</h4>
                            <p class="text-gray-400 text-sm mb-2"><code>\\n</code> es enter, <code>\\t</code> es tabulación:</p>
                            <code class="text-xs text-blue-400 block p-3 bg-black/40 rounded">print("Línea 1 \\n Línea 2")</code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Mensaje Multilínea</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Usa <code>print()</code> para mostrar el nombre "Ana" y en la línea de abajo la edad "25" usando el carácter de escape <code>\\n</code> en una sola cadena.
                    </p>
                    <textarea id="code-escape-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="4"># Imprime "Ana\\n25":
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-escape-1').value, 'output-escape-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Ejecutar Salto
                    </button>
                </div>
                <div id="output-escape-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Procesando escape...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Ana\n25",
                matchType: "exact",
                requiredCode: "\\n",
                hint: "Escribe print(\"Ana\\n25\")"
            }
        },
        {
            title: "Reglas de Oro (Naming)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Nombrando Variables</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        En Python no puedes poner cualquier nombre. Existen reglas obligatorias y convenciones de estilo (PEP 8) que todo programador debe seguir.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-red-500">
                            <h4 class="text-xl font-bold text-white mb-3">Lo Prohibido</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                • No empezar con números (1variable ❌).<br>
                                • No usar espacios (mi variable ❌).<br>
                                • No usar símbolos como @ o #.
                            </p>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Snake Case (✓)</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Es el estándar en Python. Usa minúsculas y separa palabras con guiones bajos:
                            </p>
                            <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">
                                puntaje_maximo = 100
                            </code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        Crea una variable usando <b>snake_case</b> que se llame <code>nombre_usuario</code> y asígnale tu nombre. Luego imprímela.
                    </p>
                    <textarea id="code-var-naming" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="3"></textarea>
                    <button onclick="runPythonCode(document.getElementById('code-var-naming').value, 'output-var-naming')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Validar Nombre
                    </button>
                </div>
                <div id="output-var-naming" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Revisando estilo...</p>
                </div>
            `,
            validation: {
                expectedOutput: "",
                matchType: "custom",
                requiredCode: "nombre_usuario",
                hint: "Escribe nombre_usuario = 'Tu Nombre'"
            }
        },
        {
            title: "Operadores Especiales (%, //, **)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Matemáticas Avanzadas</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Además de sumar y restar, Python tiene operadores geniales para situaciones específicas como saber si un número es par o calcular potencias.
                    </p>
                    
                    <div class="grid md:grid-cols-3 gap-6">
                        <div class="neon-box-dark p-4 border-b-2 border-neon-green">
                            <h4 class="text-neon-green font-bold mb-2">Módulo (%)</h4>
                            <p class="text-xs text-gray-400">Devuelve el residuo de una división. Útil para saber si un número es par (<code>n % 2 == 0</code>).</p>
                        </div>
                        <div class="neon-box-dark p-4 border-b-2 border-yellow-500">
                            <h4 class="text-yellow-400 font-bold mb-2">Piso (//)</h4>
                            <p class="text-xs text-gray-400">División entera. Elimina los decimales sin redondear.</p>
                        </div>
                        <div class="neon-box-dark p-4 border-b-2 border-blue-500">
                            <h4 class="text-blue-400 font-bold mb-2">Potencia (**)</h4>
                            <p class="text-xs text-gray-400">Eleva un número a otro. <code>2 ** 3</code> es 2 al cubo.</p>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                         Calcula cuánto es <b>10 dividido para 3</b> de forma entera (sin decimales) usando el operador de piso <code>//</code>.
                    </p>
                    <textarea id="code-math-pro" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="3"></textarea>
                    <button onclick="runPythonCode(document.getElementById('code-math-pro').value, 'output-math-pro')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Calcular Piso
                    </button>
                </div>
                <div id="output-math-pro" class="code-output p-4 text-sm mt-4">
                    <p class="text-gray-500">Esperando cálculo...</p>
                </div>
            `,
            validation: {
                expectedOutput: "3",
                matchType: "include",
                requiredCode: "//",
                hint: "Escribe print(10 // 3)"
            }
        }
    ]
});
