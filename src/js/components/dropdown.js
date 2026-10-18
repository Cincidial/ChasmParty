class Dropdown extends HTMLElement {
    static get observedAttributes() {
        return ['placeholder']
    }

    constructor() {
        super()
        setupElement(this, 'party-dropdown-template')

        this.datalist = this.getElementById('data')
        this.list = this.getElementById('list')
    }

    set onSelect(func) {
        this.list.addEventListener('input', (e) => func(e.target.value))
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'placeholder') {
            this.list.setAttribute('placeholder', newValue || '')
        }
    }

    populate(options) {
        this.datalist.replaceChildren(
            ...options.map((option) => {
                var element = document.createElement('option')
                element.value = option
                return element
            }),
        )
    }
}
customElements.define('party-drop-down', Dropdown)
