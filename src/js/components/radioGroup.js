class RadioGroup extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-radio-group-template')

        this.container = this.getElementById('container')
    }

    get checkedKey() {
        return this.container.children.filter((x) => x.checked)[0].value
    }

    setup(key_value_list, on_change_func) {
        this.container.replaceChildren(
            ...key_value_list.map(([k, v], i) => {
                const radio = document.createElement('input')
                radio.type = 'radio'
                radio.name = 'groupedRadios'
                radio.value = k
                radio.onchange = on_change_func
                radio.checked = i == 0

                const label = document.createElement('label')
                label.appendChild(document.createTextNode(v))
                label.appendChild(radio)

                return label
            }),
        )

        return this
    }
}
customElements.define('party-radio-group', RadioGroup)
