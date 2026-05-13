window.modules.push({
    id: 4,
    title: "Tomando Decisiones",
    icon: "fa-question-circle",
    description: "Enseña a tu programa a tomar decisiones con if y else.",
    intro: `
        <div class="neon-box p-8 mb-8 text-center">
            <div class="text-6xl mb-6 text-yellow-400"><i class="fas fa-code-branch"></i></div>
            <h3 class="text-3xl font-bold mb-4 text-white">Tomando Decisiones</h3>
            <p class="text-gray-300 mb-8 text-lg">
                Hasta ahora, tu código seguía una línea recta. Pero la vida real está llena de caminos y opciones.
                En programación, usamos condiciones para decidir qué camino tomar.
            </p>
            <div class="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                <div class="neon-box-secondary p-4">
                    <div class="text-green-400 font-bold mb-2">SI (IF) llueve...</div>
                    <div class="text-sm text-gray-400">Llevo paraguas</div>
                </div>
                <div class="neon-box-secondary p-4">
                    <div class="text-red-400 font-bold mb-2">SI NO (ELSE)...</div>
                    <div class="text-sm text-gray-400">Voy al parque</div>
                </div>
            </div>
        </div>
    `,
    lessons: [
        {
            title: "La Sentencia If",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Lógica Condicional</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Los programas inteligentes toman decisiones basándose en condiciones. La herramienta fundamental para esto es la sentencia <code>if</code> (si condicional).
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-yellow-500">
                            <h4 class="text-xl font-bold text-white mb-3">La Estructura</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Un <code>if</code> evalúa una expresión. Si es <strong>True</strong> (Verdadera), el código indentado se ejecuta.
                            </p>
                            <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">
                                if saldo > 0:<br>
                                &nbsp;&nbsp;print("Tienes dinero")
                            </code>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-red-500">
                            <h4 class="text-xl font-bold text-white mb-3">Indentación</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Python usa espacios para saber qué líneas pertenecen al <code>if</code>. Se llama bloque de código.
                            </p>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Operadores de Comparación</h4>
                        <ul class="text-sm text-gray-400 grid grid-cols-2 gap-2">
                            <li><code>></code> Mayor que</li>
                            <li><code><</code> Menor que</li>
                            <li><code>==</code> Igual a</li>
                            <li><code>!=</code> Diferente de</li>
                        </ul>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Verificando Edad</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Crea una condición que verifique si la variable <code>edad</code> es mayor o igual a 18. Si es así, imprime "Mayor de edad".
                    </p>
                    <textarea id="code-if-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5">edad = 20
# Tu código aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-if-1').value, 'output-if-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Ejecutar Condición
                    </button>
                </div>
                <div id="output-if-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Analizando condición...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Mayor de edad",
                matchType: "exact",
                hint: "Usa if edad >= 18: y no olvides los dos puntos y la sangría."
            }
        },
        {
            title: "Si No... (Else)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Caminos Alternativos</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        ¿Qué pasa si la condición del <code>if</code> es falsa? Para manejar el "caso contrario", usamos la sentencia <code>else</code>.
                    </p>
                    
                    <div class="bg-black/30 p-4 rounded border border-gray-700 mb-6">
                        <h5 class="text-white font-bold text-sm mb-2">Ejemplo Visual</h5>
                        <p class="text-sm text-gray-400 mb-4">
                            Si la condición es verdadera → Se ejecuta el bloque <strong>if</strong>.<br>
                            Si la condición es falsa → Se ejecuta el bloque <strong>else</strong>.
                        </p>
                        <code class="text-xs text-blue-400 block bg-black/40 p-2 rounded">
                            if hora < 12:<br>
                            &nbsp;&nbsp;print("Buen día")<br>
                            else:<br>
                            &nbsp;&nbsp;print("Buenas tardes")
                        </code>
                    </div>

                    <div class="neon-box-secondary p-6 border-l-2 border-neon-green">
                        <h4 class="text-lg font-bold text-white mb-2">Regla de Oro</h4>
                        <p class="text-gray-300 text-sm">
                            El <code>else</code> no lleva condición propia y siempre debe ir alineado con su respectivo <code>if</code>.
                        </p>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Control de Clima</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Completa el código: si la <code>temperatura</code> es mayor a 30 imprime "Calor", de lo contrario imprime "Fresco".
                    </p>
                    <textarea id="code-else-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="6">temperatura = 25

if temperatura > 30:
    print("Calor")
# Agrega el else aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-else-1').value, 'output-else-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Clima
                    </button>
                </div>
                <div id="output-else-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Tomando una decisión...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Fresco",
                matchType: "exact",
                hint: "Escribe else: (con dos puntos) y debajo print(\"Fresco\") con sangría."
            }
        },
        {
            title: "Múltiples Opciones (Elif)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Encadenando Condiciones</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Cuando hay más de dos posibilidades, usamos <code>elif</code> (abreviatura de 'else if'). Permite evaluar múltiples pruebas en cadena.
                    </p>
                    
                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo de Múltiples Vías</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Es como un semáforo: solo un camino se ejecuta a la vez.
                        </p>
                        <code class="text-xs text-yellow-400 block bg-black/40 p-3 rounded">
                            color = "amarillo"<br><br>
                            if color == "rojo":<br>
                            &nbsp;&nbsp;print("Para")<br>
                            elif color == "amarillo":<br>
                            &nbsp;&nbsp;print("Precaución")<br>
                            else:<br>
                            &nbsp;&nbsp;print("Siga")
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Sistema de Calificación</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Si la <code>puntuacion</code> es 100 imprime "Perfecto". <br>
                        Si es mayor a 80 imprime "Genial". <br>
                        Para cualquier otro caso imprime "Sigue intentando".
                    </p>
                    <textarea id="code-elif-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="8">puntuacion = 85

if puntuacion == 100:
    print("Perfecto")
# Tu código aquí (usa elif y else):
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-elif-1').value, 'output-elif-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Calificar
                    </button>
                </div>
                <div id="output-elif-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Evaluando múltiples vías...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Genial",
                matchType: "exact",
                hint: "Usa elif puntuacion > 80: para el segundo caso y finaliza con else:."
            }
        },
        {
            title: "Condiciones Anidadas",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Un IF dentro de otro IF</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        A veces necesitas cumplir una condición para evaluar otra. Esto se llama <strong>anidación</strong>. Es como entrar a una habitación y luego abrir un armario.
                    </p>
                    
                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo de Filtro Doble</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Primero revisas si hay conexión, y luego si el usuario tiene permiso:
                        </p>
                        <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                            conectado = True<br>
                            admin = False<br><br>
                            if conectado:<br>
                            &nbsp;&nbsp;if admin:<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;print("Acceso Total")<br>
                            &nbsp;&nbsp;else:<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;print("Solo lectura")
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        Dada la variable <code>edad = 20</code>, crea un IF que revise si es mayor de 18, y DENTRO de ese IF, otro que revise si tiene <code>entrada = True</code>. Si cumple ambos, imprime "Bienvenido".
                    </p>
                    <textarea id="code-cond-nested" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="8">edad = 20
entrada = True

# Crea tu IF anidado aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-cond-nested').value, 'output-cond-nested')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Anidación
                    </button>
                </div>
                <div id="output-cond-nested" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Evaluando niveles...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Bienvenido",
                matchType: "include",
                hint: "Escribe un if dentro de otro. ¡No olvides la indentación doble!"
            }
        }
    ]
});
