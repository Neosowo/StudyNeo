window.evaluations[6] = {
    id: 7,
    title: "Matrices (Multas)",
    difficulty: "avanzado",
    icon: "fa-th",
    description: "Evaluación sobre manejo de matrices (listas anidadas): Proyecto Multas.",
    timeLimit: 35,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Crear Matriz 5x5 (Ceros)</h4>
                <p class="text-gray-300 mb-2">Crea una matriz 5x5 llena de ceros usando list comprehension o bucles anidados.</p>
                <p class="text-gray-300 mb-4">Llamala <code class="text-neon-green">matriz</code>.</p>
                <p class="text-gray-300">Imprime el valor en <code class="text-neon-green">matriz[4][4]</code>.</p>
            `,
            expectedOutput: "0",
            help: {
                title: "Creación de Matrices",
                concept: "Una matriz en Python es una lista que contiene otras listas (listas anidadas).",
                steps: [
                    "Usa list comprehension para crear una lista de 5 listas, cada una con 5 ceros.",
                    "Ejemplo: <code>matriz = [[0 for _ in range(5)] for _ in range(5)]</code>.",
                    "También puedes usar un bucle for anidado para hacer un append de sublistas.",
                    "Imprime el valor en el último índice: matriz[4][4]."
                ],
                tip: "Asegúrate de no usar [[0]*5]*5, ya que eso crea referencias repetidas al mismo objeto y te dará errores al intentar modificar solo una casilla."
            },

            points: 15
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Cargar Multas</h4>
                <p class="text-gray-300 mb-2">Dada <code class="text-neon-green">listaMultas = [[0, 0, 100], [4, 4, 50]]</code>.</p>
                <p class="text-gray-300 mb-2">Cada sublista es [fila, columna, valor].</p>
                <p class="text-gray-300 mb-4">Recorre e incrementa la matriz 5x5 en esas posiciones.</p>
                <p class="text-gray-300">Imprime la suma total de todas las multas en la matriz.</p>
            `,
            expectedOutput: "150",
            help: {
                title: "Carga de Datos en Matriz",
                concept: "Para depositar datos en una matriz, usamos los valores de una lista como coordenadas de fila y columna.",
                steps: [
                    "Define la listaMultas.",
                    "Crea la matriz de 5x5 inicializada en 0.",
                    "Recorre listaMultas con un for.",
                    "En cada paso, obtén fila, col y valor: <code>f, c, v = multa</code>.",
                    "Actualiza la matriz: <code>matriz[f][c] += v</code>.",
                    "Al final, usa bucles anidados para sumar todos los elementos o la función sum() en cada fila."
                ],
                tip: "La suma total de una matriz se puede obtener rápidamente con: <code>sum(sum(fila) for fila in matriz)</code>."
            },

            points: 25
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Sumar Sector Norte</h4>
                <p class="text-gray-300 mb-2">Para una matriz 5x5 dada (o creada anteriormente con multas), el Sector Norte es toda la fila 0.</p>
                <p class="text-gray-300 mb-2">Suma todos los elementos de la fila 0.</p>
                <p class="text-gray-300">Imprime el total del Norte.</p>
                <p class="text-xs text-gray-500">Nota: Si usaste los datos anteriores ([0,0,100]), la fila 0 tiene 100.</p>
            `,
            expectedOutput: "100",
            help: {
                title: "Suma de Filas (Sectores)",
                concept: "Acceder a una fila completa es sencillo, ya que solo necesitas especificar el primer índice de la matriz.",
                steps: [
                    "Identifica la fila 0 de tu matriz.",
                    "Usa la función sum(matriz[0]) para obtener el total de esa fila.",
                    "Imprime el resultado."
                ],
                tip: "Si tuvieras que sumar una columna, necesitarías un bucle for para recorrer todas las filas y tomar el elemento de esa columna específica."
            },

            points: 20
        },
        {
            id: 4,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">4. Sector Centro</h4>
                <p class="text-gray-300 mb-2">El Centro es el cuadrado interno de 3x3 (filas 1 a 3, cols 1 a 3).</p>
                <p class="text-gray-300 mb-4">Suma los elementos en ese rango usando slicing o bucles.</p>
                <p class="text-gray-300">Para una matriz de unos (llena de 1s), el centro suma 9. Hazlo con la matriz de multas anterior (sin multas alli, suma 0).</p>
            `,
            expectedOutput: "0",
            help: {
                title: "Slicing y Submatrices",
                concept: "El centro de una matriz se define por un rango específico de filas y columnas (submatriz).",
                steps: [
                    "Crea una variable suma_centro = 0.",
                    "Usa un bucle for para las filas en el rango de 1 a 3 (range(1, 4)).",
                    "Dentro, usa otro bucle for para las columnas en el rango de 1 a 3.",
                    "Suma el valor de matriz[f][c] a tu acumulador.",
                    "Imprime el total acumulado."
                ],
                tip: "Recuerda que en range(inicio, fin), el número de 'fin' no se incluye. Para llegar a la fila 3, debes usar range(1, 4)."
            },

            points: 30
        }
    ]
};
