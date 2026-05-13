
const CONFIG = {
    SUCCESS_IMAGE: "https://i.postimg.cc/59m1Nk0S/feli.gif",
    SUCCESS_TITLE: "¡Misión Cumplida!",
    CONFETTI_DURATION: 3000
};

let currentModule = null;
let currentLesson = 0;
let progress = JSON.parse(localStorage.getItem('PyNeo-progress')) || {};
let lessonProgress = JSON.parse(localStorage.getItem('PyNeo-lesson-progress')) || {};

const PYTHON_FS_POLYFILL = `
class _VirtualFile:
    def __init__(self, name, mode):
        self.name = name
        self.mode = mode
        self.content = ""
        self.closed = False
        if name == "test.txt" and "r" in mode:
            self.content = "Hecho"
    def __enter__(self): return self
    def __exit__(self, type, value, traceback): self.close()
    def write(self, data):
        if self.closed: raise ValueError("I/O operation on closed file")
        self.content += str(data)
    def read(self):
        if self.closed: raise ValueError("I/O operation on closed file")
        return self.content
    def close(self): self.closed = True
def open(name, mode="r"): return _VirtualFile(name, mode)
`;

const PANDAS_POLYFILL = `
class Series:
    def __init__(self, data, name=None, index=None):
        self._data = []
        for item in data:
            self._data.append(item)
        self.name = name
        self._is_s = True
        if index is not None:
            self.index = index
        else:
            self.index = list(range(len(self._data)))
    def __len__(self): return len(self._data)
    def __getitem__(self, key):
        if isinstance(key, list):
            return Series([self._data[i] for i, v in enumerate(key) if v], name=self.name)
        return self._data[key]
    def sum(self): return sum(self._data)
    def max(self):
        nums = []
        for x in self._data:
            try: nums.append(float(str(x)))
            except: pass
        return max(nums) if nums else None
    def min(self):
        nums = []
        for x in self._data:
            try: nums.append(float(str(x)))
            except: pass
        return min(nums) if nums else None
    def mean(self):
        n = len(self._data)
        return sum(self._data) / n if n > 0 else 0
    def std(self):
        n = len(self._data)
        if n < 2: return 0
        m = self.mean()
        var = sum([(x - m) ** 2 for x in self._data]) / (n - 1)
        return var ** 0.5
    def _to_num(self, x):
        try: return float(str(x))
        except: return x
    def __lt__(self, other):
        o = self._to_num(other)
        res = []
        for x in self._data:
            try: res.append(1 if self._to_num(x) < o else 0)
            except: res.append(0)
        return Series(res)
    def __gt__(self, other):
        o = self._to_num(other)
        res = []
        for x in self._data:
            try: res.append(1 if self._to_num(x) > o else 0)
            except: res.append(0)
        return Series(res)
    def __le__(self, other):
        o = self._to_num(other)
        res = []
        for x in self._data:
            try: res.append(1 if self._to_num(x) <= o else 0)
            except: res.append(0)
        return Series(res)
    def __ge__(self, other):
        o = self._to_num(other)
        res = []
        for x in self._data:
            try: res.append(1 if self._to_num(x) >= o else 0)
            except: res.append(0)
        return Series(res)
    def __eq__(self, other):
        res = []
        for x in self._data:
            try: res.append(1 if str(x) == str(other) else 0)
            except: res.append(0)
        return Series(res)
    def __ne__(self, other):
        res = []
        for x in self._data:
            try: res.append(1 if str(x) != str(other) else 0)
            except: res.append(0)
        return Series(res)
    def __repr__(self):
        lines = []
        for i, v in zip(self.index, self._data):
            lines.append(str(i) + "    " + str(v))
        return "\\n".join(lines)

class DataFrame:
    def __init__(self, data=None):
        self._cols = {}
        self._keys = []
        if data is not None:
            try:
                for k in data.keys():
                    self._keys.append(k)
                    vals = []
                    for v in data[k]:
                        vals.append(v)
                    self._cols[k] = vals
            except: pass
        first_col = self._cols[self._keys[0]] if self._keys else []
        self.shape = (len(first_col), len(self._keys))
    def __getitem__(self, key):
        if isinstance(key, str):
            return Series(self._cols[key], name=key)
        is_m = False
        try: is_m = key._is_s
        except: pass
        if not is_m:
            is_m = isinstance(key, list)
        if is_m:
            if isinstance(key, list) and len(key) > 0 and isinstance(key[0], str):
                result = DataFrame()
                for k in key:
                    result._cols[k] = self._cols[k]
                    result._keys.append(k)
                if result._keys:
                    result.shape = (len(result._cols[result._keys[0]]), len(result._keys))
                return result
            mask = key._data if hasattr(key, '_data') else key
            result = DataFrame()
            for k in self._keys:
                col = self._cols[k]
                filtered = []
                for i in range(len(mask)):
                    if mask[i]:
                        filtered.append(col[i])
                result._cols[k] = filtered
                result._keys.append(k)
            if result._keys:
                result.shape = (len(result._cols[result._keys[0]]), len(result._keys))
            return result
        return DataFrame()
    def groupby(self, by): return _GB(self, by)
    def describe(self):
        res = {"": ["count", "mean", "std", "min", "max"]}
        for c in self._keys:
            v = self._cols[c]
            if not v: continue
            is_n = True
            for x in v:
                try: float(str(x))
                except: is_n = False; break
            if is_n:
                nums = [float(str(x)) for x in v]
                s = Series(nums)
                res[c] = [float(len(nums)), s.mean(), s.std(), min(nums), max(nums)]
        return DataFrame(res)
    def __repr__(self):
        if not self._keys: return "Empty DataFrame\\nColumns: []\\nIndex: []"
        n = self.shape[0]
        if n == 0:
            return "Empty DataFrame\\nColumns: [" + ", ".join(self._keys) + "]\\nIndex: []"
        head = "   " + "  ".join(self._keys)
        rows = [head]
        for i in range(n):
            r = str(i) + "  " + "  ".join([str(self._cols[c][i]) for c in self._keys])
            rows.append(r)
        return "\\n".join(rows)

class _GB:
    def __init__(self, df, by):
        self.df = df
        self.by = by
    def __getitem__(self, col): return _GBC(self.df, self.by, col)

class _GBC:
    def __init__(self, df, by, col):
        self.df, self.by, self.col = df, by, col
    def _groups(self):
        groups = {}
        for i, key in enumerate(self.df[self.by]._data):
            if key not in groups:
                groups[key] = []
            groups[key].append(self.df[self.col]._data[i])
        return groups
    def sum(self):
        groups = self._groups()
        return Series([sum(v) for v in groups.values()], index=list(groups.keys()))
    def mean(self):
        groups = self._groups()
        return Series([sum(v)/len(v) if len(v) > 0 else 0 for v in groups.values()], index=list(groups.keys()))
    def min(self):
        groups = self._groups()
        return Series([min(v) for v in groups.values()], index=list(groups.keys()))
    def max(self):
        groups = self._groups()
        return Series([max(v) for v in groups.values()], index=list(groups.keys()))
    def count(self):
        groups = self._groups()
        return Series([len(v) for v in groups.values()], index=list(groups.keys()))
`;

function runPythonCode(code, outputId) {
    let outputElement = document.getElementById(outputId) || document.querySelector('#lesson-content .code-output');
    if (!outputElement) return;

    let output = "";
    const terminalHeader = `
        <div class="flex items-center justify-between mb-3 border-b border-white/5 pb-2 -mx-2 px-2">
            <div class="flex items-center gap-2">
                <div class="flex gap-1.5 ml-1">
                    <div class="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                </div>
                <span class="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] ml-2 select-none">Python Console</span>
            </div>
            <div class="flex gap-2">
                <button onclick="copyOutput('${outputId}')" class="p-1.5 hover:bg-white/5 rounded text-gray-500 hover:text-white transition-colors"><i class="far fa-copy text-[10px]"></i></button>
                <button onclick="clearOutput('${outputId}')" class="p-1.5 hover:bg-red-500/10 rounded text-gray-500 hover:text-red-400 transition-colors"><i class="fas fa-trash-alt text-[10px]"></i></button>
            </div>
        </div>
    `;

    try {
        Sk.configure({
            output: (text) => { output += text; },
            read: (x) => {
                if (x === 'pandas' || x === 'pandas/__init__.py') return PANDAS_POLYFILL;
                if (Sk.builtinFiles && Sk.builtinFiles["files"][x]) return Sk.builtinFiles["files"][x];
                throw "Archivo no encontrado: " + x;
            },
            inputfun: (prompt) => customPrompt(prompt).then(val => { output += val + "\n"; return val; })
        });

        const PD_BRIDGE = "\nclass _PDB:\n    def DataFrame(self, d=None): return DataFrame(d)\n    def Series(self, d, name=None): return Series(d, name=name)\npd = _PDB()\n";
        let processedCode = code.replace(/import\s+pandas\s+as\s+pd/g, '# pandas activo');
        const finalPrefix = PYTHON_FS_POLYFILL + "\n" + PANDAS_POLYFILL + PD_BRIDGE;
        const offset = finalPrefix.split('\n').length;

        Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, finalPrefix + processedCode, true))
            .then(() => {
                outputElement.innerHTML = terminalHeader + `<pre class="text-blue-100 font-mono text-sm whitespace-pre-wrap">${output || "Programa finalizado sin salida."}</pre>`;
                checkLessonValidation(code, output, outputId);
            }, (err) => {
                let msg = err.toString().replace(/line (\d+)/g, (m, n) => parseInt(n) >= offset ? "line " + (parseInt(n) - offset + 1) : m);
                outputElement.innerHTML = terminalHeader + `<div class="bg-red-500/5 border-l-2 border-red-500 text-red-300 p-3 text-xs font-mono">${msg}</div>`;
            });
    } catch (e) {
        outputElement.innerHTML = `<p class="text-red-500">Error: ${e.message}</p>`;
    }
}

function checkLessonValidation(code, output, outputId) {
    if (!currentModule || currentLesson === null) return;
    const lesson = currentModule.lessons[currentLesson];
    if (!lesson || !lesson.validation) {
        enableNextBtn(true);
        return;
    }

    const rules = lesson.validation;
    let isValid = true;
    let hint = rules.hint || "Falta código o el resultado es incorrecto.";

    if (rules.requiredCode && !code.includes(rules.requiredCode)) isValid = false;
    if (rules.expectedOutput && !output.includes(rules.expectedOutput)) isValid = false;

    const el = document.getElementById(outputId);
    if (isValid) {
        el.innerHTML += `<div class="mt-4 p-2 bg-green-500/10 text-neon-green text-[10px] font-black uppercase text-center rounded"><i class="fas fa-check-circle mr-2"></i> Reto Superado</div>`;
        enableNextBtn(true);
    } else {
        el.innerHTML += `<div class="mt-4 p-2 bg-orange-500/5 text-orange-300 text-xs italic rounded">${hint}</div>`;
        enableNextBtn(false);
    }
}

function enableNextBtn(enable) {
    const btn = document.getElementById('next-lesson');
    if (!btn) return;
    if (enable) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.innerHTML = (currentLesson === currentModule.lessons.length - 1) ? 'FINALIZAR UNIDAD <i class="fas fa-trophy ml-2"></i>' : 'SIGUIENTE <i class="fas fa-chevron-right ml-2"></i>';
    } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.innerHTML = '<i class="fas fa-lock mr-2"></i>Repara el error';
    }
}

function init() {
    loadModules();
    updateOverallProgress();
}

function loadModules() {
    const grid = document.getElementById('modules-grid');
    if (!grid || typeof modules === 'undefined') return;
    grid.innerHTML = '';
    modules.forEach(m => {
        if (m.id === 0) return;
        const isComp = progress[m.id];
        const card = document.createElement('div');
        card.className = "module-card p-8 cursor-pointer reveal active";
        card.innerHTML = `
            <div class="flex items-start justify-between mb-6">
                <i class="fas ${m.icon} text-3xl text-neon-green"></i>
                ${isComp ? '<div class="badge-neon text-[10px] px-2 py-1 rounded">LISTO</div>' : ''}
            </div>
            <h3 class="text-xl font-bold mb-2 text-white">${m.title}</h3>
            <p class="text-gray-400 text-sm">${m.description}</p>
        `;
        card.onclick = () => openModule(m.id);
        grid.appendChild(card);
    });
}

function openModule(id) {
    currentModule = modules.find(m => m.id === id);
    currentLesson = lessonProgress[id] || (currentModule.intro ? -1 : 0);

    document.getElementById('modules-section').classList.add('hidden');
    document.getElementById('exercises-section').classList.add('hidden');
    document.getElementById('hero-section').classList.add('hidden');
    document.getElementById('module-content').classList.remove('hidden');

    const nav = document.getElementById('main-nav');
    if (nav) nav.style.display = 'none';

    loadLesson();
}

function closeModule() {
    document.getElementById('modules-section').classList.remove('hidden');
    document.getElementById('exercises-section').classList.remove('hidden');
    document.getElementById('hero-section').classList.remove('hidden');
    document.getElementById('module-content').classList.add('hidden');

    const nav = document.getElementById('main-nav');
    if (nav) nav.style.display = 'block';

    loadModules();
    updateOverallProgress();
}

function loadLesson() {
    lessonProgress[currentModule.id] = currentLesson;
    localStorage.setItem('PyNeo-lesson-progress', JSON.stringify(lessonProgress));

    const lesson = currentLesson === -1 ? { title: "Intro", content: currentModule.intro } : currentModule.lessons[currentLesson];
    document.getElementById('module-title').textContent = currentModule.title;
    document.getElementById('module-description').textContent = currentLesson === -1 ? "Introducción" : `Lección ${currentLesson + 1}: ${lesson.title}`;
    document.getElementById('lesson-content').innerHTML = lesson.content;

    const prevBtn = document.getElementById('prev-lesson');
    prevBtn.disabled = (currentLesson === -1 || (currentLesson === 0 && !currentModule.intro));
    enableNextBtn(!lesson.validation);
    window.scrollTo(0, 0);
}

function nextLesson() {
    if (typeof updateStreak === 'function') updateStreak();
    if (currentLesson < currentModule.lessons.length - 1) {
        currentLesson++; loadLesson();
    } else {
        progress[currentModule.id] = true;
        localStorage.setItem('PyNeo-progress', JSON.stringify(progress));
        closeModule();
    }
}

function previousLesson() {
    if (currentLesson > -1) { currentLesson--; loadLesson(); }
}


function updateOverallProgress() {
    const el = document.getElementById('overall-progress');
    if (el && modules) el.textContent = `${Math.round((Object.keys(progress).length / (modules.length - 1)) * 100)}%`;
}

function clearOutput(id) {
    const el = document.getElementById(id);
    if (el) {
        initTerminal(id);
    }
}

function initTerminal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const header = `
        <div class="flex items-center justify-between mb-3 border-b border-white/5 pb-2 -mx-2 px-2">
            <div class="flex items-center gap-2">
                <div class="flex gap-1.5 ml-1">
                    <div class="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                </div>
                <span class="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] ml-2 select-none">Python Console</span>
            </div>
        </div>
    `;
    el.innerHTML = header + '<p class="text-gray-700 italic text-xs font-mono py-2 opacity-30 select-none"><i class="fas fa-terminal mr-2"></i>Consola lista...</p>';
}

function copyOutput(id) {
    const el = document.getElementById(id);
    if (el) {
        const txt = el.innerText.replace('Python Console', '').trim();
        navigator.clipboard.writeText(txt);
        showNotification('Copiado al portapapeles', 'success');
    }
}

const SECRET_SALT = "PyNeo_Secure_System_2026_NoCheating";

function toggleDataMenu(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('data-menu');
    if (menu) menu.classList.toggle('hidden');
}

async function generateSignature(data) {
    const { signature, ...dataToSign } = data;
    const jsonString = JSON.stringify(dataToSign);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(jsonString + SECRET_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function exportProgress() {
    const data = {
        progress: JSON.parse(localStorage.getItem('PyNeo-progress') || '{}'),
        lessonProgress: JSON.parse(localStorage.getItem('PyNeo-lesson-progress') || '{}'),
        timestamp: new Date().toISOString()
    };
    data.signature = await generateSignature(data);
    const obfuscated = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    const blob = new Blob([`PYNEO_SECURE_DATA::${obfuscated}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pyneo_progreso_${new Date().toLocaleDateString().replace(/\//g, '-')}.pyn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importProgressTrigger() {
    const input = document.getElementById('import-progress-file');
    if (input) input.click();
}

function showNotification(message, type = 'info') {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-24 right-6 z-[200] flex flex-col items-end pointer-events-none gap-3';
        document.body.appendChild(container);
    }
    const notif = document.createElement('div');
    const color = type === 'success' ? 'border-neon-green/50' : (type === 'error' ? 'border-red-500/50' : 'border-blue-500/50');
    notif.className = `p-4 rounded-xl border ${color} bg-black/90 backdrop-blur-xl flex items-center gap-3 min-w-[280px] pointer-events-auto animate-fade-in`;
    notif.innerHTML = `<div class="flex-1"><p class="text-xs font-medium text-white">${message}</p></div>`;
    container.appendChild(notif);
    setTimeout(() => { notif.style.opacity = '0'; setTimeout(() => notif.remove(), 300); }, 3000);
}

function customPrompt(msg) {
    return new Promise(resolve => {
        const val = prompt(msg || "Entrada de Python:");
        resolve(val || "");
    });
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    const importInput = document.getElementById('import-progress-file');
    if (importInput) {
        importInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target.result;
                if (content.startsWith('PYNEO_SECURE_DATA::')) {
                    const data = JSON.parse(decodeURIComponent(escape(atob(content.split('::')[1]))));
                    if (await generateSignature(data) === data.signature) {
                        localStorage.setItem('PyNeo-progress', JSON.stringify(data.progress));
                        localStorage.setItem('PyNeo-lesson-progress', JSON.stringify(data.lessonProgress));
                        showNotification('Progreso importado con éxito', 'success');
                        setTimeout(() => location.reload(), 1000);
                    } else {
                        showNotification('Firma inválida: archivo corrupto', 'error');
                    }
                }
            };
            reader.readAsText(file);
        });
    }
});

document.addEventListener('click', () => {
    const menu = document.getElementById('data-menu');
    if (menu) menu.classList.add('hidden');
});
