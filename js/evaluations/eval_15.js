window.evaluations[14] = {
    id: 15,
    title: "Producción Agrícola (Mejoramiento)",
    difficulty: "avanzado",
    icon: "fa-seedling",
    description: "Evaluación Mejoramiento 2019: Análisis de cosechas mensuales.",
    timeLimit: 30,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Mes Más Rentable</h4>
                <p class="text-gray-300 mb-2">Matriz <code class="text-neon-green">M</code> de Productos x Meses (12 cols).</p>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">mesMasRentable(M)</code>.</p>
                <p class="text-gray-300 mb-4">Suma las columnas (meses) y retorna el índice del mes con mayor producción. (Usar Numpy argmax o manual).</p>
                <p class="text-gray-300">Prueba con [[10, 20], [5, 40]] (2 meses). Col 0=15, col 1=60. Debe retornar 1 (o "FEB").</p>
            `,
            expectedOutput: "1",
            help: {
                title: "Sumatoria Vertical (por Columnas)",
                concept: "En una matriz (lista de listas), calcular iterativamente la suma de elementos en el mismo índice de cada fila te da los totales por columna.",
                steps: [
                    "Define mesMasRentable(M).",
                    "Crea variables max_suma = -1 y mejor_mes = -1.",
                    "Usa un for externo con la cantidad de meses (columnas): for i in range(len(M[0])).",
                    "Crea una variable suma_columna = 0.",
                    "Usa un for interno para iterar cada fila y súmalo: for fila in M: suma_columna += fila[i].",
                    "Si suma_columna > max_suma, actualiza max_suma y mejor_mes.",
                    "Imprime mejor_mes."
                ],
                tip: "En NumPy, esto es tan fácil como M.sum(axis=0).argmax(). Si puedes usar Numpy, hazlo."
            },

            points: 40
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Mejor Trimestre</h4>
                <p class="text-gray-300 mb-2">Divide el año en trimestres (T1=0-2, T2=3-5, T3=6-8, T4=9-11).</p>
                <p class="text-gray-300 mb-2">Para UN producto (fila específica), suma y di cuál trimestre fue mejor.</p>
                <p class="text-gray-300 mb-4">Define <code class="text-neon-green">mejorTrimestre(Prod)</code>.</p>
                <p class="text-gray-300">Prueba con fila de 12 elementos (todo ceros excepto T2 que tiene 100).</p>
            `,
            expectedOutput: "2",
            help: {
                title: "Agrupación Temporal con Slicing",
                concept: "Agrupar datos en cuartiles o trimestres implica seccionar una lista y calcular subtotales para luego compararlos.",
                steps: [
                    "Define mejorTrimestre(Prod) donde Prod es una lista simulada de 12 meses (ej: [0,0,0,100,0,0,0,0,0,0,0,0]).",
                    "Suma los primeros 3 elementos para T1: t1 = sum(Prod[0:3]).",
                    "Suma los siguientes para T2: t2 = sum(Prod[3:6]).",
                    "Repite para T3 (6:9) y T4 (9:12).",
                    "Mete las 4 sumas en una lista y averigua cuál índice tiene el valor máximo.",
                    "Imprime el número del trimestre ganador (T1, T2, etc o solo el número)."
                ],
                tip: "Usa sub_listas = [sum(Prod[0:3]), sum(Prod[3:6]), ...] seguido de sub_listas.index(max(sub_listas)) + 1."
            },

            points: 60
        }
    ]
};
