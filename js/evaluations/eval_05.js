window.evaluations[4] = {
    id: 5,
    title: "Funciones Avanzadas",
    difficulty: "avanzado",
    icon: "fa-project-diagram",
    description: "Evaluación sobre funciones recursivas, argumentos variables e histogramas.",
    timeLimit: 30,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Factorial Recursivo</h4>
                <p class="text-gray-300 mb-2">Define una función recursiva <code class="text-neon-green">factorial1(n)</code>.</p>
                <p class="text-gray-300 mb-2">Caso base: n==1 retorna 1.</p>
                <p class="text-gray-300 mb-4">Caso recursivo: n * factorial(n-1).</p>
                <p class="text-gray-300">Prueba con 5 e imprime.</p>
            `,
            expectedOutput: "120",
            help: {
                title: "Recursividad Básica",
                concept: "La recursividad es cuando una función se llama a sí misma para resolver un problema más pequeño.",
                steps: [
                    "Define factorial1(n).",
                    "Establece el caso base: if n == 1: return 1.",
                    "Define el caso recursivo: else: return n * factorial1(n-1).",
                    "Llama a la función con 5 e imprímelo."
                ],
                tip: "¡Nunca olvides el caso base! Sin él, la función se llamará infinitamente hasta que el programa falle."
            },

            points: 25
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Histograma</h4>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">histograma(lista)</code> que reciba números.</p>
                <p class="text-gray-300 mb-2">Pide un caracter (prompt: <code class="text-neon-green">"Char: "</code>). Si length != 1, repite.</p>
                <p class="text-gray-300 mb-4">Imprime el caracter multiplicado por cada número de la lista.</p>
                <p class="text-gray-300">Prueba con lista <code class="text-neon-green">[4, 2]</code> y char '*'.</p>
            `,
            expectedOutput: "Char: *\n****\n**",
            help: {
                title: "Generador de Histogramas",
                concept: "Un histograma es una representación visual de datos. En Python, puedes 'multiplicar' un texto por un número para repetirlo.",
                steps: [
                    "Define histograma(lista).",
                    "Usa un bucle while para pedir el caracter con input('Char: ').",
                    "Verifica que len(caracter) sea exactamente 1. Si no, usa 'continue' o sigue pidiendo.",
                    "Dentro de la función, recorre la lista con un for.",
                    "Imprime el caracter multiplicado por el número actual del bucle."
                ],
                tip: "En Python, '*' * 5 resulta en '*****'. ¡Aprovecha esto!"
            },

            points: 25
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Max Min Mean (Args)</h4>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">Max_Min_Mean(*numeros)</code> con argumentos variables.</p>
                <p class="text-gray-300 mb-4">Retorna maximo, minimo y promedio en una tupla.</p>
                <p class="text-gray-300">Prueba con (10, 20, 30) e imprime la tupla retornada.</p>
            `,
            expectedOutput: "(30, 10, 20.0)",
            help: {
                title: "Argumentos Variables (*args)",
                concept: "El operador * permite que una función reciba cualquier cantidad de argumentos, los cuales se agrupan en una tupla.",
                steps: [
                    "Define Max_Min_Mean(*numeros).",
                    "Usa max(numeros) para obtener el mayor.",
                    "Usa min(numeros) para el menor.",
                    "Calcula el promedio: sum(numeros) / len(numeros).",
                    "Retorna los tres valores juntos: return maximo, minimo, promedio."
                ],
                tip: "Al retornar varios valores separados por coma, Python los empaqueta automáticamente en una tupla."
            },

            points: 25
        },
        {
            id: 4,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">4. Comprobar Raíz > 10</h4>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">calcularRaiz(n)</code> -> n**0.5.</p>
                <p class="text-gray-300 mb-4">Define <code class="text-neon-green">comprobar(lista)</code> que itere y use la función anterior.</p>
                <p class="text-gray-300">Si raiz > 10 imprime "Mayor", si no "Menor". Prueba con [100, 144].</p>
                <p class="text-xs text-gray-500">Output exacto: "Menor\nMayor" (Raiz de 100 es 10 (no mayor), 144 es 12 (mayor)).</p>
            `,
            expectedOutput: "Menor\nMayor",
            help: {
                title: "Composición de Funciones",
                concept: "Puedes llamar a una función desde dentro de otra para modularizar tu código y hacerlo más limpio.",
                steps: [
                    "Define calcularRaiz(n) que retorne n**0.5.",
                    "Define comprobar(lista).",
                    "Dentro de comprobar, usa un for para recorrer la lista.",
                    "Llama a calcularRaiz(elemento) y guarda el resultado.",
                    "Usa un if para comparar si es mayor a 10 e imprime el mensaje correspondiente."
                ],
                tip: "La raíz cuadrada de un número es lo mismo que elevarlo a la potencia 0.5."
            },

            points: 25
        }
    ]
};
