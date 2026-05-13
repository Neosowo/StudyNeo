window.modules.push({
    id: 6,
    title: "Funciones",
    icon: "fa-cubes",
    description: "Crea tus propias herramientas reutilizables.",
    intro: `
        <div class="neon-box p-8 mb-8">
            <h3 class="text-3xl font-bold mb-6 text-white text-center">Modulariza tu Codigo</h3>
            <p class="text-gray-300 mb-8 text-lg text-center">
                Una función es como una caja de herramientas personalizada.
                La creas una vez y la usas mil veces sin reescribir codigo.
            </p>
            <div class="grid md:grid-cols-3 gap-6">
                <div class="neon-box-dark p-6 text-center">
                    <div class="text-4xl text-blue-400 mb-3"><i class="fas fa-inbox"></i></div>
                    <h4 class="text-white font-bold mb-2">Entrada</h4>
                    <p class="text-sm text-gray-400">Parametros que le das</p>
                </div>
                <div class="neon-box-dark p-6 text-center">
                    <div class="text-4xl text-yellow-400 mb-3"><i class="fas fa-cog"></i></div>
                    <h4 class="text-white font-bold mb-2">Proceso</h4>
                    <p class="text-sm text-gray-400">El codigo que ejecuta</p>
                </div>
                <div class="neon-box-dark p-6 text-center">
                    <div class="text-4xl text-neon-green mb-3"><i class="fas fa-share"></i></div>
                    <h4 class="text-white font-bold mb-2">Salida</h4>
                    <p class="text-sm text-gray-400">El resultado que devuelve</p>
                </div>
            </div>
        </div>
    `,
    lessons: [
        {
            title: "Definiendo Funciones",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Tu Primera Herramienta</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Una función es un bloque de código reutilizable que realiza una tarea específica. En lugar de escribir el mismo código muchas veces, lo encerramos en una función y lo invocamos cuando lo necesitemos.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">Definición (def)</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Usamos la palabra <code>def</code> seguida del nombre de la función y paréntesis.
                            </p>
                            <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">
                                def hola():<br>
                                &nbsp;&nbsp;print("👋")
                            </code>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Llamada</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Para que el código dentro de la función se ejecute, debes "llamarla" por su nombre más tarde.
                            </p>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo Completo</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Primero defines la tarea y luego le das la orden de ejecutarse:
                        </p>
                        <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                            def saludo():<br>
                            &nbsp;&nbsp;print("¡Hola Mundo!")<br><br>
                            # Aquí llamamos a la función:<br>
                            saludo()
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Creando Herramientas</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Crea una función llamada <code>neo</code> que imprima "Aprendiendo Python". No olvides llamar a la función al final del script.
                    </p>
                    <textarea id="code-func-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="6"># Define tu función neo() aquí:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-func-1').value, 'output-func-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Activar Función
                    </button>
                </div>
                <div id="output-func-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Esperando llamada...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Aprendiendo Python",
                matchType: "exact",
                hint: "Escribe def neo(): con su respectivo print indentado, y luego llama neo() fuera de la definición."
            }
        },
        {
            title: "Parámetros",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Funciones Flexibles</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Los parámetros permiten que una función reciba datos del exterior. Esto la hace mucho más potente, ya que puede trabajar con valores diferentes en cada llamada.
                    </p>
                    
                    <div class="bg-black/30 p-4 rounded border border-gray-700 mb-8">
                        <h5 class="text-white font-bold text-sm mb-2">Paso de Datos</h5>
                        <p class="text-sm text-gray-400 mb-4">Los parámetros van dentro de los paréntesis en la definición:</p>
                        <code class="text-xs text-blue-400 block bg-black/40 p-2 rounded mb-3">
                            def saludo(nombre):<br>
                            &nbsp;&nbsp;print("Hola " + nombre)
                        </code>
                        <p class="text-xs text-gray-500 mt-2">Dentro de la función, 'nombre' actúa como una variable normal.</p>
                    </div>

                    <div class="neon-box-secondary p-6 border-l-2 border-yellow-500">
                        <h4 class="text-lg font-bold text-white mb-2">Argumentos</h4>
                        <p class="text-gray-300 text-sm">
                            Cuando llamas a la función, el valor que envías (ej: "Neo") se llama <strong>argumento</strong>.
                        </p>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Procesando Entradas</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Completa la función <code>doble(x)</code> para que imprima el resultado de multiplicar <code>x</code> por 2. Luego llama a la función pasando el número 5.
                    </p>
                    <textarea id="code-func-2" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="6">def doble(x):
    # Imprime x multiplicado por 2:
    
# Llama a doble pasando el 5:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-func-2').value, 'output-func-2')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Función
                    </button>
                </div>
                <div id="output-func-2" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Calculando con parámetros...</p>
                </div>
            `,
            validation: {
                expectedOutput: "10",
                matchType: "include",
                hint: "Dentro haz print(x * 2) y llama a la función con doble(5)."
            }
        },
        {
            title: "Return (Devolver Valores)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Resultados de Salida</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        A veces no queremos que la función imprima nada, sino que nos "devuelva" un resultado para usarlo más adelante. Para eso usamos <code>return</code>.
                    </p>
                    
                    <div class="space-y-4">
                        <div class="neon-box-dark p-4 border border-neon-green/30">
                            <h5 class="font-bold text-neon-green mb-1">Retorno Múltiple</h5>
                            <p class="text-sm text-gray-400 mb-2">Una función puede retornar varios valores:</p>
                            <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">return x, y</code>
                        </div>
                        
                        <div class="neon-box-dark p-4 border border-purple-900/50">
                            <h5 class="font-bold text-purple-400 mb-1">Parámetros por Defecto</h5>
                            <p class="text-sm text-gray-400 mb-2">Asigna un valor inicial por si no envían nada:</p>
                            <code class="text-xs text-purple-300 block bg-black/40 p-2 rounded">def saludar(n="Amigo"):</code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Capturando Resultados</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Crea una función llamada <code>sumar(a, b)</code> que retorne la suma de ambos. Luego guarda el resultado en una variable <code>total</code> e imprímela.
                    </p>
                    <textarea id="code-func-3" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="8"># Define sumar con return aquí:

# Llama a la función y muestra el resultado:
total = sumar(10, 20)
print(total)</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-func-3').value, 'output-func-3')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Calcular con Retorno
                    </button>
                </div>
                <div id="output-func-3" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Recuperando valor...</p>
                </div>
            `,
            validation: {
                expectedOutput: "30",
                matchType: "exact",
                requiredCode: "return",
                hint: "Dentro de la función usa return a + b."
            }
        },
        {
            title: "Alcance (Scope)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Local vs Global</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        No todas las variables son visibles en todo el código. El <strong>Scope</strong> define dónde "vive" una variable.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-red-500">
                            <h4 class="text-xl font-bold text-white mb-3">Local</h4>
                            <p class="text-gray-400 text-sm mb-2">Vive solo dentro de la función:</p>
                            <code class="text-xs text-red-400 block bg-black/40 p-2 rounded">def f(): x = 1</code>
                        </div>
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Global</h4>
                            <p class="text-gray-400 text-sm mb-2">Vive en todo el archivo:</p>
                            <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">x = 10 # Afuera</code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Probando Límites</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Ejecuta este código para ver cómo la variable <code>local_var</code> solo funciona dentro de la función.
                    </p>
                    <textarea id="code-scope-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="8">def mi_funcion():
    local_var = "Soy local"
    print(local_var)

mi_funcion()
# Intentar imprimir local_var afuera daría Error</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-scope-1').value, 'output-scope-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Scope
                    </button>
                </div>
                <div id="output-scope-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Observando visibilidad...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Soy local",
                matchType: "include",
                hint: "Simplemente pulsa Ejecutar para observar el comportamiento."
            }
        },
        {
            title: "Receta Maestra (Docstrings)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Documentación</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Un buen programador siempre explica para qué sirve su función. Usamos las triples comillas <code>"""</code> para crear <strong>docstrings</strong>.
                    </p>
                    
                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Estructura Ideal</h4>
                        <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                            def calcular_iva(precio):<br>
                            &nbsp;&nbsp;"""Calcula el 21% de un precio."""<br>
                            &nbsp;&nbsp;return precio * 0.21
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        Agrega un docstring (triple comilla) a la función <code>restar(a, b)</code> explicando brevemente qué hace. Luego el código para retornar a - b.
                    </p>
                    <textarea id="code-func-docs" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="6">def restar(a, b):
    # Agrega tu comentario """ """ aquí:
    
    return a - b</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-func-docs').value, 'output-func-docs')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Documento
                    </button>
                </div>
                <div id="output-func-docs" class="code-output p-4 text-sm mt-4">
                    <p class="text-gray-500">Esperando documentación...</p>
                </div>
            `,
            validation: {
                expectedOutput: "",
                matchType: "custom",
                requiredCode: '"""',
                hint: 'Usa """ Tu texto aquí """ justo debajo del def.'
            }
        },
        {
            title: "Argumentos Nombrados",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Orden vs Claridad</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Normalmente, Python asigna los argumentos por su posición. Pero puedes ser más explícito usando el nombre del parámetro. Esto hace que el código sea mucho más fácil de leer.
                    </p>
                    
                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Llamada Explicita</h4>
                        <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                            # No importa el orden si usas nombres:<br>
                            describir(animal="Gato", color="Negro")<br>
                            describir(color="Blanco", animal="Perro")
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        Dada la función <code>crear_perfil(nombre, edad)</code>, llámala usando argumentos nombrados para que el orden no importe. Usa <code>nombre="Neo"</code> y <code>edad=25</code>.
                    </p>
                    <textarea id="code-func-named" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="8">def crear_perfil(nombre, edad):
    print(f"Usuario: {nombre}, Edad: {edad}")

# Llama a la función aquí usando nombres:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-func-named').value, 'output-func-named')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Lanzar Perfil
                    </button>
                </div>
                <div id="output-func-named" class="code-output p-4 text-sm mt-4">
                    <p class="text-gray-500">Esperando perfil...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Usuario: Neo, Edad: 25",
                matchType: "include",
                requiredCode: "=",
                hint: "Escribe crear_perfil(nombre='Neo', edad=25)"
            }
        }
    ]
});
