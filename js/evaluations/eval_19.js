window.evaluations[18] = {
    id: 19,
    title: "Análisis Alcohol (Numpy/Listas)",
    difficulty: "intermedio",
    icon: "fa-beer",
    description: "Evaluación FP2021: Listas masivas de datos alcohol.",
    timeLimit: 30,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Parsing Inicial (Listas Paralelas)</h4>
                <p class="text-gray-300 mb-2">Supón string: <code class="text-neon-green">"Ecu,Per,Col"</code> y <code class="text-neon-green">"10,20,30"</code>.</p>
                <p class="text-gray-300 mb-2">Convierte a lista de string e int respectivamente.</p>
                <p class="text-gray-300">Imprime el tercer valor entero (30).</p>
            `,
            expectedOutput: "30",
            help: {
                title: "Conversión y Asignación de Listas Multiples",
                concept: "Podemos convertir strings separados por comas en listas, y transformar iterativamente sus elementos de texto a número.",
                steps: [
                    "Define el string de países: sp = 'Ecu,Per,Col'.",
                    "Define el string de datos: sd = '10,20,30'.",
                    "Separa ambos en listas usando .split(',').",
                    "Como los datos están en texto ('30'), conviértelos a int usando un bucle o list comprehension: datos = [int(x) for x in sd.split(',')].",
                    "Imprime el elemento en el índice 2 de tu lista de datos (el tercer o último valor)."
                ],
                tip: "La comprensión de listas [int(x) for x in lista] es la forma más pythónica de convertir todos los elementos a entero en una línea."
            },

            points: 40
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Consultar Consumo</h4>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">consultar(dic_consumo, pais)</code>.</p>
                <p class="text-gray-300 mb-2">Retorna el valor de consumo de un país normalizando el nombre (uppercase o title).</p>
                <p class="text-gray-300">Prueba buscar "ecuador" en {"Ecuador": 10}. Imprime valor.</p>
            `,
            expectedOutput: "10",
            help: {
                title: "Búsquedas Insensibles a Mayúsculas",
                concept: "Los usuarios pueden introducir datos con diferentes formatos. Debemos normalizarlos antes de hacer búsquedas en un diccionario.",
                steps: [
                    "Define la función consultar(dic_consumo, pais).",
                    "Homogeniza el parámetro 'pais' usando .capitalize() o .title() para que coincida con la clave 'Ecuador'.",
                    "Comprueba si el país homogenizado está en dic_consumo.",
                    "Si es así, retorna o imprime el valor (ej. dic_consumo[pais_norm]).",
                    "Testea buscando 'ecuador' en el diccionario {'Ecuador': 10}."
                ],
                tip: "Capitalize() pasa la primera letra a mayúscula y el resto a minúsculas, ideal para nombres de países."
            },

            points: 60
        }
    ]
};
