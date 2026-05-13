window.evaluations.push({
    id: 999, // ID especial para que esté al final o filtrado
    title: "Protocolo Ghost",
    difficulty: "oculto",
    icon: "fa-user-secret",
    description: "Acceso autorizado nivel 5. Retos de lógica avanzada y criptografía básica.",
    timeLimit: 30,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. El Cifrado César (Criptografía)</h4>
                <p class="text-gray-300 mb-2">Implementa una función que descifre un mensaje. El cifrado rota cada letra 3 posiciones hacia atrás en el alfabeto.</p>
                <p class="text-gray-400 text-sm mb-4">Ejemplo: 'D' -> 'A', 'E' -> 'B'.</p>
                <p class="text-gray-300 mb-2 font-bold">Requerimientos:</p>
                <ul class="list-disc list-inside text-gray-400 mb-4 text-sm">
                    <li>La entrada es una cadena en MAYÚSCULAS.</li>
                    <li>Solo debes rotar letras (A-Z). Ignora espacios y símbolos.</li>
                    <li>Usa el prompt: <code class="text-neon-green">"Mensaje: "</code></li>
                </ul>
                <p class="text-xs text-gray-500">Prueba con "KROD PXQGR" (debe dar "HOLA MUNDO")</p>
            `,
            expectedOutput: "Mensaje: KROD PXQGR\nHOLA MUNDO",
            help: {
                title: "Cifrado César (Rotación de Caracteres)",
                concept: "Para desencriptar este mensaje, necesitamos restar 3 al valor numérico ASCII de cada letra. Si el valor baja de la 'A', damos la vuelta a la 'Z'.",
                steps: [
                    "Pide el mensaje: msj = input('Mensaje: ').",
                    "Crea un string vacío para el resultado: desencriptado = ''.",
                    "Recorre cada letra. Si es un espacio o no es letra, añádela tal cual.",
                    "Si es letra, obtén su ASCII con ord(letra) y réstale 3.",
                    "Si el ASCII resultante es menor a ord('A') (es decir, 65), súmale 26 (cantidad de letras inglesas).",
                    "Convierte de vuelta a caracter con chr().",
                    "Imprime la variable desencriptado."
                ],
                tip: "La fórmula universal para cifrados manejando la vuelta al alfabeto es: nueva_letra = chr((ord(letra) - ord('A') - salto) % 26 + ord('A'))."
            },

            points: 50
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Números Primos Gemelos</h4>
                <p class="text-gray-300 mb-2">Encuentra si un número N y N+2 son ambos primos (primos gemelos).</p>
                <p class="text-gray-300 mb-2">Usa el prompt: <code class="text-neon-green">"Numero: "</code></p>
                <p class="text-gray-300">Si son gemelos, imprime: <code class="text-neon-green">"Es gemelo"</code>. Si no, <code class="text-red-400">"No es gemelo"</code>.</p>
                <p class="text-xs text-gray-500">Ejemplo: 11 (11 y 13 son primos -> Es gemelo). 10 (No es gemelo).</p>
            `,
            expectedOutput: "Numero: 11\nEs gemelo",
            help: {
                title: "Validación de Primos Múltiples",
                concept: "Para comprobar condiciones simultáneas complejas, una función de comprobación separada (es_primo) te ayuda a mantener el código limpio.",
                steps: [
                    "Define una función es_primo(num) que retorne True solo si el número es divisible exactamente por 1 y por sí mismo.",
                    "En tu flujo principal, pide un número entero al usuario.",
                    "Usa un bloque if comprobando ambas condiciones a la vez: if es_primo(N) and es_primo(N+2):",
                    "Si ambas son True, imprime 'Es gemelo'.",
                    "De lo contrario (else), imprime 'No es gemelo'."
                ],
                tip: "Una optimización clásica en tu función es_primo es revisar los divisores solo hasta encontrar la raíz cuadrada del número, no hasta el propio número."
            },

            points: 50
        }
    ]
});
