class Dropdown extends HTMLElement {
    static get observedAttributes() {
        return ["placeholder"]
    }

    constructor() {
        super()
        setupElement(this, "dropdown-template")

        this.datalist = this.getElementById("data")
        this.list = this.getElementById("list")
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "placeholder" && oldValue != newValue) {
            this.list.setAttribute("placeholder", newValue || "")
        }
    }

    populate(options) {
        this.datalist.replaceChildren(
            ...options.map((option) => {
                var element = document.createElement("option")
                element.value = option
                return element
            }),
        )
    }

    onSelect(func) {
        this.list.addEventListener("input", (e) => func(e.target.value))
    }
}
customElements.define("drop-down", Dropdown)
