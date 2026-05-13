window.evaluations[16] = {
    id: 17,
    title: "Gestión Archivos (Proyecto)",
    difficulty: "avanzado",
    icon: "fa-folder-open",
    description: "Evaluación Mejoramiento 2020: Carga y escritura de datos múltiples.",
    timeLimit: 35,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Cargar Matriz Cosechas</h4>
                <p class="text-gray-300 mb-2">Simula carga de archivo texto: <code class="text-neon-green">Prod,Mes,Cant\\\\nA,Ene,100\\\\nB,Ene,50\\\\nA,Feb,60</code>.</p>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">cargar(texto)</code> que sume las cantidades por producto y mes en una Matriz o Diccionario.</p>
                <p class="text-gray-300 mb-4">Retorna el total de A en Ene (100) y Feb (60) = 160.</p>
            `,
            expectedOutput: "160",
            help: {
                title: "Procesamiento de Archivos CSV (Simulado)",
                concept: "Para procesar un archivo de texto plano como un CSV, debemos separar la cadena principal por saltos de línea, y luego cada línea por comas.",
                steps: [
                    "Define cargar(texto).",
                    "Separa las líneas de texto ignorando la primera (cabecera): lineas = texto.split('\\\\n')[1:].",
                    "Crea un acumulador_A = 0.",
                    "Recorre cada línea con for, divídela por coma (linea.split(',')) y obtén sus partes.",
                    "Verifica si la primera parte de la división es 'A'.",
                    "Si lo es, suma la cantidad (convertida a int) al acumulador.",
                    "Retorna o imprime el total final."
                ],
                tip: "Asegúrate de manejar '\\\\n' o '\\n' según te indique la entrada simulada en Python."
            },

            points: 50
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Generar Reporte txt</h4>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">generar_reporte(dic, cat)</code>.</p>
                <p class="text-gray-300 mb-2">Debe crear un string formateado csv: <code class="text-neon-green">"Prod,Cant\\\\nA,100\\\\nB,50"</code>.</p>
                <p class="text-gray-300 mb-4">Solo retorna el string simulando el contenido del archivo.</p>
                <p class="text-gray-300">Prueba con ` + '`dic={"A":100, "B":50}`' + `.</p>
            `,
            expectedOutput: "Prod,Cant\nA,100\nB,50",
            help: {
                title: "Generador de CSV (Simulado)",
                concept: "Generar un archivo CSV implica escribir un string que tenga un formato específico de cabecera y filas de datos separadas por \\n.",
                steps: [
                    "Define generar_reporte(dic, cat). (cat no importa en este test).",
                    "Crea la variable 'reporte' y asígnale la cabecera inicial: reporte = 'Prod,Cant\\n'.",
                    "Usa un for para iterar por clave y valor en dic.items().",
                    "Por cada par, usa f-strings para añadir la data: reporte += f'{clave},{valor}\\n'.",
                    "Al finalizar el bucle, asegúrate de eliminar el último salto de línea extra usando .rstrip('\\n').",
                    "Retorna o imprime el reporte final formateado."
                ],
                tip: "El método .rstrip('\\n') al final de un string remueve de forma segura el último salto de línea."
            },

            points: 50
        }
    ]
};
