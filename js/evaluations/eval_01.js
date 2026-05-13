window.evaluations[0] = {
    id: 1,
    title: "Validaciones Básicas",
    difficulty: "principiante",
    icon: "fa-check-double",
    description: "Ejercicios reales de Ayudantía 1: Cédula, Correo y Conversiones.",
    timeLimit: 20,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Validar Cédula (Lógica Booleana)</h4>
                <p class="text-gray-300 mb-2">Escribe un programa que solicite una cédula y valide si cumple TODAS estas condiciones:</p>
                <ul class="list-disc list-inside text-gray-400 mb-4 text-sm">
                    <li>Solo números (no letras).</li>
                    <li>Longitud exacta de 10 dígitos.</li>
                    <li>Empieza con "09".</li>
                </ul>
                <p class="text-gray-300 mb-2 font-bold">Requerimientos:</p>
                <p class="text-gray-400 text-sm mb-4">Usa el prompt: <code class="text-neon-green">"Ingrese su cedula: "</code> y al final imprime: <code class="text-neon-green">"Cedula valida? True"</code> (o False).</p>
                <p class="text-xs text-gray-500">Ejemplo de entrada válida para probar: 0928219281</p>
            `,
            expectedOutput: "Ingrese su cedula: 0928219281\nCedula valida? True",
            help: {
                title: "Validación de Cédula",
                concept: "Para validar una cadena de texto (string), Python ofrece métodos como .isdigit() para números y .startswith() para el inicio.",
                steps: [
                    "Guarda la entrada del usuario en una variable.",
                    "Verifica la longitud usando len(variable). Debe ser 10.",
                    "Comprueba si empieza con '09' usando variable.startswith('09').",
                    "Asegúrate de que solo contenga números con variable.isdigit().",
                    "Usa operadores lógicos (and) para combinar las 3 condiciones."
                ],
                tip: "Recuerda que input() siempre devuelve un texto, incluso si el usuario escribe números."
            },
            
            solutionUrl: "https://www.google.com",
            points: 25
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Conversión Fahrenheit</h4>
                <p class="text-gray-300 mb-2">Solicita una temperatura en grados Fahrenheit (entero) y conviértela a Celsius.</p>
                <p class="text-gray-400 text-sm mb-4">Fórmula: <code class="text-neon-green">C = (F - 32) * 5/9</code></p>
                <p class="text-gray-300 mb-2">Usa el prompt: <code class="text-neon-green">"Ingrese F: "</code></p>
                <p class="text-gray-300">Imprime el formato exacto: <code class="text-neon-green">"X grados F son Y grados C"</code></p>
                <p class="text-xs text-gray-500">Prueba con 77 (da exactamente 25.0°C)</p>
            `,
            expectedOutput: "Ingrese F: 77\n77 grados F son 25.0 grados C",
            help: {
                title: "Conversión de Temperatura",
                concept: "En Python, puedes realizar operaciones matemáticas directas. Recuerda que los paréntesis definen la prioridad.",
                steps: [
                    "Solicita el valor de Fahrenheit usando input().",
                    "Convierte ese valor a entero usando int().",
                    "Aplica la fórmula: C = (F - 32) * 5/9.",
                    "Imprime el resultado usando f-strings o concatenación para que coincida exactamente con el formato esperado."
                ],
                tip: "Prueba con 77 para obtener exactamente 25.0."
            },

            points: 25
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Convertidor de Segundos</h4>
                <p class="text-gray-300 mb-2">Solicita una cantidad de segundos (entero) y descompónlos en horas, minutos y segundos <strong>restantes</strong>.</p>
                <p class="text-gray-400 text-sm mb-4">Prompt: <code class="text-neon-green">"Segundos: "</code></p>
                <p class="text-gray-300 mb-2">Usa <strong>división entera</strong> <code class="text-neon-green">//</code> y <strong>módulo</strong> <code class="text-neon-green">%</code>:</p>
                <ul class="list-disc list-inside text-gray-400 mb-3 text-sm">
                    <li><code class="text-neon-green">hora = segundos // 3600</code></li>
                    <li><code class="text-neon-green">minutos = (segundos % 3600) // 60</code></li>
                    
                </ul>
                <p class="text-gray-300">Salida exacta: <code class="text-neon-green">"X seg son H hora(s), M minuto(s), S segundo(s)"</code></p>
                <p class="text-xs text-gray-500">Prueba con 3661 → 1 hora, 1 minuto</p>
            `,
            expectedOutput: "Segundos: 3661\n3661 seg son 1 hora(s), 1 minuto(s)",
            help: {
                title: "Desglose de Tiempo",
                concept: "Este ejercicio usa operadores de división especial: // (cociente entero) y % (residuo).",
                steps: [
                    "Obtén los segundos totales con input() e int().",
                    "Calcula las horas dividiendo los segundos entre 3600 usando //.",
                    "Para los minutos, obtén el resto de la división anterior (%) y divídelo entre 60 (//).",
                    "Calcula los segundos restantes usando el operador módulo % 60."
                ],
                tip: "3600 segundos equivalen exactamente a 1 hora."
            },

            points: 25
        },
        {
            id: 4,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">4. Validar Correo Institucional</h4>
                <p class="text-gray-300 mb-2">Valida si un correo es institucional:</p>
                <ul class="list-disc list-inside text-gray-400 mb-2 text-sm">
                    <li>Termina en ".edu.ec".</li>
                    <li>Tiene exactamente una "@".</li>
                    <li>Empieza con letra.</li>
                    <li>El usuario (parte antes de @) no está vacío.</li>
                </ul>
                <p class="text-gray-300">Prompt: <code class="text-neon-green">"Correo: "</code>. Imprime <code class="text-neon-green">"Valido? True"</code></p>
                <p class="text-xs text-gray-500">Ejemplo de correo válido para probar: neo@uni.edu.ec</p>
            `,
            expectedOutput: "Correo: neo@uni.edu.ec\nValido? True",
            help: {
                title: "Validador de Correo",
                concept: "Validar strings complejos requiere combinar varios métodos de Python como .endswith() y .count().",
                steps: [
                    "Pide el correo al usuario.",
                    "Verifica que termine en '.edu.ec'.",
                    "Cuenta las '@' usando el método .count('@'). Debe ser exactamente 1.",
                    "Comprueba que el primer carácter sea una letra usando el método .isalpha().",
                    "Divide el correo por la '@' para verificar que la parte del usuario no esté vacía."
                ],
                tip: "Usa el operador 'and' para que todas las condiciones se cumplan simultáneamente."
            },

            points: 25
        }
    ]
};
