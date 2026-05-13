window.evaluations[2] = {
    id: 3,
    title: "Bucles y Listas",
    difficulty: "intermedio",
    icon: "fa-list-ul",
    description: "Evaluación sobre bucles while, algoritmos con listas y validaciones de entrada.",
    timeLimit: 30,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Sumador de Números</h4>
                <p class="text-gray-300 mb-2">Pide números al usuario hasta que ingrese 0.</p>
                <p class="text-gray-300 mb-2">Usa <code class="text-neon-green">while</code> e <code class="text-neon-green">input()</code>.</p>
                <p class="text-gray-300 mb-4">Al final imprime la suma total: <code class="text-neon-green">"La sumatoria es X"</code>.</p>
                <p class="text-xs text-gray-500">Prompt: <code class="text-neon-green">Input 0 para salir: </code>. Prueba con 10, 20, 0.</p>
            `,
            expectedOutput: "Input 0 para salir: 10\nInput 0 para salir: 20\nInput 0 para salir: 0\nLa sumatoria es 30",
            help: {
                title: "Sumador Acumulativo",
                concept: "Para sumar valores desconocidos, usamos un acumulador (variable que empieza en 0) y un bucle que se repite hasta que se cumpla una condición.",
                steps: [
                    "Inicializa una variable <code>suma = 0</code>.",
                    "Pide el primer número fuera del bucle u usa un bucle <code>while True</code>.",
                    "Dentro del bucle, pide el número y conviértelo a entero.",
                    "Si el número es 0, usa <code>break</code> para salir del bucle.",
                    "Si no es 0, súmalo a tu variable acumuladora.",
                    "Al final, imprime el mensaje exacto con la suma total."
                ],
                tip: "Asegúrate de que el prompt del input sea exactamente 'Input 0 para salir: '."
            },

            points: 25
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Palíndromo Numérico</h4>
                <p class="text-gray-300 mb-2">Verifica si un número de varias cifras se lee igual al derecho y al revés.</p>
                <p class="text-gray-300 mb-2">Prompt: <code class="text-neon-green">"Numero: "</code>.</p>
                <p class="text-gray-300 mb-4 font-bold">Sin usar <code class="text-neon-green">reversed()</code>, usa un bucle for comparando índices.</p>
                <p class="text-gray-300">Salida: <code class="text-neon-green">"Es palindromo? True"</code></p>
                <p class="text-xs text-gray-500">Prueba con 12321.</p>
            `,
            expectedOutput: "Numero: 12321\nEs palindromo? True",
            help: {
                title: "Lógica de Palíndromos",
                concept: "Un palíndrono es una palabra o número que se lee igual de izquierda a derecha que viceversa.",
                steps: [
                    "Convierte la entrada a string si no lo es.",
                    "Usa un bucle for que recorra la mitad de la longitud del texto.",
                    "Compara el carácter en la posición 'i' con el carácter en la posición opuesta (longitud - 1 - i).",
                    "Si encuentras una diferencia, el resultado es Falso.",
                    "Si terminas el bucle sin diferencias, es Verdadero."
                ],
                tip: "En Python, puedes usar los índices negativos como variable[-1] para acceder al último elemento."
            },

            points: 25
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Promedio de Talleres (Avanzado)</h4>
                <p class="text-gray-300 mb-2">Pide al usuario cuántos talleres tiene (prompt: <code class="text-neon-green">"N: "</code>). Para el examen usa 3.</p>
                <p class="text-gray-300 mb-2">Luego pide las notas (prompt: <code class="text-neon-green">"Nota: "</code>).</p>
                <p class="text-gray-300 mb-4 font-bold">Elimina la nota más baja de la lista y calcula el promedio de las restantes.</p>
                <p class="text-gray-300">Salida final: <code class="text-neon-green">"Promedio: X.X"</code>. Notas: 10, 5, 8. (Elimina 5, promedio de 10 y 8 es 9.0)</p>
            `,
            expectedOutput: "N: 3\nNota: 10\nNota: 5\nNota: 8\nPromedio: 9.0",
            help: {
                title: "Procesamiento de Notas",
                concept: "Este ejercicio requiere manejar una lista dinámica y realizar operaciones estadísticas básicas (mínimo y promedio).",
                steps: [
                    "Pide la cantidad de notas N y conviértela a entero.",
                    "Usa un for para pedir cada nota e insertarla en una lista (.append).",
                    "Usa la función min(lista) para encontrar el valor más bajo.",
                    "Remueve ese valor usando lista.remove().",
                    "Calcula la suma de los restantes con sum() y divide entre la nueva longitud len()."
                ],
                tip: "La función .remove(valor) solo quita la primera coincidencia que encuentra."
            },

            points: 30
        },
        {
            id: 4,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">4. Agregar Cantantes (Validación)</h4>
                <p class="text-gray-300 mb-2">Tienes una lista vacía <code class="text-neon-green">lista = []</code>.</p>
                <p class="text-gray-300 mb-2">Pide un nombre (prompt: <code class="text-neon-green">"Nombre: "</code>). Si ya existe en la lista, vuelve a pedir.</p>
                <p class="text-gray-300 mb-4">Hazlo 2 veces. Imprime la lista final.</p>
                <p class="text-xs text-gray-500">Prueba con "Ana", luego intenta "Ana" de nuevo (debe rechazarlo implícitamente, pero en test escribe "Ana", "Luis").</p>
            `,
            expectedOutput: "Nombre: Ana\nNombre: Luis\n['Ana', 'Luis']",
            help: {
                title: "Validación de Elementos Únicos",
                concept: "Para evitar duplicados en una lista, comprobamos la existencia del elemento antes de añadirlo.",
                steps: [
                    "Crea una lista vacía.",
                    "Usa un bucle while que se mantenga hasta que la lista tenga 2 elementos (len(lista) < 2).",
                    "Pide un nombre al usuario.",
                    "Usa el condicional 'if nombre not in lista' para verificar si el nombre es nuevo.",
                    "Solo si es nuevo, añádelo con .append().",
                    "Al finalizar, imprime la lista completa."
                ],
                tip: "El operador 'not in' es la forma más rápida y legible de verificar ausencias en Python."
            },

            points: 20
        }
    ]
};
