class VerticalStack extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-vertical-stack-template')

        this.container = this.getElementById('container')
    }

    setup(list) {
        this.container.replaceChildren(
            ...list.map((x) => {
                if (x instanceof HTMLElement) return x

                const div = document.createElement('div')
                div.innerHTML = x
                return div
            }),
        )
        return this
    }
}
customElements.define('party-vertical-stack', VerticalStack)
