class FilterFormAbilities extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-filter-form-abilities-template')

        this.is_primival_checkbox = this.getElementById('is_primival_checkbox')
        this.name_dropdown = this.getElementById('name_dropdown')
        this.desc_input = this.getElementById('desc_input')

        this.name_dropdown.populate(Object.values(pbs_data.abilities).map((x) => x._Data.Name))
    }

    set on_change(func) {
        this.is_primival_checkbox.onchange = func
        this.name_dropdown.onchange = func
        this.desc_input.oninput = func
    }

    getFilters() {
        const filters = []
        if (this.is_primival_checkbox.checked) {
            filters.push(FilterConfig.AbilityPrimevalFilter(true, () => (this.is_primival_checkbox.checked = false)))
        }

        if (this.name_dropdown.value) {
            filters.push(FilterConfig.AbilityNameFilter(this.name_dropdown.value, () => (this.name_dropdown.value = '')))
        }

        if (this.desc_input.value) {
            filters.push(FilterConfig.AbilityDescFilter(this.desc_input.value, () => (this.desc_input.value = '')))
        }

        return filters
    }
}
customElements.define('party-filter-form-abilities', FilterFormAbilities)
