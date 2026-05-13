window.evaluations[5] = {
    id: 6,
    title: "Listas Paralelas (Supermercado)",
    difficulty: "intermedio",
    icon: "fa-shopping-cart",
    description: "Proyecto de Ayudantía 4: Gestión de ventas con listas paralelas.",
    timeLimit: 30,
    questions: [
        {
            id: 1,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">1. Buscar Índice de Producto</h4>
                <p class="text-gray-300 mb-2">Dada la lista: <code class="text-neon-green">productos = ["Arroz", "Leche", "Pan"]</code>.</p>
                <p class="text-gray-300 mb-2">Pide al usuario un producto (prompt: <code class="text-neon-green">"Producto: "</code>).</p>
                <p class="text-gray-300 mb-4">Usa <code class="text-neon-green">.index()</code> para encontrar su posición. Si no existe, captura el error (try/except) o verifica con <code class="text-neon-green">in</code>.</p>
                <p class="text-gray-300">Imprime el índice. Prueba con "Leche".</p>
            `,
            expectedOutput: "Producto: Leche\n1",
            help: {
                title: "Búsqueda en Listas",
                concept: "Para encontrar la posición de un elemento en una lista, usamos el método .index().",
                steps: [
                    "Define la lista de productos.",
                    "Pide el nombre del producto con input().",
                    "Usa un bloque try/except o un if 'item' in lista para evitar errores si el producto no existe.",
                    "Usa productos.index(nombre) para obtener el índice.",
                    "Imprime el índice resultante."
                ],
                tip: "Si usas .index() con un elemento que no está en la lista, Python lanzará un ValueError. ¡Valida siempre antes!"
            },

            points: 20
        },
        {
            id: 2,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">2. Validar Stock</h4>
                <p class="text-gray-300 mb-2">Define <code class="text-neon-green">validarStock(prod, cant, stocks, prods)</code>.</p>
                <p class="text-gray-300 mb-2">Retorna <code class="text-neon-green">True</code> si el stock en el índice del producto es >= cantidad.</p>
                <p class="text-xs text-gray-500">Datos: prods=["A", "B"], stocks=[10, 5].</p>
                <p class="text-gray-300">Prueba: validarStock("B", 3, stocks, prods) -> True. validarStock("B", 6...) -> False.</p>
                <p class="text-gray-300">Imprime el resultado de probar con "B" y 3.</p>
            `,
            expectedOutput: "True",
            help: {
                title: "Validación entre Listas",
                concept: "Las listas paralelas guardan información relacionada en los mismos índices de diferentes listas.",
                steps: [
                    "Define la función con los 4 parámetros.",
                    "Obtén el índice del producto 'prod' usando prods.index(prod).",
                    "Usa ese índice para consultar el valor en la lista 'stocks'.",
                    "Compara si el stock es mayor o igual a 'cant'.",
                    "Retorna el valor booleano resultante."
                ],
                tip: "Asegúrate de que las listas tengan la misma longitud para evitar errores de índice."
            },

            points: 25
        },
        {
            id: 3,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">3. Proceso de Compra</h4>
                <p class="text-gray-300 mb-2">Listas: <code class="text-neon-green">prod=["A"], stock=[10], precio=[2.0]</code>.</p>
                <p class="text-gray-300 mb-2">Simula una compra: Pide producto ("A") y cantidad (2). Actualiza el stock (resta).</p>
                <p class="text-gray-300">Imprime el stock restante.</p>
                <p class="text-xs text-gray-500">Prompt: "Prod: ", "Cant: ".</p>
            `,
            expectedOutput: "Prod: A\nCant: 2\n[8]",
            help: {
                title: "Actualización de Inventario",
                concept: "Modificar elementos de una lista requiere identificar su posición exacta.",
                steps: [
                    "Pide el producto y la cantidad (convertida a entero).",
                    "Encuentra el índice del producto en la lista 'prod'.",
                    "Resta la cantidad al valor que se encuentra en ese mismo índice en la lista 'stock'.",
                    "Imprime la lista 'stock' completa para ver el cambio."
                ],
                tip: "lista[indice] -= valor es la forma corta de actualizar una resta."
            },

            points: 25
        },
        {
            id: 4,
            type: "code",
            question: `
                <h4 class="font-bold text-white mb-4">4. Calcular Factura</h4>
                <p class="text-gray-300 mb-2">Tienes una lista de compras (cantidades): <code class="text-neon-green">compras = [2, 0, 1]</code> (paralela a productos).</p>
                <p class="text-gray-300 mb-2">Precios: <code class="text-neon-green">precios = [2.5, 1.0, 5.0]</code>. Impuestos booleanos: <code class="text-neon-green">iva = [True, False, True]</code> (True=12%, False=0%).</p>
                <p class="text-gray-300 mb-4">Calcula el Total a Pagar con impuestos.</p>
                <p class="text-gray-300">Imprime el total redondeado a 2 decimales. (2*2.5*1.12 + 1*5.0*1.12 = 5.6 + 5.6 = 11.2).</p>
            `,
            expectedOutput: "11.20",
            help: {
                title: "Cálculo de Factura",
                concept: "Calcular un total acumulado requiere recorrer varias listas paralelas simultáneamente.",
                steps: [
                    "Crea una variable total = 0.",
                    "Usa un for con range(len(compras)) para recorrer por índice.",
                    "En cada iteración, multiplica cantidad * precio.",
                    "Usa el valor booleano en 'iva' para decidir si multiplicas por 1.12 o no.",
                    "Suma el subtotal al total.",
                    "Al final, imprime el total con print(f'{total:.2f}')."
                ],
                tip: "Usa round(total, 2) o f-strings para asegurar que solo aparezcan 2 decimales."
            },

            points: 30
        }
    ]
};
