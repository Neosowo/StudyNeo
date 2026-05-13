window.evaluations[9] = {
    id: 10,
    title: "Proyecto Final: Ciudades",
    difficulty: "avanzado",
    icon: "fa-city",
    description: "Evaluación Final (Ayudantía 10): Diccionarios complejos, consultas y anidamiento.",
    timeLimit: 40,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Cargar Datos Simulado</h4>
                <p class="text-gray-300 mb-2">Simula la carga de un CSV a un diccionario.</p>
                <p class="text-gray-300 mb-2">Estructura deseada: <code class="text-neon-green">{"Ecuador": ["Guayaquil", "Quito"], "peru": ["Lima"]}</code>.</p>
                <p class="text-gray-300 mb-4">Crea este diccionario manualmente y asignalo a variable <code class="text-neon-green">paises</code>.</p>
                <p class="text-gray-300">Imprime el diccionario.</p>
            `,
            expectedOutput: "{'Ecuador': ['Guayaquil', 'Quito'], 'peru': ['Lima']}",
            help: {
                title: "Diccionarios de Listas",
                concept: "Un diccionario puede contener cualquier tipo de dato, incluyendo listas. Esto permite agrupar múltiples valores bajo una sola clave.",
                steps: [
                    "Define el diccionario <code>paises</code>.",
                    "La clave será el nombre del país (string).",
                    "El valor será una lista [] con los nombres de las ciudades.",
                    "Asegúrate de respetar las mayúsculas y minúsculas del ejemplo."
                ],
                tip: "Recuerda cerrar cada lista con ] y cada par con coma."
            },

            points: 20
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Ciudad Aleatoria</h4>
                <p class="text-gray-300 mb-2">Importa <code class="text-neon-green">random</code>.</p>
                <p class="text-gray-300 mb-2">Define función <code class="text-neon-green">ciudadAleatoria(pais, dic)</code>.</p>
                <p class="text-gray-300 mb-4">Usa <code class="text-neon-green">random.choice(dic[pais])</code>.</p>
                <p class="text-gray-300 text-sm">Seed(42). Prueba con "Ecuador". Imprime resultado.</p>
            `,
            expectedOutput: "Quito",
            help: {
                title: "Selección Aleatoria",
                concept: "El módulo random permite elegir elementos de una secuencia de forma impredecible.",
                steps: [
                    "Importa random.",
                    "Usa <code>random.seed(42)</code> para que el test sea determinístico.",
                    "Define la función <code>ciudadAleatoria(pais, dic)</code>.",
                    "Usa <code>random.choice()</code> pasando como argumento la lista que está en <code>dic[pais]</code>.",
                    "Retorna e imprime el resultado de llamar a la función con 'Ecuador'."
                ],
                tip: "La semilla (seed) hace que 'random' devuelva siempre lo mismo, lo cual es vital para pasar pruebas automáticas."
            },

            points: 25
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Consultar País</h4>
                <p class="text-gray-300 mb-2">Dada una ciudad, encuentra a qué país pertenece.</p>
                <p class="text-gray-300 mb-2">Recorre claves y valores del diccionario.</p>
                <p class="text-gray-300 mb-4">Si ciudad está en la lista del país, retorna el país.</p>
                <p class="text-gray-300">Prueba buscar "Lima". Imprime el país encontrado.</p>
            `,
            expectedOutput: "peru",
            help: {
                title: "Búsqueda Inversa",
                concept: "Para encontrar una clave a partir de un valor, debemos iterar sobre todos los elementos del diccionario.",
                steps: [
                    "Usa un bucle <code>for pais, ciudades in paises.items():</code>.",
                    "Dentro, usa otro condicional para ver si la ciudad buscada 'Lima' está <code>in ciudades</code>.",
                    "Si lo está, imprime el nombre del país (la clave actual)."
                ],
                tip: "El método .items() te devuelve tanto la clave como el valor en cada paso del bucle."
            },

            points: 25
        },
        {
            id: 4,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">4. Agregar Ciudad</h4>
                <p class="text-gray-300 mb-2">Agrega "Cuenca" a la lista de "Ecuador".</p>
                <p class="text-gray-300 mb-4">Usa <code class="text-neon-green">.append()</code>.</p>
                <p class="text-gray-300">Imprime la lista de ciudades de Ecuador actualizada.</p>
            `,
            expectedOutput: "['Guayaquil', 'Quito', 'Cuenca']",
            help: {
                title: "Modificar Listas Anidadas",
                concept: "Para cambiar una lista dentro de un diccionario, primero accedemos a la lista por su clave y luego usamos métodos de lista.",
                steps: [
                    "Accede a la lista de Ecuador: <code>paises['Ecuador']</code>.",
                    "Usa el método <code>.append('Cuenca')</code> sobre esa lista.",
                    "Imprime la lista <code>paises['Ecuador']</code> para verificar el cambio."
                ],
                tip: "No necesitas reasignar la lista al diccionario, .append() modifica la lista original directamente."
            },

            points: 30
        }
    ]
};
