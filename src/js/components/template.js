function setupElement(element, templateId) {
    const template = document.getElementById(templateId).content
    const node = document.importNode(template, true)

    const shadow_link = document.createElement('link')
    shadow_link.rel = 'stylesheet'
    shadow_link.type = 'text/css'
    shadow_link.href = 'style.css'

    element.root = element.attachShadow({ mode: 'open' })
    element.root.appendChild(shadow_link)
    element.root.appendChild(node)

    element.getElementById = (id) => element.root.getElementById(id)
}
