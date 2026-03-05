/**
 * sanitize.js
 * Utilidad de seguridad nativa para limpiar HTML y prevenir ataques XSS.
 * No requiere dependencias externas.
 */

export const sanitize = (html) => {
    if (!html) return ''

    // Si estamos en un entorno donde DOMParser no está disponible (ej: SSR), devolvemos el texto plano
    if (typeof window === 'undefined') return html.replace(/<[^>]*>?/gm, '')

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // Lista de etiquetas permitidas
    const allowedTags = [
        'B', 'I', 'EM', 'STRONG', 'A', 'P', 'BR', 'UL', 'OL', 'LI',
        'H1', 'H2', 'H3', 'PRE', 'CODE', 'SPAN', 'BLOCKQUOTE', 'IMG', 'DIV'
    ]

    // Atributos permitidos por etiqueta
    const allowedAttrs = {
        'A': ['HREF', 'TARGET', 'TITLE'],
        'IMG': ['SRC', 'ALT', 'WIDTH', 'HEIGHT', 'STYLE'],
        'SPAN': ['STYLE', 'CLASS'],
        'DIV': ['STYLE', 'CLASS'],
        'P': ['STYLE', 'CLASS'],
        'H1': ['STYLE'],
        'H2': ['STYLE'],
        'H3': ['STYLE'],
        'CODE': ['CLASS']
    }

    const clean = (node) => {
        const nodes = node.childNodes
        for (let i = nodes.length - 1; i >= 0; i--) {
            const child = nodes[i]

            if (child.nodeType === 1) { // Elemento
                if (!allowedTags.includes(child.tagName)) {
                    // Si la etiqueta no está permitida, la eliminamos pero mantenemos sus hijos (opcional)
                    // Aquí la eliminamos por completo por seguridad
                    child.parentNode.removeChild(child)
                    continue
                }

                // Limpiar atributos
                const attrs = child.attributes
                const allowedForTag = allowedAttrs[child.tagName] || []

                for (let j = attrs.length - 1; j >= 0; j--) {
                    const attrName = attrs[j].name.toUpperCase()

                    // Bloquear atributos de eventos (siempre)
                    if (attrName.startsWith('ON')) {
                        child.removeAttribute(attrs[j].name)
                        continue
                    }

                    // Bloquear protocolos peligrosos en href/src
                    if (attrName === 'HREF' || attrName === 'SRC') {
                        const val = attrs[j].value.toLowerCase().trim()
                        if (val.startsWith('javascript:') || val.startsWith('data:text/html')) {
                            child.removeAttribute(attrs[j].name)
                            continue
                        }
                    }

                    // Si el atributo no está en la lista blanca de la etiqueta, se va
                    if (!allowedForTag.includes(attrName)) {
                        child.removeAttribute(attrs[j].name)
                    }
                }

                // Recursión
                clean(child)
            }
        }
    }

    clean(doc.body)
    return doc.body.innerHTML
}
