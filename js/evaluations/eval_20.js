window.evaluations[19] = {
    id: 20,
    title: "Twitter Trends (Sets)",
    difficulty: "avanzado",
    icon: "fa-hashtag",
    description: "Evaluación Examen 2016 Twitter: Operaciones de Conjuntos y Tendencias.",
    timeLimit: 30,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Tendencias Comunes</h4>
                <p class="text-gray-300 mb-2">Supón un diccionario de tendencias diarias: <code class="text-neon-green">d = {"Lun": {"#A", "#B"}, "Mar": {"#B", "#C"}}</code> (Sets).</p>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">comunes(d, f1, f2)</code> que retorne la <strong>Intersección</strong> (&).</p>
                <p class="text-gray-300 mb-4">Prueba con "Lun" y "Mar".</p>
                <p class="text-gray-300">Imprime el set resultante.</p>
            `,
            expectedOutput: "{'#B'}",
            help: {
                title: "Intersección de Conjuntos",
                concept: "Para encontrar los elementos que están presentes en dos conjuntos diferentes a la vez (tendencias comunes), usamos la operación lógica de intersección.",
                steps: [
                    "Define el diccionario inicial 'd' con los sets de prueba.",
                    "Define comunes(d, f1, f2).",
                    "Obtén el set del primer día: set1 = d[f1].",
                    "Obtén el set del segundo día: set2 = d[f2].",
                    "Aplica el operador de intersección & (ampersand) entre ambos.",
                    "Retorna o imprime el set resultante."
                ],
                tip: "También puedes usar el método set1.intersection(set2) en lugar del operador &."
            },

            points: 40
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Tendencias Excluyentes</h4>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">excluyentes(d, f1, f2)</code> que retorne la <strong>Diferencia Simétrica</strong> (^).</p>
                <p class="text-gray-300 mb-2">Son hashtags que aparecen en UNO de los días pero NO en ambos.</p>
                <p class="text-gray-300">Imprime el set resultante de "Lun" y "Mar" ({'#A', '#C'}).</p>
            `,
            expectedOutput: "{'#A', '#C'}",
            help: {
                title: "Diferencia Simétrica de Conjuntos",
                concept: "Para encontrar elementos que están en un conjunto o en el otro, pero NO en ambos al mismo tiempo, usamos la diferencia simétrica.",
                steps: [
                    "Define excluyentes(d, f1, f2).",
                    "Al igual que antes, extrae los dos conjuntos de su diccionario usando sus claves f1 y f2.",
                    "Aplica el operador de diferencia simétrica ^ (acento circunflejo) entre set1 y set2.",
                    "Retorna el set resultante.",
                    "Prueba la función llamándola e imprimiendo el resultado para corroborar el Test."
                ],
                tip: "El circunflejo ^ funciona como la compuerta lógica XOR (o exclusivo), aplicada a nivel de elementos coleccionados en Python."
            },

            points: 60
        }
    ]
};
