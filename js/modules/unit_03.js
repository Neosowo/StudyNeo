window.modules.push({
    id: 3,
    title: "Listas en Python",
    icon: "fa-list",
    description: "Aprende a guardar múltiples datos en una sola variable.",
    intro: `
        <div class="neon-box p-8 mb-8 text-center">
            <div class="text-6xl mb-6 text-neon-green"><i class="fas fa-layer-group"></i></div>
            <h3 class="text-3xl font-bold mb-4 text-white">Coleccionando Datos</h3>
            <p class="text-gray-300 mb-8 text-lg">
                Las listas son como cajas con compartimentos donde puedes guardar lo que quieras: nombres, números o incluso otras listas.
            </p>
            <div class="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                <div class="neon-box-secondary p-4">
                    <div class="text-2xl text-white">0</div>
                    <div class="text-xs text-gray-500">Primer Item</div>
                </div>
                <div class="neon-box-secondary p-4">
                    <div class="text-2xl text-white">1</div>
                    <div class="text-xs text-gray-500">Segundo Item</div>
                </div>
                <div class="neon-box-secondary p-4 border-dashed border-gray-600">
                    <div class="text-2xl text-gray-600">+</div>
                    <div class="text-xs text-gray-600">Agregar</div>
                </div>
            </div>
        </div>
    `,
    lessons: [
        {
            title: "Creando Listas",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Estructura Básica</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        En Python, creamos listas usando corchetes <code>[]</code> y separando los elementos con comas. Pueden contener cualquier tipo de dato.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Sintaxis</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                <code>mi_lista = [1, 2, 3]</code>
                            </p>
                            <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">
                                compras = ["Pan", "Leche"]
                            </code>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">Diversidad</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Una lista puede tener textos y números mezclados.
                            </p>
                            <code class="text-xs text-blue-400 block bg-black/40 p-2 rounded">
                                datos = ["Hola", 123, True]
                            </code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Tu Inventario</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Crea una lista llamada <code>colores</code> que contenga: "rojo", "verde" y "azul". Luego imprímela.
                    </p>
                    <textarea id="code-list-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5"># Crea tu lista aquí:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-list-1').value, 'output-list-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Lista
                    </button>
                </div>
                <div id="output-list-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Esperando colección...</p>
                </div>
            `,
            validation: {
                expectedOutput: "['rojo', 'verde', 'azul']",
                matchType: "include",
                hint: "Escribe colores = ['rojo', 'verde', 'azul'] y luego print(colores)"
            }
        },
        {
            title: "Acceso por Índice",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Posiciones en la Lista</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Para obtener un elemento específico, usamos su <strong>índice</strong> entre corchetes. 
                        <strong>¡Dato vital!</strong> En programación siempre empezamos a contar desde <strong>0</strong>.
                    </p>
                    
                    <div class="bg-black/30 p-4 rounded border border-gray-700 mb-6">
                        <h5 class="text-white font-bold text-sm mb-2">Ejemplo Visual</h5>
                        <p class="text-sm text-gray-400 mb-3">
                            Lista: ["A", "B", "C"] <br>
                            Índice: &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;2
                        </p>
                        <code class="text-xs text-blue-400 block bg-black/40 p-2 rounded">
                            nombres = ["Ana", "Bob"]<br>
                            print(nombres[0]) # "Ana"
                        </code>
                    </div>

                    <div class="neon-box-secondary p-6 border-l-2 border-red-500">
                        <h4 class="text-lg font-bold text-white mb-2">Índices Negativos</h4>
                        <p class="text-gray-300 text-sm">
                            Python permite usar <code>-1</code> para obtener el último elemento, <code>-2</code> para el penúltimo, y así sucesivamente.
                        </p>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Acceso Preciso</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Dada la lista <code>frutas</code>, imprime únicamente la palabra "pera" accediendo a su posición.
                    </p>
                    <textarea id="code-list-2" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="6">frutas = ["manzana", "pera", "uva"]

# Imprime el segundo elemento:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-list-2').value, 'output-list-2')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Extraer Dato
                    </button>
                </div>
                <div id="output-list-2" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Buscando en memoria...</p>
                </div>
            `,
            validation: {
                expectedOutput: "pera",
                matchType: "exact",
                hint: "Recuerda que la primera posición es 0, así que la segunda es fruits[1]"
            }
        },
        {
            title: "Modificando Listas",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Listas Dinámicas</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Las listas son "mutables", lo que significa que puedes cambiar su contenido, agregar nuevos elementos o borrarlos en cualquier momento.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-4 mb-8">
                        <div class="neon-box-dark p-4 border-l-2 border-blue-500">
                            <h5 class="font-bold text-blue-400 mb-1">.append(valor)</h5>
                            <p class="text-xs text-gray-500 mb-2">Agrega al final.</p>
                            <code class="text-[10px] text-blue-400 block mt-1">lista.append(4)</code>
                        </div>
                        <div class="neon-box-dark p-4 border-l-2 border-purple-500">
                            <h5 class="font-bold text-purple-400 mb-1">.insert(pos, valor)</h5>
                            <p class="text-xs text-gray-500 mb-2">Agrega en posición exacta.</p>
                            <code class="text-[10px] text-purple-400 block mt-1">lista.insert(0, "X")</code>
                        </div>
                        <div class="neon-box-dark p-4 border-l-2 border-red-500">
                            <h5 class="font-bold text-red-400 mb-1">.remove(valor)</h5>
                            <p class="text-xs text-gray-500 mb-2">Borra el primer match.</p>
                            <code class="text-[10px] text-red-400 block mt-1">lista.remove("A")</code>
                        </div>
                        <div class="neon-box-dark p-4 border-l-2 border-yellow-500">
                            <h5 class="font-bold text-yellow-500 mb-1">.pop(i)</h5>
                            <p class="text-xs text-gray-500 mb-2">Borra por índice.</p>
                            <code class="text-[10px] text-yellow-400 block mt-1">item = lista.pop(0)</code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Actualizando Datos</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Tienes una lista de <code>usuarios</code>. Agrega el nombre "Neo" al final de la lista y luego imprímela.
                    </p>
                    <textarea id="code-list-3" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="8">usuarios = ["Ana", "Pedro"]

# Agrega "Neo" aquí:

# Imprime la lista completa:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-list-3').value, 'output-list-3')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Modificar Lista
                    </button>
                </div>
                <div id="output-list-3" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Actualizando inventario...</p>
                </div>
            `,
            validation: {
                expectedOutput: "['Ana', 'Pedro', 'Neo']",
                matchType: "include",
                hint: "Usa usuarios.append('Neo') antes del print."
            }
        },
        {
            title: "Funciones y Orden",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Análisis de Datos</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Python incluye funciones integradas para analizar listas rápidamente sin necesidad de bucles.
                    </p>
                    
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-center">
                        <div class="neon-box-dark p-4">
                            <code class="text-white block">len()</code>
                            <span class="text-[10px] text-gray-500 uppercase">Tamaño</span>
                            <code class="text-[9px] text-blue-400 block mt-1">len([1,2]) -> 2</code>
                        </div>
                        <div class="neon-box-dark p-4">
                            <code class="text-white block">sum()</code>
                            <span class="text-[10px] text-gray-500 uppercase">Suma</span>
                            <code class="text-[9px] text-blue-400 block mt-1">sum([1,2]) -> 3</code>
                        </div>
                        <div class="neon-box-dark p-4">
                            <code class="text-white block">max()</code>
                            <span class="text-[10px] text-gray-500 uppercase">Mayor</span>
                            <code class="text-[9px] text-blue-400 block mt-1">max([1,2]) -> 2</code>
                        </div>
                        <div class="neon-box-dark p-4">
                            <code class="text-white block">min()</code>
                            <span class="text-[10px] text-gray-500 uppercase">Menor</span>
                            <code class="text-[9px] text-blue-400 block mt-1">min([1,2]) -> 1</code>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Métodos de Orden</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Usa <code>.sort()</code> para ordenar de menor a mayor y <code>.reverse()</code> para invertir el orden:
                        </p>
                        <code class="text-xs text-yellow-400 block bg-black/40 p-3 rounded">
                            precios = [50, 10, 30]<br>
                            precios.sort() &nbsp;&nbsp;&nbsp;&nbsp;# [10, 30, 50]<br>
                            precios.reverse() # [50, 30, 10]
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Estadísticas Rápidas</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Dada la lista de <code>notas</code>, imprime cuántos elementos hay (len) y cuál es la nota más alta (max).
                    </p>
                    <textarea id="code-list-4" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5">notas = [70, 100, 85, 90]
# Imprime len y max:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-list-4').value, 'output-list-4')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Analizar Notas
                    </button>
                </div>
                <div id="output-list-4" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Calculando...</p>
                </div>
            `,
            validation: {
                expectedOutput: "4\n100",
                matchType: "include",
                requiredCode: "max",
                hint: "Escribe print(len(notas)) y luego print(max(notas))"
            }
        },
        {
            title: "Membresía y Trucos",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Operaciones Especiales</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Existen operadores que facilitan la vida al trabajar con listas. El más importante es <code>in</code>, que comprueba si un elemento existe dentro de la lista.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-6 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Pertenencia (in)</h4>
                            <p class="text-gray-400 text-sm mb-2">Busca elementos en la lista:</p>
                            <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">"A" in ["A", "B"] # True</code>
                        </div>
                        <div class="neon-box-dark p-6 border-l-2 border-purple-500">
                            <h4 class="text-xl font-bold text-white mb-3">Multiplicación (*)</h4>
                            <p class="text-gray-400 text-sm mb-2">Repite los elementos:</p>
                            <code class="text-xs text-purple-300 block bg-black/40 p-2 rounded">[1] * 3 # [1, 1, 1]</code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Buscador de Elementos</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Verifica si el nombre "Neo" está en la lista <code>invitados</code> e imprime el resultado (True o False).
                    </p>
                    <textarea id="code-list-5" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5">invitados = ["Ana", "Neo", "Pedro"]
# Imprime el resultado de la comprobación 'in':
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-list-5').value, 'output-list-5')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Comprobar
                    </button>
                </div>
                <div id="output-list-5" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Buscando...</p>
                </div>
            `,
            validation: {
                expectedOutput: "True",
                matchType: "include",
                requiredCode: "in",
                hint: "Escribe print('Neo' in invitados)"
            }
        }
    ]
});
