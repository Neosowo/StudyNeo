window.modules.push({
    id: 11,
    title: "Tuplas y Conjuntos",
    icon: "fa-lock",
    description: "Datos inmutables y colecciones únicas.",
    intro: `
        <div class="neon-box p-8 mb-8 text-center">
            <h3 class="text-3xl font-bold mb-6 text-white text-center">Colecciones Especiales</h3>
            <p class="text-gray-300 mb-8 text-lg text-center">
                A veces necesitamos datos que no cambien nunca (Tuplas) o grupos donde nada pueda repetirse (Conjuntos).
            </p>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                    <h4 class="text-white font-bold mb-2">Tuplas ( )</h4>
                    <p class="text-sm text-gray-400">Son constantes. Una vez creadas, no se pueden modificar. Ideales para coordenadas o fechas.</p>
                </div>
                <div class="neon-box-dark p-6 border-l-2 border-yellow-500">
                    <h4 class="text-white font-bold mb-2">Sets { }</h4>
                    <p class="text-sm text-gray-400">Colecciones de elementos únicos. Python borra automáticamente los duplicados.</p>
                </div>
            </div>
        </div>
    `,
    lessons: [
        {
            title: "Tuplas (Inmutables)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Seguridad de Datos</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Las tuplas se definen con paréntesis <code>( )</code>. A diferencia de las listas, no puedes usar <code>append</code> ni cambiar sus valores. Esto las hace más rápidas y seguras.
                    </p>
                    
                    <div class="bg-black/30 p-4 rounded border border-gray-700 mb-8">
                        <h5 class="text-white font-bold text-sm mb-2">¿Cuándo usarlas?</h5>
                        <p class="text-sm text-gray-400">Datos que deben permanecer fijos durante todo el programa (ej: los meses del año o la ubicación de una oficina).</p>
                    </div>

                    <div class="neon-box-secondary p-6">
                        <h4 class="font-bold text-white mb-2">Sintaxis</h4>
                        <p class="text-sm text-gray-300 mb-4">Usa paréntesis para fijar los datos:</p>
                        <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">
                            meses = ("Enero", "Febrero")<br>
                            # meses[0] = "Marzo" # ERROR: No se puede cambiar
                        </code>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Constantes Geográficas</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Crea una tupla llamada <code>posicion</code> que contenga los números 50 y 100. Imprime el tipo de dato usando <code>print(type(posicion))</code>.
                    </p>
                    <textarea id="code-tup-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5"># Crea tu tupla aquí:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-tup-1').value, 'output-tup-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Tupla
                    </button>
                </div>
                <div id="output-tup-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Analizando estructura constante...</p>
                </div>
            `,
            validation: {
                expectedOutput: "<class 'tuple'>",
                matchType: "include",
                hint: "Usa posicion = (50, 100) y luego print(type(posicion))."
            }
        },
        {
            title: "Sets (Valores Únicos)",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Conjuntos Sin Duplicados</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Los <strong>sets</strong> se definen con llaves <code>{ }</code> (como los diccionarios, pero sin parejas clave-valor). Su característica principal es que no admiten elementos repetidos.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-yellow-500">
                            <h4 class="text-xl font-bold text-white mb-3">Limpieza Automática</h4>
                            <p class="text-gray-400 text-sm mb-4">
                                Si intentas meter dos veces el mismo elemento, el set lo ignorará silenciosamente.
                            </p>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">Sintaxis</h4>
                            <p class="text-gray-400 text-sm mb-4">Usa llaves sin claves:</p>
                            <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">
                                tags = {"python", "code"}<br>
                                tags.add("python") # No pasa nada
                            </code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <span class="text-sm text-gray-400">Eliminando Duplicados</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Crea un conjunto llamado <code>id_usuarios</code> que contenga los números: 1, 2, 2, 3. Imprime el conjunto y observa qué sucede con el número repetido.
                    </p>
                    <textarea id="code-set-1" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="5"># Crea tu set aquí:

</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-set-1').value, 'output-set-1')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Verificar Set
                    </button>
                </div>
                <div id="output-set-1" class="code-output p-4 text-sm">
                    <p class="text-gray-500">Filtrando duplicados...</p>
                </div>
            `,
            validation: {
                expectedOutput: "{1, 2, 3}",
                matchType: "include",
                requiredCode: "{",
                hint: "Usa id_usuarios = {1, 2, 2, 3} y luego print(id_usuarios)."
            }
        },
        {
            title: "Operaciones de Conjuntos",
            content: `
                <h3 class="text-3xl font-bold mb-6 text-white">Lógica de Conjuntos</h3>
                
                <div class="neon-box p-8 mb-8">
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Los sets brillan cuando queremos comparar grupos de datos. Python nos permite hacer uniones e intersecciones de forma matemática.
                    </p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="neon-box-dark p-6 border-l-2 border-neon-green">
                            <h4 class="text-xl font-bold text-white mb-3">Unión (|)</h4>
                            <p class="text-gray-400 text-sm mb-4">Combina todos los elementos (sin repetir).</p>
                            <code class="text-xs text-neon-green block bg-black/40 p-2 rounded">set_a | set_b</code>
                        </div>
                        
                        <div class="neon-box-dark p-6 border-l-2 border-blue-500">
                            <h4 class="text-xl font-bold text-white mb-3">Intersección (&)</h4>
                            <p class="text-gray-400 text-sm mb-4">Solo los elementos que están en AMBOS.</p>
                            <code class="text-xs text-blue-400 block bg-black/40 p-2 rounded">set_a & set_b</code>
                        </div>
                    </div>
                </div>

                <div class="code-editor p-6 mb-4">
                    <p class="text-gray-300 text-sm mb-4">
                        Dados los sets <code>grupo_a = {1, 2, 3}</code> y <code>grupo_b = {3, 4, 5}</code>, imprime la <b>intersección</b> (el elemento que comparten).
                    </p>
                    <textarea id="code-set-ops" class="w-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none" rows="8">grupo_a = {1, 2, 3}
grupo_b = {3, 4, 5}

# Imprime la intersección aquí:
</textarea>
                    <button onclick="runPythonCode(document.getElementById('code-set-ops').value, 'output-set-ops')" class="btn-neon px-6 py-2 rounded-lg font-semibold text-white mt-4">
                        <i class="fas fa-play mr-2"></i>Calcular Unión
                    </button>
                </div>
                <div id="output-set-ops" class="code-output p-4 text-sm mt-4">
                    <p class="text-gray-500">Comparando conjuntos...</p>
                </div>
            `,
            validation: {
                expectedOutput: "{3}",
                matchType: "include",
                requiredCode: "&",
                hint: "Usa print(grupo_a & grupo_b)"
            }
        }
    ]
});
