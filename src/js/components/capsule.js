class Capsule extends HTMLElement {
    static get observedAttributes() {
        return ['removable']
    }

    constructor() {
        super()
        setupElement(this, 'party-capsule-template')

        this.text_span = this.getElementById('text_span')
    }

    setup(display_value, data, on_remove_callback = null) {
        var text = display_value
        if (text instanceof TextWithTooltip) {
            text = display_value.text
            this.text_span.title = display_value.tooltip
        }

        this.text_span.innerHTML = text
        this.data = data

        if (on_remove_callback !== null) {
            this.setAttribute('removable', '')
            this.onclick = () => on_remove_callback(this.data)
        }

        return this
    }
}
customElements.define('party-capsule', Capsule)
