window.modules.push({
    id: 10,
    title: "Matrices y Listas Anidadas",
    icon: "fa-th",
    description: "Tablas 2D en Python puro.",
    intro: `
        <div class="neon-box p-8 mb-8 text-center">
            <h3 class="text-3xl font-bold mb-6 text-white text-center">Datos en Dos Dimensiones</h3>
            <p class="text-gray-300 mb-8 text-lg text-center">
                Una matriz es simplemente una lista que contiene otras listas. 
                Es la forma perfecta de representar tableros, cuadrículas o imágenes.
            </p>
            <div class="flex justify-center">
                <div class="grid grid-cols-2 gap-2 neon-box-dark p-6 border border-neon-green">
                    <div class="w-12 h-12 bg-white/10 flex items-center justify-center text-white">1</div>
                    <div class="w-12 h-12 bg-white/10 flex items-center justify-center text-white">2</div>
                    <div class="w-12 h-12 bg-white/10 flex items-center justify-center text-white">3</div>
                    <div class="w-12 h-12 bg-white/10 flex items-center justify-center text-white">4</div>
                </div>
            </div>
        </div>
    `,
    lessons: [
        {
            title: "Creando Matrices",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Listas de Listas</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        En Python, una matriz se crea anidando listas. Cada lista interna representa una fila de nuestra tabla o cuadrícula.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Sintaxis</h4>
                            <code class="text-xs text-blue-400 block">m = [[1, 2], [3, 4]]</code>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">Visualización</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Fila 0: [1, 2]<br>
                                Fila 1: [3, 4]
                            </p>
                            <code class="text-xs text-blue-400 block bg-black/40 p-2 rounded">
                                m = [[10, 20], [30, 40]]
                            </code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Constructor de Cuadrícula</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Crea una matriz llamada <code>tablero</code> que tenga dos filas: la primera con 1 y 2, y la segunda con 3 y 4. Imprime la matriz.
                    </p>
                    <textarea id="code-mat-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5"># Crea tu matriz aquí:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-mat-1').value, 'output-mat-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Generar Matriz
                    </button>
                </div>
                <div id="output-mat-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Dibujando cuadrícula...</p>
                </div>
            `,
            validation: {
                expectedOutput: "[[1, 2], [3, 4]]",
                matchType: "include",
                hint: "Usa corchetes dobles: tablero = [[1, 2], [3, 4]]"
            }
        },
        {
            title: "Acceso a Coordenadas",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Coordenadas [Fila][Columna]</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Para obtener un elemento, necesitamos dos índices: el primero para la <strong>fila</strong> y el segundo para la <strong>columna</strong>.
                    </p>
                    
                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo de Acceso</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Si <code>m = [[1, 2], [3, 4]]</code>, así es como obtienes cada dato:
                        </p>
                        <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                            m = [[1, 2], [3, 4]]<br><br>
                            print(m[0][0]) # Fila 0, Columna 0 -> 1<br>
                            print(m[1][1]) # Fila 1, Columna 1 -> 4
                        </code>
                    </div>

                    <div class="neon-box-secondary p-6 border-l-2 border-yellow-500">
                        <h4 class="text-lg font-bold text-white mb-2">Regla de Oro</h4>
                        <p class="text-gray-300 text-sm">
                            El primer corchete elige la lista interna, y el segundo elige el elemento dentro de esa lista.
                        </p>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Extracción Precisa</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Dada la matriz <code>datos</code>, imprime únicamente el número <strong>6</strong> accediendo a su posición correcta.
                    </p>
                    <textarea id="code-mat-2" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="6">datos = [
    [1, 2, 3],
    [4, 5, 6]
]

# Imprime el número 6 usando índices:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-mat-2').value, 'output-mat-2')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Extraer Valor
                    </button>
                </div>
                <div id="output-mat-2" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Buscando coordenada...</p>
                </div>
            `,
            validation: {
                expectedOutput: "6",
                matchType: "exact",
                hint: "El 6 está en la fila 1 (segunda) y columna 2 (tercera). Usa datos[1][2]."
            }
        },
        {
            title: "Recorriendo la Cuadrícula",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Bucles Anidados</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Para ver todos los elementos de una matriz, usamos un bucle dentro de otro: el externo recorre las <strong>filas</strong> y el interno las <strong>columnas</strong>.
                    </p>
                    
                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo de Escaneo</h4>
                        <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                            tablero = [[1, 2], [3, 4]]<br><br>
                            for fila in tablero:<br>
                            &nbsp;&nbsp;for dato in fila:<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;print(dato)
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        Usa dos bucles <code>for</code> (uno dentro del otro) para imprimir todos los números de la matriz <code>m</code>.
                    </p>
                    <textarea id="code-mat-loop" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="8">m = [[1, 2], [3, 4]]

# Escribe tus bucles anidados aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-mat-loop').value, 'output-mat-loop')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Escanear Matriz
                    </button>
                </div>
                <div id="output-mat-loop" class="code-output p-4 text-sm mt-4">
                    <p class="text-gray-500">Recorriendo matriz...</p>
                </div>
            `,
            validation: {
                expectedOutput: "1\n2\n3\n4",
                matchType: "include",
                hint: "Usa for fila in m: y dentro for item in fila: print(item)"
            }
        }
    ]
});
