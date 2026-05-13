window.evaluations[11] = {
    id: 12,
    title: "Huracanes (Examen 2017)",
    difficulty: "avanzado",
    icon: "fa-wind",
    description: "Evaluación sobre Matrices y Diccionarios (Ayudantía 11: Huracanes).",
    timeLimit: 35,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Total Marejada (Matriz)</h4>
                <p class="text-gray-300 mb-2">Supón una matriz <code class="text-neon-green">M = [[A1, K1], [A2, K2]]</code>.</p>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">total_marejada(M, cat)</code>.</p>
                <p class="text-gray-300 mb-4">Si cat=1, filtra valores < 100 de M[0] y suma sus valores correspondientes en M[1].</p>
                <p class="text-gray-300">Prueba con [[50, 200], [10, 20]] y cat=1. Debe sumar 10.</p>
            `,
            expectedOutput: "10",
            help: {
                title: "Filtrado en Matrices Paralelas",
                concept: "En una matriz donde cada fila representa una lista de datos relacionados por sus índices de columna, podemos usar una fila para filtrar y otra para sumar.",
                steps: [
                    "Define total_marejada(M, cat).",
                    "Crea una variable suma = 0 para acumular.",
                    "La longitud de las columnas es len(M[0]). Usa un for con un iterador (i) en el rango de len(M[0]).",
                    "Comprueba la condición: si M[0][i] < 100.",
                    "Si se cumple, suma M[1][i] a tu acumulador suma.",
                    "Retorna la suma e imprímela."
                ],
                tip: "Usa range(len(lista)) para poder usar este indice (i) en ambas sublistas a la vez."
            },

            points: 40
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Velocidad Superior</h4>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">velocidad_superior(ListaH, anio)</code>.</p>
                <p class="text-gray-300 mb-2">La lista tiene tuplas (anio, nombre, velocidad).</p>
                <p class="text-gray-300 mb-2">Filtra por anio, calcula promedio de velocidad y cuenta cuántos superan ese promedio.</p>
                <p class="text-gray-300">Prueba con [(2017, "Irma", 250), (2017, "Katia", 150)]. Promedio=200. >200 es 1 (Irma).</p>
            `,
            expectedOutput: "1",
            help: {
                title: "Cálculos Estadísticos y Filtrado",
                concept: "Este problema requiere dos pasadas sobre los datos: una para calcular el promedio de una condición específica y otra para contar cuántos elementos superan ese promedio.",
                steps: [
                    "Define velocidad_superior(ListaH, anio_buscado).",
                    "Primero filtra las velocidades del año buscado y guárdalas en una sublista.",
                    "Calcula el promedio de las velocidades de esa sublista (usando sum() y len()).",
                    "Haz otra pasada (o usa sum() con una condición) para contar cuántas velocidades en la sublista superan el promedio encontrado.",
                    "Retorna la cantidad resultante."
                ],
                tip: "Para evitar iterar varias veces la lista completa, es útil guardar en una lista auxiliar los datos que necesitas (en este caso las velocidades del año pedido)."
            },

            points: 60
        }
    ]
};
