class FilterGroupDisplay extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-filter-group-display-template')

        this.header_div = this.getElementById('header_div')
        this.data_div = this.getElementById('data_div')
    }

    setup(group_name, filter_configs, remove_callback) {
        this.header_div.replaceChildren(group_name)
        this.data_div.replaceChildren(
            ...filter_configs.map((x) => {
                var text = x.value
                if (text === true) {
                    text = 'True'
                } else if (text === false) {
                    text = 'False'
                }

                return new Capsule().setup(text, x, remove_callback)
            }),
        )
    }
}
customElements.define('party-filter-group-display', FilterGroupDisplay)
