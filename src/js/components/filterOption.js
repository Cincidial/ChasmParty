class FilterOption extends HTMLElement {
    static get observedAttributes() {
        return ['key']
    }

    constructor() {
        super()
        setupElement(this, 'party-filter-option-template')

        this.header = this.getElementById('header')
    }

    set onclick(func) {
        this.header.onclick = () => func(this.key)
    }

    attributeChangedCallback(name, _, new_value) {
        if (name === 'key') {
            this.key = new_value
        }
    }
}
customElements.define('party-filter-option', FilterOption)
