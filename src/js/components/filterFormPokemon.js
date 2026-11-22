class FilterFormPokemon extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-filter-form-pokemon-template')

        this.generation_select = this.getElementById('generation_select')
        this.generation_select.replaceChildren(
            ...['Any', ...pbs_data.generations].map((gen) => {
                var element = document.createElement('option')
                element.value = gen
                element.innerHTML = gen
                return element
            }),
        )

        this.evolution_select = this.getElementById('evolution_select')
        this.only_legendary_checkbox = this.getElementById('only_legendary_checkbox')
        this.hide_legendary_checkbox = this.getElementById('hide_legendary_checkbox')
        this.starter_only_checkbox = this.getElementById('starter_only_checkbox')
        this.search_dropdown = this.getElementById('search_dropdown')

        this.search_dropdown.populate(Object.values(pbs_data.pokemon).map((x) => x._Data.Name))
    }

    set on_change(func) {
        this.generation_select.onchange = func
        this.evolution_select.onchange = func
        this.only_legendary_checkbox.onchange = func
        this.hide_legendary_checkbox.onchange = func
        this.starter_only_checkbox.onchange = func
        this.search_dropdown.onchange = func
    }

    getFilters() {
        const filters = []
        if (this.generation_select.value != 'Any') {
            filters.push(FilterConfig.PokemonGenerationFilter(this.generation_select.value, () => (this.generation_select.value = 'Any')))
        }

        if (this.evolution_select.value != 'Any') {
            filters.push(FilterConfig.PokemonEvolutionFilter(this.evolution_select.value, () => (this.evolution_select.value = 'Any')))
        }

        if (this.only_legendary_checkbox.checked) {
            filters.push(FilterConfig.PokemonOnlyLegendsFilter(true, () => (this.only_legendary_checkbox.checked = false)))
        }

        if (this.hide_legendary_checkbox.checked) {
            filters.push(FilterConfig.PokemonHideLegendsFilter(true, () => (this.hide_legendary_checkbox.checked = false)))
        }

        if (this.starter_only_checkbox.checked) {
            filters.push(FilterConfig.PokemonStartersOnlyFilter(true, () => (this.starter_only_checkbox.checked = false)))
        }

        if (this.search_dropdown.value) {
            filters.push(FilterConfig.PokemonSearchFilter(this.search_dropdown.value, () => (this.search_dropdown.value = '')))
        }

        return filters
    }
}
customElements.define('party-filter-form-pokemon', FilterFormPokemon)
