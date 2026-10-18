class HeaderOption extends HTMLElement {
    static get observedAttributes() {
        return ['key']
    }

    constructor() {
        super()
        setupElement(this, 'party-header-option-template')

        this.header = this.getElementById('header')
    }

    set onclick(func) {
        this.header.onclick = () => func(this.key)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'key') {
            this.key = newValue
        }
    }
}
customElements.define('party-header-option', HeaderOption)
