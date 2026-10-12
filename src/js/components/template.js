function setupElement(element, templateId) {
    const template = document.getElementById(templateId).content
    const node = document.importNode(template, true)
    
    element.root = element.attachShadow({mode: 'open'})
    element.root.appendChild(node)

    element.getElementById = (id) => element.root.getElementById(id)
}