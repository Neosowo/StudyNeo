window.evaluations[15] = {
    id: 16,
    title: "Parsing y Lógica (Mejoramiento)",
    difficulty: "intermedio",
    icon: "fa-code",
    description: "Ejercicios de Mejoramiento 2020: Manipulación de Strings complejos y lógica de juegos.",
    timeLimit: 25,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Parsing de Datos String</h4>
                <p class="text-gray-300 mb-2">Cadena A: <code class="text-neon-green">"Empresas,17,0|9|1,10|19|2"</code>.</p>
                <p class="text-gray-300 mb-2">Objetivo: Extraer los primeros números de cada bloque separado por pipes '|' después de la segunda coma.</p>
                <p class="text-gray-300 mb-4">Define <code class="text-neon-green">parse(A)</code>.</p>
                <p class="text-gray-300">Debe retornar lista [0, 10]. (Extrae el 0 de 0|9|1 y el 10 de 10|19|2).</p>
            `,
            expectedOutput: "[0, 10]",
            help: {
                title: "Procesamiento de Cadenas Complejas",
                concept: "Para extraer información específica de un string formateado, usamos el método .split() consecutivamente, dividiendo primero por un delimitador y luego por otro.",
                steps: [
                    "Define parse(A).",
                    "Crea una lista vacía para guardar los resultados.",
                    "Separa la cadena por comas: partes = A.split(',').",
                    "Los bloques que te interesan están desde el índice 2 en adelante: bloques = partes[2:].",
                    "Recorre esos bloques con un for.",
                    "Para cada bloque, divídelo por el pipe '|': nums = bloque.split('|').",
                    "Toma el primer elemento nums[0], conviértelo a entero (int) y añádelo a tu lista final.",
                    "Retorna o imprime la lista."
                ],
                tip: "Usa sub-slicing partes[2:] para ignorar los metadatos iniciales ('Empresas' y '17')."
            },

            points: 50
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Puntaje Juego</h4>
                <p class="text-gray-300 mb-2">Diccionario <code class="text-neon-green">ptos = {"A": 10, "B": 5}</code>.</p>
                <p class="text-gray-300 mb-4">Calcula el puntaje de una palabra sumando sus letras. Si la letra no tiene puntaje, suma 0.</p>
                <p class="text-gray-300">Palabra "ABA" -> 10 + 5 + 10 = 25.</p>
            `,
            expectedOutput: "25",
            help: {
                title: "Suma de Valores Mapeados",
                concept: "Para calcular un puntaje basado en letras, iteramos sobre cada carácter del string y buscamos su valor en un diccionario de puntuaciones.",
                steps: [
                    "Define el diccionario ptos.",
                    "Define la variable palabra = 'ABA'.",
                    "Crea un acumulador puntaje_total = 0.",
                    "Recorre la palabra con un for: for letra in palabra:.",
                    "Usa ptos.get(letra, 0) para obtener el valor de la letra. Si no está, devuelve 0.",
                    "Suma ese valor a puntaje_total.",
                    "Imprime puntaje_total al final."
                ],
                tip: "El segundo argumento de .get(clave, valor_defecto) es crucial aquí para evitar errores si una letra de la palabra no existe en el diccionario."
            },

            points: 50
        }
    ]
};
