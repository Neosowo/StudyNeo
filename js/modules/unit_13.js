window.modules.push({
    id: 13,
    title: "Dominando Pandas",
    icon: "fa-table",
    description: "De principiante a analista de datos con Pandas.",
    intro: `
        <div class="neon-box p-8 mb-8 text-center">
            <h3 class="text-3xl font-bold mb-6 text-white text-center">Data Science Profesional</h3>
            <p class="text-gray-300 mb-8 text-lg text-center">
                Aprende Pandas paso a paso: desde crear tu primera tabla hasta hacer análisis reales de datos.
                Cada lección te enseña <strong>un concepto</strong>. Al final, los combinas todos.
            </p>
            <div class="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                    <i class="fas fa-table text-3xl text-neon-green mb-3"></i>
                    <h4 class="text-white font-bold mb-1">DataFrames</h4>
                    <p class="text-xs text-gray-400">Tu hoja de cálculo en Python.</p>
                </div>
                <div class="neon-box-dark p-6 border-l-2 border-blue-400">
                    <i class="fas fa-calculator text-3xl text-blue-400 mb-3"></i>
                    <h4 class="text-white font-bold mb-1">Estadísticas</h4>
                    <p class="text-xs text-gray-400">sum, mean, max, min al instante.</p>
                </div>
                <div class="neon-box-dark p-6 border-l-2 border-purple-500">
                    <i class="fas fa-layer-group text-3xl text-purple-500 mb-3"></i>
                    <h4 class="text-white font-bold mb-1">GroupBy</h4>
                    <p class="text-xs text-gray-400">Reportes por categorías automáticamente.</p>
                </div>
            </div>
        </div>
    `,
    lessons: [
        // ─── LECCIÓN 1: Crear DataFrames ───────────────────────────────────────
        {
            title: "Creando tu Primera Tabla",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">DataFrames: Tu Hoja de Cálculo</h3>

                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Un <strong>DataFrame</strong> es como una hoja de Excel en Python. Se crea con un diccionario
                        donde cada <em>clave</em> es el nombre de una columna y cada <em>valor</em> es una lista de datos.
                    </p>

                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div class="neon-box-dark p-5 border-l-2 border-blue-400">
                            <h4 class="font-bold text-white mb-2">📋 Estructura</h4>
                            <code class="text-xs text-blue-300 block bg-black/40 p-3 rounded">
                                pd.DataFrame({<br>
                                &nbsp;&nbsp;"Columna1": [val1, val2],<br>
                                &nbsp;&nbsp;"Columna2": [val3, val4]<br>
                                })
                            </code>
                        </div>
                        <div class="neon-box-dark p-5 border-l-2 border-neon-green">
                            <h4 class="font-bold text-white mb-2">🔍 Ver resumen</h4>
                            <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                                df = pd.DataFrame({...})<br>
                                print(df.describe())<br>
                                <span class="text-gray-500"># → count, mean, min, max...</span>
                            </code>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-4 border-l-2 border-yellow-400">
                        <p class="text-yellow-300 text-sm"><i class="fas fa-lightbulb mr-2"></i>
                        <strong>describe()</strong> te da estadísticas de todas las columnas numéricas de un vistazo.</p>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Análisis Inicial</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Crea un DataFrame con datos de <strong>"Ventas"</strong> ([100, 200, 150, 400])
                        y usa <code>describe()</code> para ver el resumen.
                    </p>
                    <textarea id="code-pan-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="6">import pandas as pd

# Crea df con columna "Ventas" y describe:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-pan-1').value, 'output-pan-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Analizar
                    </button>
                </div>
                <div id="output-pan-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Esperando datos...</p>
                </div>
            `,
            validation: {
                expectedOutput: "max",
                matchType: "include",
                requiredCode: "pd.DataFrame",
                hint: "Usa df = pd.DataFrame({'Ventas': [...]}) y luego print(df.describe())"
            }
        },

        // ─── LECCIÓN 2: Acceder columnas + sum + mean ──────────────────────────
        {
            title: "Accediendo Columnas",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Trabaja con Columnas</h3>

                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Puedes extraer cualquier columna con <code>df["nombre"]</code>.
                        Esa columna es una <strong>Series</strong> — y sobre ella puedes calcular operaciones al instante.
                    </p>

                    <div class="grid md:grid-cols-3 gap-4 mb-6">
                        <div class="neon-box-dark p-4 border-l-2 border-neon-green text-center">
                            <code class="text-sm text-neon-green">df["col"]</code>
                            <p class="text-xs text-gray-400 mt-2">Extrae una columna</p>
                        </div>
                        <div class="neon-box-dark p-4 border-l-2 border-blue-400 text-center">
                            <code class="text-sm text-blue-400">df["col"].sum()</code>
                            <p class="text-xs text-gray-400 mt-2">Suma todos los valores</p>
                        </div>
                        <div class="neon-box-dark p-4 border-l-2 border-yellow-400 text-center">
                            <code class="text-sm text-yellow-400">df["col"].mean()</code>
                            <p class="text-xs text-gray-400 mt-2">Calcula el promedio</p>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-4 border-l-2 border-purple-400">
                        <code class="text-xs text-purple-300 block bg-black/40 p-3 rounded">
                            df = pd.DataFrame({"Notas": [7, 9, 6, 8]})<br>
                            print(df["Notas"].sum())   <span class="text-gray-500"># → 30</span><br>
                            print(df["Notas"].mean())  <span class="text-gray-500"># → 7.5</span>
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Calculadora de Inventario</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Tienes un inventario. Imprime el <strong>total</strong> de unidades en Stock usando <code>.sum()</code>.
                    </p>
                    <textarea id="code-pan-2" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="8">import pandas as pd
inventario = pd.DataFrame({
    "Producto": ["Manzana", "Pan", "Leche"],
    "Stock": [50, 30, 20]
})

# Imprime el total de unidades en Stock:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-pan-2').value, 'output-pan-2')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Calcular Total
                    </button>
                </div>
                <div id="output-pan-2" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Calculando inventario...</p>
                </div>
            `,
            validation: {
                expectedOutput: "100",
                matchType: "include",
                requiredCode: ".sum()",
                hint: "Usa print(inventario['Stock'].sum()) — la suma de 50+30+20 es 100"
            }
        },

        // ─── LECCIÓN 3: max y min ──────────────────────────────────────────────
        {
            title: "Máximos y Mínimos",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Encuentra los Extremos</h3>

                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Con <code>.max()</code> y <code>.min()</code> encuentras el valor más alto y más bajo
                        de una columna en una sola línea. Esencial para análisis de datos reales.
                    </p>

                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div class="neon-box-dark p-5 border-l-2 border-red-400">
                            <h4 class="font-bold text-white mb-2">🔺 Valor máximo</h4>
                            <code class="text-xs text-red-300 block bg-black/40 p-3 rounded">
                                df["Precio"].max()<br>
                                <span class="text-gray-500"># → el precio más caro</span>
                            </code>
                        </div>
                        <div class="neon-box-dark p-5 border-l-2 border-cyan-400">
                            <h4 class="font-bold text-white mb-2">🔻 Valor mínimo</h4>
                            <code class="text-xs text-cyan-300 block bg-black/40 p-3 rounded">
                                df["Precio"].min()<br>
                                <span class="text-gray-500"># → el precio más barato</span>
                            </code>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-4 border-l-2 border-neon-green">
                        <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                            df = pd.DataFrame({"Temp": [22, 35, 18, 28, 15]})<br>
                            print(df["Temp"].max())   <span class="text-gray-500"># → 35.0</span><br>
                            print(df["Temp"].min())   <span class="text-gray-500"># → 15.0</span>
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Termómetro de Ventas</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Tienes ventas semanales. Imprime la venta <strong>máxima</strong> usando <code>.max()</code>
                        en la columna <code>"Ventas"</code>.
                    </p>
                    <textarea id="code-pan-3" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="8">import pandas as pd
semana = pd.DataFrame({
    "Dia": ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"],
    "Ventas": [120, 85, 200, 95, 175]
})

# Imprime la venta maxima:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-pan-3').value, 'output-pan-3')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Buscar Máximo
                    </button>
                </div>
                <div id="output-pan-3" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Analizando ventas...</p>
                </div>
            `,
            validation: {
                expectedOutput: "200",
                matchType: "include",
                requiredCode: ".max()",
                hint: "Usa print(semana['Ventas'].max()) — el máximo de las ventas es 200"
            }
        },

        // ─── LECCIÓN 4: mean() en columna ──────────────────────────────────────
        {
            title: "El Promedio: mean()",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Calcula el Promedio</h3>

                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        El promedio (<strong>media aritmética</strong>) te dice cuál es el valor "típico" de tus datos.
                        En Pandas lo calculas con <code>.mean()</code> — una de las funciones más usadas en análisis de datos.
                    </p>

                    <div class="neon-box-dark p-5 border-l-2 border-yellow-400 mb-6">
                        <h4 class="font-bold text-white mb-3">📐 Fórmula</h4>
                        <div class="flex items-center gap-6">
                            <code class="text-xs text-yellow-300 block bg-black/40 p-3 rounded flex-1">
                                df["Notas"].mean()<br>
                                <span class="text-gray-500"># suma de todos / cantidad</span>
                            </code>
                            <div class="text-center">
                                <div class="text-2xl text-yellow-400 font-bold">7 + 9 + 8</div>
                                <div class="text-gray-500 text-xs border-t border-gray-600 mt-1 pt-1">3 valores</div>
                                <div class="text-yellow-300 font-bold">= 8.0</div>
                            </div>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="neon-box-secondary p-4">
                            <p class="text-sm text-gray-300"><i class="fas fa-check text-neon-green mr-2"></i>Promedio de precios</p>
                            <code class="text-xs text-neon-green">df["Precio"].mean()</code>
                        </div>
                        <div class="neon-box-secondary p-4">
                            <p class="text-sm text-gray-300"><i class="fas fa-check text-blue-400 mr-2"></i>Promedio de notas</p>
                            <code class="text-xs text-blue-400">df["Nota"].mean()</code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Promedio del Aula</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Calcula e imprime la nota <strong>promedio</strong> de los estudiantes usando <code>.mean()</code>.
                    </p>
                    <textarea id="code-pan-4" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="8">import pandas as pd
aula = pd.DataFrame({
    "Estudiante": ["Ana", "Luis", "Maria", "Pedro"],
    "Nota": [8, 6, 9, 7]
})

# Imprime el promedio de Nota:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-pan-4').value, 'output-pan-4')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Calcular Promedio
                    </button>
                </div>
                <div id="output-pan-4" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Calculando promedios...</p>
                </div>
            `,
            validation: {
                expectedOutput: "7.5",
                matchType: "include",
                requiredCode: ".mean()",
                hint: "Usa print(aula['Nota'].mean()) — (8+6+9+7)/4 = 7.5"
            }
        },

        // ─── LECCIÓN 5: GroupBy sum ────────────────────────────────────────────
        {
            title: "GroupBy: Agrupa y Suma",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Agrupa tus Datos</h3>

                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        <code>groupby()</code> es la función estrella de Pandas. Agrupa filas que tienen el mismo valor
                        en una columna y calcula totales por grupo. Imagina un reporte de ventas por ciudad.
                    </p>

                    <div class="space-y-3 mb-6">
                        <div class="neon-box-dark p-4 border border-purple-500/30 flex items-center gap-4">
                            <div class="text-2xl text-purple-400 font-bold w-8">1</div>
                            <div class="text-sm text-gray-300"><strong class="text-white">Agrupar:</strong> <code class="text-purple-300">df.groupby("Ciudad")</code> — une las filas con la misma ciudad</div>
                        </div>
                        <div class="neon-box-dark p-4 border border-purple-500/30 flex items-center gap-4">
                            <div class="text-2xl text-purple-400 font-bold w-8">2</div>
                            <div class="text-sm text-gray-300"><strong class="text-white">Seleccionar:</strong> <code class="text-purple-300">["Ventas"]</code> — qué columna queremos calcular</div>
                        </div>
                        <div class="neon-box-dark p-4 border border-purple-500/30 flex items-center gap-4">
                            <div class="text-2xl text-purple-400 font-bold w-8">3</div>
                            <div class="text-sm text-gray-300"><strong class="text-white">Calcular:</strong> <code class="text-purple-300">.sum()</code> — suma las ventas de cada ciudad</div>
                        </div>
                    </div>

                    <code class="text-xs text-purple-300 block bg-black/40 p-3 rounded text-center">
                        df.groupby("Ciudad")["Ventas"].sum()
                    </code>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Reporte de Ventas por Vendedor</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Calcula el total de ventas por <strong>Vendedor</strong>. Agrupa por vendedor y suma la columna <code>"Ventas"</code>.
                    </p>
                    <textarea id="code-pan-5" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="9">import pandas as pd
df = pd.DataFrame({
    "Vendedor": ["Juan", "Ana", "Juan", "Ana"],
    "Ventas": [100, 200, 50, 300]
})

# Agrupa por Vendedor y suma las Ventas:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-pan-5').value, 'output-pan-5')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Generar Reporte
                    </button>
                </div>
                <div id="output-pan-5" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Agrupando datos...</p>
                </div>
            `,
            validation: {
                expectedOutput: "500",
                matchType: "include",
                requiredCode: "groupby",
                hint: "Usa print(df.groupby('Vendedor')['Ventas'].sum()) — Ana: 200+300=500"
            }
        },

        // ─── LECCIÓN 6: GroupBy mean ───────────────────────────────────────────
        {
            title: "GroupBy: Promedio por Grupo",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Promedio por Categoría</h3>

                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Ya sabes agrupar y sumar. Ahora vamos a agrupar y calcular el <strong>promedio por grupo</strong>.
                        Cambia <code>.sum()</code> por <code>.mean()</code> — así de simple.
                    </p>

                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div class="neon-box-dark p-5 border-l-2 border-purple-400">
                            <h4 class="font-bold text-white mb-2">Total por grupo</h4>
                            <code class="text-xs text-purple-300 block bg-black/40 p-3 rounded">
                                df.groupby("Dept")["Salario"].sum()
                            </code>
                            <p class="text-xs text-gray-400 mt-2">¿Cuánto gasta cada departamento?</p>
                        </div>
                        <div class="neon-box-dark p-5 border-l-2 border-yellow-400">
                            <h4 class="font-bold text-white mb-2">Promedio por grupo</h4>
                            <code class="text-xs text-yellow-300 block bg-black/40 p-3 rounded">
                                df.groupby("Dept")["Salario"].mean()
                            </code>
                            <p class="text-xs text-gray-400 mt-2">¿Cuánto gana en promedio cada dept?</p>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-4 border-l-2 border-neon-green">
                        <p class="text-neon-green text-sm font-bold"><i class="fas fa-star mr-2"></i>Tip</p>
                        <p class="text-gray-300 text-sm mt-1">Siempre que veas patrones en categorías, usa <code>groupby</code>. Es la base de cualquier dashboard de datos.</p>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Nota Promedio por Materia</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Calcula la nota <strong>promedio por Materia</strong> usando <code>groupby</code> + <code>.mean()</code>.
                    </p>
                    <textarea id="code-pan-6" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="9">import pandas as pd
notas = pd.DataFrame({
    "Materia": ["Mate", "Ciencia", "Mate", "Ciencia"],
    "Nota": [8, 7, 10, 9]
})

# Promedio de nota por Materia:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-pan-6').value, 'output-pan-6')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Calcular Promedios
                    </button>
                </div>
                <div id="output-pan-6" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Calculando promedios por materia...</p>
                </div>
            `,
            validation: {
                expectedOutput: "9.0",
                matchType: "include",
                requiredCode: ".mean()",
                hint: "Usa print(notas.groupby('Materia')['Nota'].mean()) — Ciencia: (7+9)/2=8.0, Mate: (8+10)/2=9.0"
            }
        },

        // ─── LECCIÓN 7: RETO FINAL ─────────────────────────────────────────────
        {
            title: "🏆 Reto Final: Analista de Datos",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Reto Final: ¡Todo Junto!</h3>

                <div class="neon-box p-8 mb-8">
                    <div class="flex items-center gap-3 mb-6">
                        <i class="fas fa-trophy text-3xl text-yellow-400"></i>
                        <div>
                            <h4 class="text-xl font-bold text-white">Nivel: Analista Junior</h4>
                            <p class="text-gray-400 text-sm">Combina todo lo que aprendiste para aprobar</p>
                        </div>
                    </div>

                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Eres un analista contratado para procesar datos de ventas de una empresa.
                        Necesitas responder 3 preguntas usando Pandas.
                    </p>

                    <div class="space-y-3 mb-6">
                        <div class="neon-box-dark p-4 border-l-2 border-neon-green flex gap-4 items-start">
                            <span class="text-neon-green font-bold text-lg">1</span>
                            <div>
                                <p class="text-white text-sm font-bold">¿Cuánto se vendió en total?</p>
                                <code class="text-xs text-neon-green">df["Monto"].sum()</code>
                            </div>
                        </div>
                        <div class="neon-box-dark p-4 border-l-2 border-blue-400 flex gap-4 items-start">
                            <span class="text-blue-400 font-bold text-lg">2</span>
                            <div>
                                <p class="text-white text-sm font-bold">¿Cuál fue la venta más alta?</p>
                                <code class="text-xs text-blue-400">df["Monto"].max()</code>
                            </div>
                        </div>
                        <div class="neon-box-dark p-4 border-l-2 border-purple-400 flex gap-4 items-start">
                            <span class="text-purple-400 font-bold text-lg">3</span>
                            <div>
                                <p class="text-white text-sm font-bold">¿Cuánto vendió cada vendedor en total?</p>
                                <code class="text-xs text-purple-400">df.groupby("Vendedor")["Monto"].sum()</code>
                            </div>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-4 border border-yellow-500/30 bg-yellow-500/5">
                        <p class="text-yellow-300 text-sm font-bold"><i class="fas fa-exclamation-triangle mr-2"></i>Para superar el reto:</p>
                        <p class="text-gray-300 text-sm mt-1">El output debe contener <strong>1900</strong> (la suma total) y debe usar <code>groupby</code>.</p>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">🏆 Reto Final — Análisis de Ventas</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Responde las 3 preguntas usando los datos de ventas. El código ya tiene la estructura base — ¡complétalo!
                    </p>
                    <textarea id="code-pan-7" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="14">import pandas as pd
df = pd.DataFrame({
    "Vendedor": ["Ana", "Luis", "Ana", "Luis", "Maria"],
    "Zona": ["Norte", "Sur", "Sur", "Norte", "Norte"],
    "Monto": [400, 300, 500, 700, 0]
})
df["Monto"] = pd.Series([400, 300, 500, 700, 0])

# 1. Total vendido:


# 2. Venta maxima:


# 3. Total por vendedor:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-pan-7').value, 'output-pan-7')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-trophy mr-2"></i>Enviar Análisis
                    </button>
                </div>
                <div id="output-pan-7" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Esperando tu análisis...</p>
                </div>
            `,
            validation: {
                expectedOutput: "1900",
                matchType: "include",
                requiredCode: "groupby",
                hint: "Asegúrate de imprimir la suma total (1900) y usar groupby para ventas por vendedor"
            }
        }
    ]
});
