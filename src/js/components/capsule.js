class Capsule extends HTMLElement {
    static get observedAttributes() {
        return ['removable']
    }

    constructor() {
        super()
        setupElement(this, 'party-capsule-template')

        this.text_display = this.getElementById('text_display')
    }

    setup(text, data, on_remove_callback = null) {
        this.text_display.innerHTML = text
        this.data = data

        if (on_remove_callback !== null) {
            this.setAttribute('removable', '')
            this.onclick = () => on_remove_callback(this.data)
        }
    }
}
customElements.define('party-capsule', Capsule)
