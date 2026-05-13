window.evaluations[3] = {
    id: 4,
    title: "Funciones y Módulos",
    difficulty: "intermedio",
    icon: "fa-cube",
    description: "Ejercicios de Ayudantía 3: Volumen de Esfera, Listas sin Repetir y Búsqueda.",
    timeLimit: 25,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Volumen de Esfera</h4>
                <p class="text-gray-300 mb-2">Importa el módulo <code class="text-neon-green">math</code>.</p>
                <p class="text-gray-300 mb-2">Define una función <code class="text-neon-green">volumenEsfera(radio)</code> que retorna el volumen.</p>
                <p class="text-gray-400 text-sm mb-4">Fórmula: (4/3) * pi * radio^3. Si radio es negativo, retorna -1.</p>
                <p class="text-gray-300">Prueba con radio 10 e imprime el resultado.</p>
            `,
            expectedOutput: "4188.790204786391",
            help: {
                title: "Uso de Módulos Matemáticos",
                concept: "Python tiene el módulo 'math' que incluye constantes como PI y funciones de potencia.",
                steps: [
                    "Importa math al inicio del código.",
                    "Define la función volumenEsfera(radio).",
                    "Usa un if para validar si el radio es menor a 0 y retorna -1.",
                    "Usa (4/3) * math.pi * (radio**3) para el cálculo.",
                    "Llama a la función con 10 e imprime el resultado."
                ],
                tip: "Puedes usar math.pow(radio, 3) o simplemente radio**3 para elevar al cubo."
            },

            points: 20
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Enteros Sin Repetir</h4>
                <p class="text-gray-300 mb-2">Define función <code class="text-neon-green">enterosSinRepetir(lista)</code> que reciba una lista con duplicados y retorne una nueva lista con elementos únicos.</p>
                <p class="text-gray-300 mb-4">Sin usar SET, hazlo con bucle y condicional <code class="text-neon-green">if not in</code>.</p>
                <p class="text-gray-300">Prueba con <code class="text-neon-green">[4,3,23,23,4,5,7]</code> e imprime.</p>
            `,
            expectedOutput: "[4, 3, 23, 5, 7]",
            help: {
                title: "Filtrado de Duplicados",
                concept: "Limpiar una lista de elementos repetidos es una tarea común que se resuelve con una lista auxiliar y una verificación de pertenencia.",
                steps: [
                    "Define la función que reciba la lista.",
                    "Crea una nueva lista vacía dentro de la función.",
                    "Recorre la lista original con un for.",
                    "Si el elemento actual NO está en la nueva lista, añádelo con .append().",
                    "Retorna la nueva lista al finalizar el bucle."
                ],
                tip: "No intentes borrar elementos de la lista original mientras la recorres, eso puede causar errores lógicos."
            },

            points: 25
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Buscar Nombres</h4>
                <p class="text-gray-300 mb-2">Define función <code class="text-neon-green">buscar(arreglo, texto)</code> para encontrar nombres que contengan el texto (sin importar mayúsculas).</p>
                <p class="text-gray-300 mb-4">Debe retornar lista de coincidencias formateadas en Title Case y sin espacios.</p>
                <p class="text-gray-300">Prueba con <code class="text-neon-green">["leonardo mENDoza", "Luis"]</code> y busca "l".</p>
            `,
            expectedOutput: "['LeonardoMendoza', 'Luis']",
            help: {
                title: "Búsqueda y Formateo",
                concept: "Este reto combina búsqueda en listas con manipulación avanzada de strings (mayúsculas y espacios).",
                steps: [
                    "Crea una lista de resultados vacía.",
                    "Recorre el arreglo de nombres.",
                    "Convierte tanto el nombre como el texto de búsqueda a .lower() para una comparación insensible a mayúsculas.",
                    "Si hay coincidencia, limpia los espacios con .replace(' ', '') y dale formato con .title().",
                    "Añade el nombre procesado a la lista de resultados."
                ],
                tip: "La función .title() pone la primera letra de cada palabra en mayúscula."
            },

            points: 25
        },
        {
            id: 4,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">4. Saludo Personalizado</h4>
                <p class="text-gray-300 mb-2">Define función <code class="text-neon-green">saludo3(nombre="")</code> con parámetro por defecto vacío.</p>
                <p class="text-gray-300">Debe retornar "Hola " + nombre. Prueba con "Pedro" e imprímelo.</p>
            `,
            expectedOutput: "Hola Pedro",
            help: {
                title: "Parámetros por Defecto",
                concept: "Las funciones pueden tener valores que se usan si no se envía ningún argumento al llamarlas.",
                steps: [
                    "Define la función saludo3(nombre='').",
                    "Retorna la concatenación 'Hola ' + nombre.",
                    "Prueba llamando a la función pasando 'Pedro' como argumento.",
                    "Imprime el valor retornado."
                ],
                tip: "Si llamaras a saludo3() sin argumentos, el resultado sería simplemente 'Hola '."
            },

            points: 30
        }
    ]
};
