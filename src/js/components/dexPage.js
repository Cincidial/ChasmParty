class DexPage extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-dex-page-template')

        this.test = this.getElementById('test')
        this.test.populate(['a', 'b', 'c'])
        this.test.onSelect = (value) => console.log(value)

        this.filterOptions = [
            this.getElementById('filterOptionPokemon'),
            this.getElementById('filterOptionAbility'),
            this.getElementById('filterOptionMove'),
        ]
        this.filterOptions.forEach((opt) => {
            opt.onclick = (key) => console.log(key)
        })
    }
}
customElements.define('party-dex-page', DexPage)
