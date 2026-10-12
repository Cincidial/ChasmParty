class LoadingSplash extends HTMLElement {
    constructor() {
        super()
        setupElement(this, "loading-splash-template")
    }
}
customElements.define("loading-splash", LoadingSplash)
