window.evaluations[10] = {
    id: 11,
    title: "Análisis COVID (Ayudantía 11)",
    difficulty: "avanzado",
    icon: "fa-virus",
    description: "Evaluación sobre diccionarios anidados: Datos reales de contagios en Ecuador.",
    timeLimit: 30,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Consultar por Fecha</h4>
                <p class="text-gray-300 mb-2">Supón un diccionario <code class="text-neon-green">d = {"2020-01-22": {"total": {"contagiados": 10}}}</code>.</p>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">consultar(dic, fecha)</code> que retorne los contagios totales de esa fecha.</p>
                <p class="text-gray-300 mb-4">Si la fecha no existe, intenta manejar el error (o asume que existe).</p>
                <p class="text-gray-300">Prueba con dic <code class="text-neon-green">{"2020": {"total": {"contagiados": 5}}}</code> y fecha "2020".</p>
            `,
            expectedOutput: "5",
            help: {
                title: "Acceso a Diccionarios Anidados",
                concept: "Para acceder a datos dentro de diccionarios que están dentro de otros diccionarios, debes encadenar las claves o llaves usando los corchetes [].",
                steps: [
                    "Define la función consultar(dic, fecha).",
                    "Asegúrate de comprobar que la fecha que buscas exista en el diccionario principal.",
                    "Accede a los datos usando las claves: dic[fecha]['total']['contagiados'].",
                    "Retorna el valor y recuerda probar la función con una llamada de print."
                ],
                tip: "Usa el método dic.get(fecha, {}) para evitar errores si la fecha no existe e intentar obtener subclaves de forma segura."
            },

            points: 25
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Día con Más Contagios</h4>
                <p class="text-gray-300 mb-2">El diccionario tiene clave "diario" -> "contagiados".</p>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">maxContagios(dic)</code>.</p>
                <p class="text-gray-300 mb-4">Itera sobre las fechas y encuentra la fecha con mayor número de contagios diarios.</p>
                <p class="text-gray-300">Retorna la fecha. Prueba con: <code class="text-neon-green">{"A": {"diario": {"contagiados": 10}}, "B": {"diario": {"contagiados": 20}}}</code> -> "B".</p>
            `,
            expectedOutput: "B",
            help: {
                title: "Encontrar Máximos en Diccionarios",
                concept: "Para encontrar el valor máximo dentro de un diccionario anidado, debes recorrer las claves mientras llevas un seguimiento del valor más alto encontrado hasta el momento y la clave asociada a él.",
                steps: [
                    "Define maxContagios(dic).",
                    "Crea una variable max_contagios = -1 y una variable fecha_max = ''.",
                    "Usa un for para iterar sobre los elementos del diccionario (las fechas).",
                    "Obtén la cantidad de contagiados usando dic[fecha]['diario']['contagiados'].",
                    "Usa un if para chequear si es mayor que tu max_contagios actual, y si es así actualiza tanto max_contagios como fecha_max.",
                    "Retorna o imprime fecha_max."
                ],
                tip: "Utiliza un valor inicial muy bajo para buscar el máximo y asegurar que será reemplazado por los valores reales en el diccionario."
            },

            points: 35
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Total Recuperados</h4>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">totalRecuperados(dic)</code>.</p>
                <p class="text-gray-300 mb-4">Suma todos los "recuperados" DIARIOS de todas las fechas.</p>
                <p class="text-gray-300">Estructura: dic[fecha]["diario"]["recuperados"]. Prueba con datos simples.</p>
            `,
            expectedOutput: "30",
            help: {
                title: "Sumatoria sobre Diccionarios Complejos",
                concept: "Se necesita recorrer todos los elementos del diccionario de forma secuencial, adentrándose en diferentes niveles y calculando un total global de los mismos.",
                steps: [
                    "Define totalRecuperados(dic).",
                    "Crea una variable suma = 0 para acumular.",
                    "Recorre el diccionario por cada una de sus llaves que representan fechas.",
                    "Acumula en tu variable la cantidad que está asegurada en cada fecha por ej. suma += dic[fecha]['diario']['recuperados'].",
                    "Al finalizar el bucle, retorna o imprime la suma total."
                ],
                tip: "Asegúrate de inicializar siempre las variables acumuladoras como suma antes de empezar cualquier bucle for."
            },

            points: 40
        }
    ]
};
