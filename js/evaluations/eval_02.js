window.evaluations[1] = {
    id: 2,
    title: "Lógica y Condicionales",
    difficulty: "principiante",
    icon: "fa-project-diagram",
    description: "Ejercicios reales de Ayudantía 2: Hora, Penaltis y Descuentos.",
    timeLimit: 25,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Formato de Hora (AM/PM)</h4>
                <p class="text-gray-300 mb-2">Solicita una hora en formato HH:MM (ej: 14:30).</p>
                <p class="text-gray-300 mb-2">Extrae la hora y determina si es AM (menor a 12) o PM.</p>
                <p class="text-gray-400 text-sm mb-4">Prompt: <code class="text-neon-green">"Hora (HH:MM): "</code></p>
                <p class="text-gray-300">Salida esperada para 14:30: <code class="text-neon-green">"ES P.M"</code></p>
                <p class="text-xs text-gray-500">Nota: Asume formato de 24 horas correcto.</p>
            `,
            expectedOutput: "Hora (HH:MM): 14:30\nES P.M",
            help: {
                title: "Convertidor AM/PM",
                concept: "Para manejar tiempos, primero debemos separar los componentes de la cadena de texto usando .split().",
                steps: [
                    "Solicita la hora con input().",
                    "Usa variable.split(':') para obtener las horas y los minutos por separado.",
                    "Convierte la parte de las horas a entero (int).",
                    "Usa un condicional if: si la hora es >= 12 es 'PM', de lo contrario es 'AM'."
                ],
                tip: "Recuerda que 12:00 ya es considerado PM."
            },

            points: 20
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Supermercado Descuento</h4>
                <p class="text-gray-300 mb-2">Calcula el total a pagar por "Galletas Oreo" (precio $0.90).</p>
                <ul class="list-disc list-inside text-gray-400 mb-2 text-sm">
                    <li>Si compra &lt; 36: 10% descuento.</li>
                    <li>Si compra &gt;= 36: 15% descuento y 1 obsequio por cada docena.</li>
                </ul>
                <p class="text-gray-300 text-sm">Entrada: 40 unidades.</p>
                <p class="text-gray-300">Imprime: <code class="text-neon-green">"Total: 30.60"</code> y <code class="text-neon-green">"Obsequio 3 productos"</code></p>
                <p class="text-xs text-gray-500">Prompt: <code class="text-neon-green">"Cantidad: "</code></p>
            `,
            expectedOutput: "Cantidad: 40\nTotal: 30.60\nObsequio 3 productos",
            help: {
                title: "Logística de Supermercado",
                concept: "Este ejercicio combina cálculos matemáticos con condiciones múltiples y división entera.",
                steps: [
                    "Define el precio unitario como 0.90.",
                    "Pide la cantidad al usuario.",
                    "Si la cantidad es < 36, aplica 10% de descuento (total * 0.9).",
                    "Si es >= 36, aplica 15% (total * 0.85) y calcula los obsequios dividiendo la cantidad entre 12 usando //."
                ],
                tip: "Usa f-strings para formatear el total con dos decimales: f'{total:.2f}'"
            },

            points: 30
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Juego del Penalti (Determinístico)</h4>
                <p class="text-gray-300 mb-2">Simula un tiro penal donde el usuario elige una zona del 1 al 6.</p>
                <p class="text-gray-300 mb-2"><strong>Lógica del juego:</strong></p>
                <ul class="list-disc list-inside text-gray-400 mb-2 text-sm">
                    <li>Zonas 1, 2, 3: Lado <b>Izquierda</b></li>
                    <li>Zonas 4, 5, 6: Lado <b>Derecha</b></li>
                </ul>
                <p class="text-gray-300 mb-2">Usa <code class="text-neon-green">import random</code> y <code class="text-neon-green">random.seed(42)</code>. El portero elige una zona con <code class="text-neon-green">random.randint(1,6)</code>.</p>
                <p class="text-gray-300 mb-2">Si las zonas coinciden: "NO ES GOL". Si son distintas: "ES GOL".</p>
                <p class="text-gray-300 mb-4">Independientemente del resultado, imprime hacia qué lado se lanzó el portero (basado en su zona).</p>
                <p class="text-gray-400 text-sm">Prompt: <code class="text-neon-green">"Zona: "</code>. Prueba con Zona 1. El portero elegirá zona 6 con seed(42).</p>
            `,
            expectedOutput: "Zona: 1\nEL PORTERO SE LANZO A 6\nES GOL\nPor derecha",
            help: {
                title: "Simulador de Penalti",
                concept: "Este ejercicio enseña a usar el azar controlado (seeds) y la toma de decisiones basada en datos generados por la computadora.",
                steps: [
                    "Importa 'random' y establece la semilla 42 al inicio.",
                    "Usa randint(1, 6) para decidir la zona del portero.",
                    "Compara tu zona con la del portero: si son iguales 'NO ES GOL', si son distintas 'ES GOL'.",
                    "Para el lado: si la zona del portero está entre 1 y 3 imprime 'Por izquierda', si está entre 4 y 6 imprime 'Por derecha'."
                ],
                tip: "Imprime la zona del portero exactamente como dice el ejemplo para que el test pase: 'EL PORTERO SE LANZO A X'"
            },

            points: 25
        },
        {
            id: 4,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">4. Rangos Pares</h4>
                <p class="text-gray-300 mb-2">Imprime los números pares del 0 al 10 (inclusive) usando <code class="text-neon-green">range()</code>.</p>
                <p class="text-gray-300">Uno debajo de otro.</p>
            `,
            expectedOutput: "0\n2\n4\n6\n8\n10",

            points: 25
        }
    ]
};
