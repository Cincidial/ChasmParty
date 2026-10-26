class FilterGroupDisplay extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-filter-group-display-template')

        this.header_div = this.getElementById('header_div')
        this.data_div = this.getElementById('data_div')
    }

    setup(group_name, values) {
        this.header_div.replaceChildren(group_name)
        this.data_div.replaceChildren(Object.entries(values).map((kv) => `${kv[0]}: ${kv[1].values.join(',')}`))
    }
}
customElements.define('party-filter-group-display', FilterGroupDisplay)
