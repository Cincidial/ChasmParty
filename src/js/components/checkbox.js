class Checkbox extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-checkbox-template')

        this.checkbox = this.getElementById('checkbox')
    }

    set onchange(func) {
        this.checkbox.onchange = func
    }

    get checked() {
        return this.checkbox.checked
    }
}
customElements.define('party-checkbox', Checkbox)
