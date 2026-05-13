window.evaluations[17] = {
    id: 18,
    title: "Geografía 2021",
    difficulty: "intermedio",
    icon: "fa-globe-americas",
    description: "Evaluación FP2021: Diccionarios de 3 niveles y aleatoriedad.",
    timeLimit: 30,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Ciudad Aleatoria</h4>
                <p class="text-gray-300 mb-2">Supón un diccionario de Países->Provincias->Ciudades.</p>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">random_city(d, pais)</code>.</p>
                <p class="text-gray-300 mb-4">Usa <code class="text-neon-green">random.choice</code> doble (primero elige provincia random, luego ciudad random).</p>
                <p class="text-gray-300">Seed(42). Datos: <code class="text-neon-green">d = {"Ecuador": {"Guayas": ["Gye"], "Manabi": ["Manta"]}}</code>.</p>
            `,
            expectedOutput: "Gye",
            help: {
                title: "Doble Selección Aleatoria",
                concept: "Para seleccionar un elemento aleatorio de un diccionario anidado, primero debemos listar sus claves y usar random.choice sobre esa lista.",
                steps: [
                    "Importa random y usa random.seed(42) al inicio para la prueba.",
                    "Define random_city(d, pais).",
                    "Obtén el diccionario de provincias: provincias = d[pais].",
                    "Elige una provincia al azar: prov_elegida = random.choice(list(provincias.keys())).",
                    "Usando la provincia elegida, obtén la lista de ciudades: ciudades = provincias[prov_elegida].",
                    "Elige una ciudad al azar y retórnala.",
                    "Imprime el resultado."
                ],
                tip: "random.choice() necesita listas. list(diccionario.keys()) asegura que random funcione correctamente sobre las provincias."
            },

            points: 50
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Agregar Ciudad Nueva</h4>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">agregar(d, pais, prov, ciudad)</code>.</p>
                <p class="text-gray-300 mb-4">Si no existe país, créalo. Si no existe prov, créala. Agrega ciudad a la lista.</p>
                <p class="text-gray-300 mb-2">Prueba agregando "Cuenca" a "Azuay" en "Ecuador".</p>
                <p class="text-gray-300">Imprime el diccionario final.</p>
            `,
            expectedOutput: "{'Ecuador': {'Guayas': ['Gye'], 'Manabi': ['Manta'], 'Azuay': ['Cuenca']}}",
            help: {
                title: "Inserción Segura en Diccionarios Anidados",
                concept: "Cuando anidamos diccionarios y listas, siempre debemos comprobar si existen las claves de nivel superior antes de añadir datos adentro.",
                steps: [
                    "Define agregar(d, pais, prov, ciudad).",
                    "Comprueba si el país NO existe en d. Si no, asígnale un diccionario vacío d[pais] = {}.",
                    "Comprueba si la provincia NO existe en d[pais]. Si no, asígnale una lista vacía d[pais][prov] = [].",
                    "Agrega la ciudad a esa lista: d[pais][prov].append(ciudad).",
                    "Prueba la función y luego imprime todo el diccionario."
                ],
                tip: "El método dict.setdefault() agrupa esto. Literalmente una sola línea resuelve todo: d.setdefault(pais, {}).setdefault(prov, []).append(ciudad)."
            },

            points: 50
        }
    ]
};
