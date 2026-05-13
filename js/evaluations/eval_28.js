window.evaluations[27] = {
    id: 28,
    title: "Academia: Estudiantes (2015)",
    difficulty: "máster",
    icon: "fa-graduation-cap",
    description: "Tema 2 Examen 2S 2015. Uso avanzado de Sets y Diccionarios para filtrar estudiantes comunes.",
    timeLimit: 30,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Estudiantes Comunes (50 pts)</h4>
                <p class="text-gray-300 mb-2">Una universidad tiene un diccionario de <code class="bg-gray-800 px-1">{Matrícula: Nivel}</code> y dos conjuntos (sets) de matrículas:</p>
                <ul class="list-disc list-inside text-gray-400 text-sm mb-4">
                    <li><code class="text-neon-cyan">estudiantes = {101: 2, 102: 3, 103: 2, 104: 1}</code></li>
                    <li><code class="text-neon-purple">curso_estructuras = {101, 103, 104}</code></li>
                    <li><code class="text-neon-orange">curso_poo = {101, 102}</code></li>
                </ul>
                <p class="text-gray-300 mb-2">Implementa <code class="text-neon-green">estudiantesComunes(dic, set1, set2)</code>.</p>
                <p class="text-gray-300 mb-2">Debe retornar un <strong>NUEVO diccionario</strong> con {Matrícula: Nivel} SOLO de los estudiantes que están en <strong>AMBOS CURSOS</strong> (Intersección).</p>
                <p class="text-xs text-gray-500">¿Quién está en Estructuras Y en POO? Solo el 101.</p>
            `,
            expectedOutput: "{101: 2}",
            help: {
                title: "Filtros Basados en Intersecciones",
                concept: "La conjunción de operaciones de Sets con Diccionarios te permite encontrar rápidamente entidades que cumplan múltiples condiciones.",
                steps: [
                    "Define la función estudiantesComunes(dic, set1, set2).",
                    "Encuentra las matrículas que están en AMBOS conjuntos usando la intersección: comunes = set1 & set2.",
                    "Crea el nuevo diccionario iterando únicamente por esas matrículas filtradas.",
                    "Asegúrate de comprobar si la matrícula existe en el diccionario original antes de extraer el valor.",
                    "nuevo_dic = {matr: dic[matr] for matr in comunes if matr in dic}.",
                    "Imprime y retorna el diccionario generado."
                ],
                tip: "Combinar .intersection() con dict comprehension te ahorrará muchos bloques anidados de if/else."
            },

            points: 100
        }
    ]
};
