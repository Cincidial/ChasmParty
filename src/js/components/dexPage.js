class DexPage extends HTMLElement {
    constructor() {
        super()
        setupElement(this, "dex-page-template")

        this.test = this.getElementById("test")
        this.test.populate(["a", "b", "c"])
        this.test.onSelect((value) => console.log(value))
    }
}
customElements.define("dex-page", DexPage)
