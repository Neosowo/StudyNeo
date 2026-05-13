window.evaluations[12] = {
    id: 13,
    title: "Especies Peligro (Examen 2019)",
    difficulty: "avanzado",
    icon: "fa-paw",
    description: "Evaluación sobre Diccionarios Anidados (Ayudantía 12: Especies).",
    timeLimit: 30,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. País Más Popular por Especie</h4>
                <p class="text-gray-300 mb-2">Diccionario: <code class="text-neon-green">d = {"Tigre": [("India", 100), ("Nepal", 50)]}</code>.</p>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">masPopular(d, esp)</code> que retorne el país con más ejemplares.</p>
                <p class="text-gray-300">Prueba con "Tigre".</p>
            `,
            expectedOutput: "India",
            help: {
                title: "Búsqueda de Máximos en Tuplas",
                concept: "Para encontrar el país con más ejemplares, debemos iterar sobre la lista de tuplas asociada a una especie y llevar un registro del máximo.",
                steps: [
                    "Define masPopular(d, esp).",
                    "Obtén la lista de tuplas de la especie usando d[esp].",
                    "Crea variables max_ejemplares = -1 y pais_max = ''.",
                    "Recorre la lista con un bucle 'for pais, cant in lista_tuplas:'.",
                    "Si cant > max_ejemplares, actualiza max_ejemplares y pais_max.",
                    "Retorna o imprime pais_max."
                ],
                tip: "También podrías usar la función max() con una función lambda como 'key', pero el bucle for manual es más seguro si estás aprendiendo."
            },

            points: 40
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Lista de Países por Especie</h4>
                <p class="text-gray-300 mb-2">Invierte la lógica: Retorna un diccionario donde la clave sea el país y el valor una lista de especies.</p>
                <p class="text-gray-300 mb-4">Define <code class="text-neon-green">pais_especie(d)</code>.</p>
                <p class="text-gray-300">Prueba con: <code class="text-neon-green">{"Tigre": [("India", 100)]}</code> -> {"India": ["Tigre"]}.</p>
            `,
            expectedOutput: "{'India': ['Tigre']}",
            help: {
                title: "Inversión de Diccionarios",
                concept: "Para invertir la estructura, necesitamos agrupar por el nuevo valor clave (país) e ir añadiendo las antiguas claves (especies) a sus respectivas listas.",
                steps: [
                    "Define pais_especie(d).",
                    "Crea un diccionario vacío nuevo_dic = {}.",
                    "Usa un ciclo exterior para iterar por especie y lista de tuplas usando d.items().",
                    "Usa un ciclo interior iterando por 'pais, cant' dentro de la lista de tuplas.",
                    "Si el país no está en nuevo_dic, añádelo con una lista vacía inicial: nuevo_dic[pais] = [].",
                    "Añade la especie a la lista: nuevo_dic[pais].append(especie).",
                    "Retorna o imprime nuevo_dic al final."
                ],
                tip: "Usa nuevo_dic.setdefault(pais, []).append(especie) para agrupar los pasos 5 y 6 en una sola línea elegante."
            },

            points: 60
        }
    ]
};
