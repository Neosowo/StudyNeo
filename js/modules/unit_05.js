window.modules.push({
    id: 5,
    title: "Repeticiones (Bucles)",
    icon: "fa-sync",
    description: "Haz que tu código trabaje por ti repitiendo tareas.",
    intro: `
        <div class="neon-box p-8 mb-8 text-center">
            <h3 class="text-3xl font-bold mb-6 text-white text-center">El Poder de la Repetición</h3>
            <p class="text-gray-300 mb-8 text-lg text-center">
                Imagina tener que escribir "Hola" 1000 veces.
                Las computadoras son expertas en repetir tareas aburridas sin cansarse ni quejarse.
            </p>
            <div class="flex flex-col md:flex-row gap-6 justify-center items-center">
                <div class="neon-box-dark p-6 w-full md:w-1/2">
                    <h4 class="text-red-400 font-bold mb-2">Manualmente</h4>
                    <code class="text-xs block text-gray-500">
                        print("Hola")<br>
                        print("Hola")<br>
                        print("Hola")<br>
                        ... (x1000)
                    </code>
                </div>
                <div class="text-2xl text-white">VS</div>
                <div class="neon-box-dark p-6 w-full md:w-1/2 border border-neon-green">
                    <h4 class="text-neon-green font-bold mb-2">Con Bucle</h4>
                    <code class="text-sm block text-white">
                        for i in range(1000):<br>
                        &nbsp;&nbsp;print("Hola")
                    </code>
                </div>
            </div>
        </div>
    `,
    lessons: [
        {
            title: "Bucle While (Mientras)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Bucles Condicionales</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        El bucle <code>while</code> permite repetir un bloque de código <strong>mientras</strong> una condición sea verdadera. Es extremadamente útil para procesos donde no sabemos de antemano cuántas repeticiones serán necesarias.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Funcionamiento</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Se evalúa la condición. Si es True, el código corre. Al terminar, vuelve arriba a evaluar de nuevo.
                            </p>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-red-500">
                            <h4 class="text-xl font-bold text-white mb-3">⚠️ Bucle Infinito</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Si la condición nunca se vuelve falsa, el programa se quedará repitiendo para siempre.
                            </p>
                        </div>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo Paso a Paso</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Primero creas la variable, luego el bucle, y <b>siempre</b> incrementas al final:
                        </p>
                        <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                            i = 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# 1. Inicio<br>
                            while i <= 5: # 2. Condición<br>
                            &nbsp;&nbsp;print(i)<br>
                            &nbsp;&nbsp;i += 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# 3. Paso (Incremento)
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Contando hasta 3</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Usa un bucle <code>while</code> para imprimir los números del 1 al 3. Recuerda incrementar la variable <code>num</code> en cada vuelta.
                    </p>
                    <textarea id="code-while-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="7">num = 1
# Escribe tu while aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-while-1').value, 'output-while-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Ejecutar Bucle
                    </button>
                </div>
                <div id="output-while-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Repitiendo proceso...</p>
                </div>
            `,
            validation: {
                expectedOutput: "1\n2\n3",
                matchType: "include",
                hint: "Usa while num <= 3: y no olvides hacer num = num + 1 al final del bloque."
            }
        },
        {
            title: "Bucle For (Para cada uno)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Iteraciones Controladas</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        El bucle <code>for</code> se usa para recorrer secuencias o ejecutar una tarea un número definido de veces. En Python es la forma más común y segura de iterar.
                    </p>
                    
                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo de Acceso</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Si <code>m = [[1, 2], [3, 4]]</code>, así es como obtienes cada dato:
                        </p>
                        <code class="text-xs text-neon-green block bg-black/40 p-3 rounded">
                            m = [[1, 2], [3, 4]]<br><br>
                            print(m[0][0]) # Fila 0, Columna 0 -> 1<br>
                            print(m[1][1]) # Fila 1, Columna 1 -> 4
                        </code>
                    </div>

                    <div class="bg-black/30 p-4 rounded border border-gray-700 mb-8">
                        <h5 class="text-white font-bold text-sm mb-2">La Función range()</h5>
                        <p class="text-sm text-gray-400 mb-2">Genera una secuencia de números automáticamente:</p>
                        <ul class="text-xs text-gray-500 space-y-1 ml-4 list-disc">
                            <li><code>range(5)</code> → 0, 1, 2, 3, 4</li>
                            <li><code>range(1, 4)</code> → 1, 2, 3</li>
                        </ul>
                    </div>

                    <div class="neon-box-secondary p-6 border-l-2 border-blue-500">
                        <h4 class="text-lg font-bold text-white mb-2">Simplicidad</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            A diferencia de <code>while</code>, un <code>for</code> con <code>range</code> sabe exactamente cuándo detenerse.
                        </p>
                        <code class="text-xs text-blue-400 block bg-black/40 p-2 rounded">
                            for x in range(3):<br>
                            &nbsp;&nbsp;print("Hacker")
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Repetición de Texto</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Usa un bucle <code>for</code> con <code>range</code> para imprimir la palabra "Python" exactamente 4 veces.
                    </p>
                    <textarea id="code-for-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5"># Tu código aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-for-1').value, 'output-for-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Ejecutar For
                    </button>
                </div>
                <div id="output-for-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Procesando rango...</p>
                </div>
            `,
            validation: {
                expectedOutput: "Python\nPython\nPython\nPython",
                matchType: "exact",
                hint: "Usa for i in range(4): y dentro print(\"Python\")"
            }
        },
        {
            title: "For con Listas",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Recorriendo Datos</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        El verdadero poder de Python brilla al iterar sobre colecciones. Un bucle <code>for</code> puede extraer cada elemento de una lista de forma automática.
                    </p>
                    
                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Ejemplo Completo</h4>
                        <p class="text-gray-300 text-sm mb-4">
                            Imagina que cada "fruta" de la lista se guarda un momento en la variable para mostrarla:
                        </p>
                        <code class="text-xs text-blue-400 block bg-black/40 p-3 rounded">
                            lista = ["🍎", "🍌", "🍇"]<br><br>
                            for fruta in lista:<br>
                            &nbsp;&nbsp;print("Viendo una:")<br>
                            &nbsp;&nbsp;print(fruta)
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Listado Dinámico</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Recorre la lista <code>nombres</code> e imprime cada uno precedido por un asterisco y un espacio (ej: "* Ana").
                    </p>
                    <textarea id="code-for-list" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="6">nombres = ["Ana", "Luis", "Neo"]
# Recorre e imprime aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-for-list').value, 'output-for-list')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Recorrer Lista
                    </button>
                </div>
                <div id="output-for-list" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Extrayendo elementos...</p>
                </div>
            `,
            validation: {
                expectedOutput: "* Ana\n* Luis\n* Neo",
                matchType: "exact",
                hint: "Usa for n in nombres: y dentro print(\"* \" + n)"
            }
        },
        {
            title: "Escape de Bucles (Break)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Control Total</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        A veces necesitas detener un bucle antes de que termine normalmente. Para eso usamos <code>break</code>. Es como el freno de emergencia.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-red-500">
                            <h4 class="text-xl font-bold text-white mb-3">break</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Detiene el bucle por completo y sale de él inmediatamente.
                            </p>
                            <code class="text-xs text-red-400 block bg-black/40 p-2 rounded">
                                if item == "Bomba":<br>
                                &nbsp;&nbsp;break
                            </code>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">continue</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Salta el paso actual y pasa al siguiente ciclo del bucle.
                            </p>
                            <code class="text-xs text-blue-400 block bg-black/40 p-2 rounded">
                                if item == "Sal":<br>
                                &nbsp;&nbsp;continue
                            </code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        Usa un bucle <code>for</code> en el rango de 1 a 10. Si el número es 5, usa <code>break</code> para detenerlo. Imprime cada número.
                    </p>
                    <textarea id="code-loop-break" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="7"># Crea el bucle aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-loop-break').value, 'output-loop-break')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Escape
                    </button>
                </div>
                <div id="output-loop-break" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Buscando el punto de corte...</p>
                </div>
            `,
            validation: {
                expectedOutput: "1\n2\n3\n4",
                matchType: "include",
                requiredCode: "break",
                hint: "Usa for i in range(1, 11): y dentro un if i == 5: break"
            }
        }
    ]
});
