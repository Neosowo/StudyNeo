window.evaluations[8] = {
    id: 9,
    title: "Diccionarios (Estudiantes)",
    difficulty: "intermedio",
    icon: "fa-book-open",
    description: "Evaluación sobre gestión de estudiantes con diccionarios (Ayudantía 10).",
    timeLimit: 30,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Crear Diccionario Estudiante</h4>
                <p class="text-gray-300 mb-2">Crea un diccionario <code class="text-neon-green">alumno</code> con:</p>
                <ul class="list-disc list-inside text-gray-400 mb-2 text-sm">
                    <li>Nombre: "Leo"</li>
                    <li>Edad: 20</li>
                    <li>Materias: ["Mat", "Fis"] (Tupla o Lista)</li>
                </ul>
                <p class="text-gray-300">Imprime el diccionario.</p>
            `,
            expectedOutput: "{'Nombre': 'Leo', 'Edad': 20, 'Materias': ['Mat', 'Fis']}",
            help: {
                title: "Creación de Diccionarios",
                concept: "Un diccionario almacena datos en pares clave-valor (key-value).",
                steps: [
                    "Define la variable <code>alumno</code> usando llaves {}.",
                    "Agrega las claves 'Nombre', 'Edad' y 'Materias' con sus respectivos valores.",
                    "Asegúrate de que las claves estén entre comillas.",
                    "Imprime el diccionario completo."
                ],
                tip: "Usa dos puntos : para separar la clave de su valor y comas para separar los pares."
            },

            points: 20
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Actualizar Edad</h4>
                <p class="text-gray-300 mb-2">Usando el diccionario anterior, suma 1 a la edad.</p>
                <p class="text-gray-300 mb-4">Imprime la nueva edad.</p>
                <p class="text-xs text-gray-500">Debe ser 21.</p>
            `,
            expectedOutput: "21",
            help: {
                title: "Modificar Diccionarios",
                concept: "Los diccionarios son mutables, lo que significa que puedes cambiar el valor de una clave después de crearla.",
                steps: [
                    "Accede al valor de la edad usando <code>alumno['Edad']</code>.",
                    "Súmale 1 a ese valor: <code>alumno['Edad'] += 1</code>.",
                    "Imprime directamente el nuevo valor de la edad."
                ],
                tip: "Si intentas acceder a una clave que no existe, Python lanzará un KeyError."
            },

            points: 20
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Consultar Nota</h4>
                <p class="text-gray-300 mb-2">Supón que tienes <code class="text-neon-green">d = {"Mat": 80, "Fis": 50}</code>.</p>
                <p class="text-gray-300 mb-2">Define función <code class="text-neon-green">consultar(dic, mat)</code> que devuelva la nota.</p>
                <p class="text-gray-300 mb-4">Si la materia no está, devuelve "No existe".</p>
                <p class="text-gray-300">Prueba con "Bio" e imprime resultado.</p>
            `,
            expectedOutput: "No existe",
            help: {
                title: "Búsqueda Segura",
                concept: "Para evitar errores al buscar claves, podemos usar el operador 'in' o el método .get().",
                steps: [
                    "Define la función consultar(dic, mat).",
                    "Usa un condicional <code>if mat in dic:</code>.",
                    "Si está, retorna el valor <code>dic[mat]</code>.",
                    "Si no está, retorna el string 'No existe'.",
                    "Prueba la función con 'Bio' e imprime."
                ],
                tip: "El método <code>dic.get(mat, 'No existe')</code> hace lo mismo en una sola línea."
            },

            points: 30
        },
        {
            id: 4,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">4. Recomendaciones</h4>
                <p class="text-gray-300 mb-2">Si nota < 60 -> "Bad". Si >= 60 -> "Good".</p>
                <p class="text-gray-300 mb-2">Itera sobre <code class="text-neon-green">n = [80, 50]</code>.</p>
                <p class="text-gray-300 mb-4">Genera una lista de mensajes y muestra la lista.</p>
                <p class="text-gray-300">Output esperado: <code class="text-neon-green">['Good', 'Bad']</code>.</p>
            `,
            expectedOutput: "['Good', 'Bad']",
            help: {
                title: "Mapeo de Datos",
                concept: "Transformar una lista de números en una lista de palabras se conoce como mapeo.",
                steps: [
                    "Crea una lista vacía para los mensajes.",
                    "Recorre la lista de notas con un bucle for.",
                    "Dentro del bucle, usa un if/else para decidir si la nota es 'Good' o 'Bad'.",
                    "Usa .append() para añadir el mensaje a tu lista.",
                    "Imprime la lista resultante."
                ],
                tip: "También podrías usar una 'List Comprehension' si quieres un código más avanzado y corto."
            },

            points: 30
        }
    ]
};
