window.modules.push({
    id: 7,
    title: "Diccionarios",
    icon: "fa-book",
    description: "Guarda datos con etiquetas personalizadas.",
    intro: `
        <div class="neon-box p-8 mb-8 text-center">
            <h3 class="text-3xl font-bold mb-6 text-white text-center">Datos Organizados con Nombres</h3>
            <p class="text-gray-300 mb-8 text-lg text-center">
                Las listas usan numeros (0, 1, 2...) para identificar elementos.
                Los diccionarios usan nombres descriptivos (claves) para encontrar valores rapidamente.
            </p>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="neon-box-dark p-6">
                    <h4 class="text-red-400 font-bold mb-3">Lista (Indices Numericos)</h4>
                    <pre class="text-xs text-gray-400">persona = ["Juan", 25, "Madrid"]
print(persona[0])  # Juan
# Confuso: ¿Que es [1]?</pre>
                </div>
                <div class="neon-box-dark p-6 border border-neon-green">
                    <h4 class="text-neon-green font-bold mb-3">Diccionario (Claves)</h4>
                    <pre class="text-xs text-white">persona = {
    "nombre": "Juan",
    "edad": 25,
    "ciudad": "Madrid"
}
print(persona["nombre"])  # Claro!</pre>
                </div>
            </div>
        </div>
    `,
    lessons: [
        {
            title: "¿Qué son los Diccionarios?",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Pares Clave-Valor</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Un diccionario guarda información usando etiquetas descriptivas llamadas <strong>claves</strong> en lugar de números. Son la base de casi todas las estructuras de datos modernas. Se definen usando llaves <code>{ }</code>.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-yellow-500">
                            <h4 class="text-xl font-bold text-white mb-3">La Clave</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Es la etiqueta única que identifica al dato. Suele ser un texto.
                            </p>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">El Valor</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Es el contenido asociado a la clave. Puede ser cualquier tipo de dato.
                            </p>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Sintaxis</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Creamos una estructura mapeada con llaves:
                        </p>
                        <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">
                            carro = {"marca": "Tesla", "año": 2024}
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Base de Datos de Jugador</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Crea un diccionario llamado <code>jugador</code> con dos claves: "nivel" (valor 1) y "puntos" (valor 100). Imprime el diccionario al final.
                    </p>
                    <textarea id="code-dict-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5"># Crea tu diccionario aquí:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-dict-1').value, 'output-dict-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Ver Jugador
                    </button>
                </div>
                <div id="output-dict-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Mapeando claves...</p>
                </div>
            `,
            validation: {
                expectedOutput: "{'nivel': 1, 'puntos': 100}",
                matchType: "include",
                hint: "Usa jugador = {\"nivel\": 1, \"puntos\": 100} y no olvides el print."
            }
        },
        {
            title: "Modificar y Agregar",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Diccionarios Dinámicos</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Los diccionarios son mutables. Podemos cambiar un valor existente o agregar una clave nueva simplemente asignándole un valor.
                    </p>
                    
                    <div class="bg-black/30 p-4 rounded border border-gray-700 mb-8">
                        <h5 class="text-white font-bold text-sm mb-2">Acceso y Asignación</h5>
                        <p class="text-sm text-gray-400 mb-2">Usamos corchetes para referirnos a la clave:</p>
                        <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">
                            user["edad"] = 26 # Actualiza<br>
                            user["ID"] = 99 &nbsp;&nbsp;# Crea nuevo
                        </code>
                    </div>

                    <div class="neon-box-secondary p-6 border-l-2 border-neon-green">
                        <h4 class="text-lg font-bold text-white mb-2">Dato Curioso</h4>
                        <p class="text-gray-300 text-sm">
                            Si la clave ya existe, se actualiza. Si no existe, Python la crea automáticamente al final del diccionario.
                        </p>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Configuración de App</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Dada la <code>app</code>, cambia el "volumen" a 100 y agrega una clave nueva llamada "tema" con el valor "oscuro".
                    </p>
                    <textarea id="code-dict-2" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="7">app = {"volumen": 50, "idioma": "es"}

# 1. Cambia volumen a 100
# 2. Agrega "tema": "oscuro"

print(app)</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-dict-2').value, 'output-dict-2')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Actualizar Configuración
                    </button>
                </div>
                <div id="output-dict-2" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Actualizando registro...</p>
                </div>
            `,
            validation: {
                expectedOutput: "'volumen': 100",
                matchType: "include",
                requiredCode: "tema",
                hint: "Escribe app['volumen'] = 100 y app['tema'] = 'oscuro'."
            }
        },
        {
            title: "Métodos Avanzados",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Inspeccionando el Diccionario</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Existen funciones integradas que nos permiten obtener por separado las claves o los valores de nuestro diccionario.
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div class="neon-box-dark p-4 border border-blue-900/50">
                            <h5 class="font-bold text-blue-400 mb-1">.keys()</h5>
                            <p class="text-[10px] text-gray-400 mb-2">Devuelve todas las claves.</p>
                            <code class="text-[10px] text-blue-300 block">d.keys()</code>
                        </div>
                        <div class="neon-box-dark p-4 border border-purple-900/50">
                            <h5 class="font-bold text-purple-400 mb-1">.values()</h5>
                            <p class="text-[10px] text-gray-400 mb-2">Devuelve todos los valores.</p>
                            <code class="text-[10px] text-purple-300 block">d.values()</code>
                        </div>
                        <div class="neon-box-dark p-4 border border-neon-green/50">
                            <h5 class="font-bold text-neon-green mb-1">.items()</h5>
                            <p class="text-[10px] text-gray-400 mb-2">Devuelve parejas completas.</p>
                            <code class="text-[10px] text-neon-green block bg-black/40 p-2 rounded">d.items() # [('a', 1)]</code>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo Visual de Métodos</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Así es como Python te devuelve los datos cuando usas estas funciones:
                        </p>
                        <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                            d = {"a": 1, "b": 2}<br><br>
                            print(d.keys()) &nbsp;&nbsp;# dict_keys(['a', 'b'])<br>
                            print(d.values()) # dict_values([1, 2])<br>
                            print(d.items()) &nbsp;# dict_items([('a', 1), ('b', 2)])
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Iteración Completa</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Usa el método <code>.items()</code> para imprimir todo el contenido del <code>stock</code>.
                    </p>
                    <textarea id="code-dict-3" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5">stock = {"pan": 10, "leche": 5}

# Imprime las parejas (items):
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-dict-3').value, 'output-dict-3')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Listar Items
                    </button>
                </div>
                <div id="output-dict-3" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Extrayendo datos...</p>
                </div>
            `,
            validation: {
                expectedOutput: "pan",
                matchType: "include",
                requiredCode: "items",
                hint: "El comando es print(stock.items())"
            }
        }
    ]
});
