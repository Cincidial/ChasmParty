class LoadingSplash extends HTMLElement {
    constructor() {
        super()
        setupElement(this, "party-loading-splash-template")
    }
}
customElements.define("party-loading-splash", LoadingSplash)
