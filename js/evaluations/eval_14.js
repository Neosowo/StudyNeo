window.evaluations[13] = {
    id: 14,
    title: "Turismo Ecuador (Matrices)",
    difficulty: "avanzado",
    icon: "fa-plane-departure",
    description: "Evaluación sobre Matrices Numpy (Ayudantía 12: Turismo).",
    timeLimit: 35,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Total Turistas</h4>
                <p class="text-gray-300 mb-2">Dada una matriz <code class="text-neon-green">M</code> de turistas por año (cols) y ciudad (filas).</p>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">total(M, col)</code> que sume toda la columna.</p>
                <p class="text-gray-300 mb-4">Prueba con [[10, 20], [30, 40]] y col 0 (año 2007).</p>
                <p class="text-gray-300">Imprime el total.</p>
            `,
            expectedOutput: "40",
            help: {
                title: "Sumar Columnas en Matrices",
                concept: "Para sumar una columna específica, debemos iterar sobre todas las filas y extraer el elemento que se encuentra en el índice de la columna deseada.",
                steps: [
                    "Define total(M, col).",
                    "Crea una variable suma = 0.",
                    "Haz un for que itere sobre cada 'fila' en la matriz M.",
                    "Suma a tu acumulador el elemento de esa fila usando suma += fila[col].",
                    "Retorna o imprime la suma resultante."
                ],
                tip: "También podrías usar comprensión de listas con sum(): sum([fila[col] for fila in M])."
            },

            points: 25
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Promedio Sierra</h4>
                <p class="text-gray-300 mb-2">Las filas 0-1 son Costa, 2-3 son Sierra.</p>
                <p class="text-gray-300 mb-2">Calcula el promedio de las filas de la Sierra.</p>
            `,
            expectedOutput: "35.0",
            help: {
                title: "Slicing y Promedios en Matrices",
                concept: "Podemos obtener un subconjunto de filas interesándonos solo en ciertos índices (por ejemplo de la fila 2 en adelante).",
                steps: [
                    "Define una matriz hipotética (ej: M = [[10, 20], [30, 40], [20, 30], [40, 50]]).",
                    "Obtén las filas de la sierra usando slicing: filas_sierra = M[2:4].",
                    "Calcula la suma total de esos elementos iterando por fila y por columna.",
                    "Calcula la cantidad total de elementos iterados.",
                    "Imprime el promedio resultante (suma / elementos)."
                ],
                tip: "En numpy, podrías simplemente usar np.mean(M[2:4]), pero sin numpy debes hacerlo con bucles o sum()."
            },

            points: 30
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Años de Crecimiento</h4>
                <p class="text-gray-300 mb-2">Para una ciudad (fila específica), cuenta cuántos años el turismo creció respecto al anterior.</p>
            `,
            expectedOutput: "1",
            help: {
                title: "Análisis de Crecimiento (Diferencias)",
                concept: "Para saber si algo creció respecto a su valor anterior, iteramos desde el segundo elemento (índice 1) y comparamos con el anterior (índice - 1).",
                steps: [
                    "Define una lista simulada para una ciudad (ej: ciudad = [10, 20, 15]).",
                    "Crea un contador: veces_crecio = 0.",
                    "Itera usando range desde 1 hasta len(ciudad): for i in range(1, len(ciudad)).",
                    "Usa un condicional: if ciudad[i] > ciudad[i-1]:",
                    "Incrementa tu contador y, al terminar el bucle, imprime el contador."
                ],
                tip: "Si iteras usando los elementos directamente en un for (for valor in ciudad), puedes usar una variable 'valor_anterior' para hacer esta misma lógica sin índices."
            },

            points: 40
        }
    ]
};
