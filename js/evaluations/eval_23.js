window.evaluations[22] = {
    id: 23,
    title: "Examen 2025: Lógica Avanzada",
    difficulty: "máster",
    icon: "fa-brain",
    description: "Tema 2 y 3 del Examen de Mejoramiento 2025-1S: Diccionarios y lógica matemática (Números Perfectos).",
    timeLimit: 45,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Inventario de Productos (20 pts)</h4>
                <p class="text-gray-300 mb-2">Implementa la función <code class="text-neon-green">productos_disponibles(d_prod)</code>.</p>
                <p class="text-gray-300 text-sm mb-2">Recibe un diccionario con clave <code class="bg-gray-800 px-1">código</code> y valor lista: <code class="bg-gray-800 px-1">[nombre, precio, disponible]</code>.</p>
                <p class="text-gray-300 text-sm mb-2">Debe retornar un NUEVO diccionario donde la clave sea el <code class="bg-gray-800 px-1">nombre</code> y el valor sea el <code class="bg-gray-800 px-1">precio</code>, PERO SOLO de aquellos productos cuya disponibilidad sea <code class="text-neon-green">True</code>.</p>
                <p class="text-xs text-gray-400 font-mono mt-2 mb-2 p-2 bg-gray-900 rounded">
                    d = {
                        "P01": ["Manzanas", 2.50, True],
                        "P02": ["Peras", 3.00, False],
                        "P03": ["Bananas", 1.80, True]
                    }
                    print(productos_disponibles(d))
                </p>
            `,
            expectedOutput: "{'Manzanas': 2.5, 'Bananas': 1.8}",
            help: {
                title: "Extracción y Creación de Diccionarios",
                concept: "A veces necesitamos crear un nuevo diccionario basado en condiciones dictadas por un diccionario de origen, utilizando sólo algunas de sus partes.",
                steps: [
                    "Define productos_disponibles(d_prod).",
                    "Inicializa un diccionario vacío nuevo_d = {}.",
                    "Itera por los valores del diccionario original: for datos in d_prod.values():.",
                    "[nombre, precio, disp] están en datos[0], datos[1], datos[2].",
                    "Si disp == True, entonces agrega al nuevo diccionario: nuevo_d[nombre] = precio.",
                    "Retorna nuevo_d."
                ],
                tip: "También podrías recorrerlo con dict comprehension: {d[0]: d[1] for d in d_prod.values() if d[2]}."
            },

            points: 40
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Números Perfectos (20 pts)</h4>
                <p class="text-gray-300 mb-2">Un número es perfecto si la suma de sus divisores propios es igual a sí mismo (ej: 6 = 1+2+3).</p>
                <ol class="list-decimal list-inside text-gray-400 text-sm space-y-1 mb-4">
                    <li>Crea una función <code class="text-neon-green">es_perfecto(n)</code> que retorne <code class="bg-gray-800 px-1">True/False</code>.</li>
                    <li>Pide al usuario un número entero mayor a 1 (valida entrada).</li>
                    <li>Muestra cuántos números perfectos hay entre 2 y ese número (inclusive).</li>
                </ol>
                <p class="text-xs text-gray-500">Prueba con N = 30. (Los perfectos son 6 y 28).</p>
            `,
            expectedOutput: "Ingrese numero: 30\nHay 2 numeros perfectos",
            help: {
                title: "Lógica Matemática Compleja y Modularidad",
                concept: "Modularizar una función para verificar si es número perfecto y luego usar un iterador externo para probar varios números simplifica enormemente cualquier problema complejo.",
                steps: [
                    "Define es_perfecto(n). Adentro, usa un sum() de los divisores (desde 1 hasta n-1) comprobando n % divisor == 0. Retorna True si suma == n.",
                    "Pide el límite superior: maximo = int(input('Ingrese numero: ')).",
                    "Crea un contador = 0.",
                    "Usa un ciclo `for numero in range(2, maximo + 1):` y llama a la función `es_perfecto(numero)`.",
                    "Si devuelve True, incrementa el contador.",
                    "Al terminar el ciclo de prueba, imprime 'Hay X numeros perfectos'."
                ],
                tip: "La parte más lenta será buscar los divisores de grandes números. Intenta limitar tu búsqueda a n//2 en lugar de recorrer hasta n-1."
            },

            points: 60
        }
    ]
};
