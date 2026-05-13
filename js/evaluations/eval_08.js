window.evaluations[7] = {
    id: 8,
    title: "Conjuntos y Tuplas",
    difficulty: "intermedio",
    icon: "fa-layer-group",
    description: "Evaluación basada en Ayudantía 9: Operaciones con conjuntos y tuplas.",
    timeLimit: 25,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Tupla Fecha</h4>
                <p class="text-gray-300 mb-2">Define función <code class="text-neon-green">fecha(d, m, a)</code>.</p>
                <p class="text-gray-300 mb-4">Retorna una tupla con los tres valores.</p>
                <p class="text-gray-300">Prueba con (25, 12, 2023) e imprime.</p>
            `,
            expectedOutput: "(25, 12, 2023)",
            help: {
                title: "Creación de Tuplas",
                concept: "Una tupla es una colección inmutable que se define con paréntesis ().",
                steps: [
                    "Define la función fecha(d, m, a).",
                    "Simplemente retorna los tres valores separados por comas dentro de paréntesis.",
                    "Llama a la función con los valores 25, 12, 2023 e imprime el resultado."
                ],
                tip: "A diferencia de las listas, las tuplas no pueden modificarse una vez creadas."
            },

            points: 15
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Estudiantes en Ambos Cursos (Intersección)</h4>
                <p class="text-gray-300 mb-2">Dados los conjuntos: <code class="text-neon-green">alg = {"Ana", "Luis"}</code> y <code class="text-neon-green">calc = {"Luis", "Pepe"}</code>.</p>
                <p class="text-gray-300 mb-4">Encuentra la intersección (estudiantes en ambos) usando <code class="text-neon-green">&</code> o <code class="text-neon-green">intersection()</code>.</p>
                <p class="text-gray-300">Imprime el conjunto resultante.</p>
            `,
            expectedOutput: "{'Luis'}",
            help: {
                title: "Intersección de Conjuntos",
                concept: "La intersección encuentra elementos que están presentes en ambos conjuntos simultáneamente.",
                steps: [
                    "Define los dos conjuntos usando llaves {}.",
                    "Usa el operador & (amper-sand) entre los dos conjuntos.",
                    "Guarda el resultado en una variable e imprímelo."
                ],
                tip: "En conjuntos ({}), el orden de los elementos no importa, pero para el test debe coincidir con el valor esperado."
            },

            points: 25
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Sólo Álgebra (Diferencia)</h4>
                <p class="text-gray-300 mb-2">Usando los mismos conjuntos anteriores.</p>
                <p class="text-gray-300 mb-4">Encuentra quién está en Álgebra pero NO en Cálculo (<code class="text-neon-green">alg - calc</code>).</p>
                <p class="text-gray-300">Imprime el resultado.</p>
            `,
            expectedOutput: "{'Ana'}",
            help: {
                title: "Diferencia de Conjuntos",
                concept: "La diferencia (A - B) devuelve los elementos que están en A pero que NO están en B.",
                steps: [
                    "Define los conjuntos alg y calc.",
                    "Resta el conjunto calc al conjunto alg usando el operador menos (-).",
                    "Imprime el resultado."
                ],
                tip: "La operación alg - calc no es igual a calc - alg. ¡El orden importa!"
            },

            points: 25
        },
        {
            id: 4,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">4. Diferencia Simétrica</h4>
                <p class="text-gray-300 mb-2">Usando los mismos conjuntos.</p>
                <p class="text-gray-300 mb-4">Encuentra estudiantes que están en UNO de los dos cursos, pero NO en ambos (<code class="text-neon-green">^</code>).</p>
                <p class="text-gray-300">Imprime el conjunto resultante (orden no importa, validaré contenido).</p>
                <p class="text-xs text-gray-500">Debe ser {'Ana', 'Pepe'}.</p>
            `,
            expectedOutput: "{'Ana', 'Pepe'}",
            help: {
                title: "Diferencia Simétrica",
                concept: "Esta operación devuelve los elementos que están en cualquiera de los conjuntos, pero no en ambos (es como un OR exclusivo).",
                steps: [
                    "Usa el operador ^ (circumflejo) entre alg y calc.",
                    "Imprime el conjunto resultante."
                ],
                tip: "Esto equivale a (A | B) - (A & B), es decir, la unión menos la intersección."
            },

            points: 35
        }
    ]
};
