class Template {
    constructor(template_name) {
        this.node = document.getElementById(template_name).content.cloneNode(true)
        this.root = this.node.querySelector(':not(style)')
    }

    getElementById(id) {
        return this.node.getElementById(id)
    }

    addToDom() {
        document.body.appendChild(this.node)
    }

    removeFromDom() {
        this.root.remove()
    }
}