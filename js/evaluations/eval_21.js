window.evaluations[20] = {
    id: 21,
    title: "Economía y Finanzas (Bonus)",
    difficulty: "principiante",
    icon: "fa-coins",
    description: "Evaluación Bonus (FP2021-1): Cálculos financieros, conversión de divisas e interés compuesto.",
    timeLimit: 25,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Conversor Euro-Dólar</h4>
                <p class="text-gray-300 mb-2">Solicita una cantidad en Euros (float).</p>
                <p class="text-gray-300 mb-2">Tasa de cambio: 1 Euro = 1.13 Dólares (o usa tasa inversa: Dolar = Euro / 0.885).</p>
                <p class="text-gray-300 mb-4 font-bold">Usa la fórmula: <code class="text-neon-green">dolares = euros / 0.885</code>.</p>
                <p class="text-gray-300">Imprime: <code class="text-neon-green">"X euros son Y dolares"</code> (redondeado a 2 decimales).</p>
                <p class="text-xs text-gray-500">Prompt: "Euros: ". Prueba con 100.</p>
            `,
            expectedOutput: "Euros: 100\n100.00 euros son 112.99 dolares",
            help: {
                title: "Conversión de Monedas Básica",
                concept: "Para transformar una moneda a otra, multiplicamos o dividimos por el factor de conversión proporcionado.",
                steps: [
                    "Pide al usuario la cantidad en euros y conviértela a float: euros = float(input('Euros: ')).",
                    "Aplica la fórmula: dolares = euros / 0.885.",
                    "Imprime el resultado usando un f-string para limitar los decimales.",
                    "Ejemplo: print(f'{euros:.2f} euros son {dolares:.2f} dolares')."
                ],
                tip: "Asegúrate de que el input() coincida exactamente con lo esperado ('Euros: ')."
            },

            points: 30
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Interés Compuesto</h4>
                <p class="text-gray-300 mb-2">Calcula el capital final.</p>
                <p class="text-gray-300 mb-2">Entradas: Inversión (P), Tasa Interés % (r), Años (t).</p>
                <p class="text-gray-400 text-sm mb-4">Fórmula: <code class="text-neon-green">CF = P * (1 + r/100) ** t</code>.</p>
                <p class="text-gray-300">Entrada prueba: P=1000, r=5, t=10. Imprime "Capital Final: X".</p>
            `,
            expectedOutput: "Capital Final: 1628.894626777442",
            help: {
                title: "Exponenciación en Finanzas",
                concept: "Las fórmulas financieras suelen utilizar potencias para el interés compuesto a lo largo del tiempo.",
                steps: [
                    "Define las variables P = 1000, r = 5, y t = 10.",
                    "Usa el operador lógico de potencia (**) de Python.",
                    "Calcula: CF = P * ((1 + (r / 100)) ** t).",
                    "Imprime la cadena concatenando o con un string formateado: f'Capital Final: {CF}'."
                ],
                tip: "En este caso, la plataforma espera el número con muchos decimales, así que no uses ningún redondeo."
            },

            points: 35
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Cambio de Compra</h4>
                <p class="text-gray-300 mb-2">Cliente paga con 40 dolares. Producto cuesta 41.27 euros.</p>
                <p class="text-gray-300 mb-2">Tasa: 1 Dolar = 0.72 Euros ? No, el ejercicio dice: <code class="text-neon-green">tasaCambio = 0.72</code> (Euro/Dolar? No especifica, pero logicamente convertimos producto a dolares).</p>
                <p class="text-gray-300 mb-4">Convierte precio producto a dolares: <code class="text-neon-green">precio_dolar = precio_euro * tasa</code> (o diviendo? El ejercicio original multiplica: <code class="text-neon-green">valorProductoDC * tasaCambio</code>). Hazlo igual.</p>
                <p class="text-gray-300">Calcula el cambio: <code class="text-neon-green">pago - costo_convertido</code>. Imprime con 2 decimales.</p>
                <p class="text-xs text-gray-500">40 - (41.27 * 0.72) = 40 - 29.7144 = 10.28.</p>
            `,
            expectedOutput: "10.29",
            help: {
                title: "Conversiones y Diferencias",
                concept: "Es importante mantener las operaciones matemáticas en la misma moneda antes de calcular diferencias.",
                steps: [
                    "Define las variables iniciales: pago = 40, precio_euro = 41.27, tasa_cambio = 0.72.",
                    "Convierte el producto a la unidad del pago aplicando la tasa al precio europeo.",
                    "costo_convertido = precio_euro * tasa_cambio.",
                    "Aplica la diferencia: vuelto = pago - costo_convertido.",
                    "Imprime el vuelto y asegúrate de limitarlo a 2 decimales para que concuerde (10.29)."
                ],
                tip: "Puedes usar la función interna round(var, 2) o un f-string: '{vuelto:.2f}' para los dos decimales."
            },

            points: 35
        }
    ]
};
