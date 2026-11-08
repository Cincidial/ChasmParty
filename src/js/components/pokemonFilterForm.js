class PokemonFilterForm extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-pokemon-filter-form-template')

        this.generation_select = this.getElementById('generation_select')
        this.generation_select.replaceChildren(
            ...['Any', ...local_data.generations].map((gen) => {
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

        this.search_dropdown.populate(globalGetPokemon().map((kv) => kv[1].Name))
    }

    set onChange(func) {
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
            filters.push(
                new FilterConfig('Generation', this.generation_select.value).setMonFunc((gen_key, gen_value, filter_values) =>
                    filter_values.includes(`${gen_value.Generation ?? -1}`),
                ),
            )
        }

        if (this.evolution_select.value != 'Any') {
            filters.push(
                new FilterConfig('Evolution', this.evolution_select.value).setMonFunc((gen_key, gen_value, filter_values) => {
                    if (filter_values.includes('First') && gen_value.Prevo == undefined && gen_value.Evolutions) return true
                    if (filter_values.includes('Final') && gen_value.Prevo && gen_value.Evolutions == undefined) return true
                    if (filter_values.includes('Single') && gen_value.Prevo == undefined && gen_value.Evolutions == undefined) return true

                    return false
                }),
            )
        }

        if (this.only_legendary_checkbox.checked) {
            filters.push(
                new FilterConfig('Only Legends', true).setMonFunc(
                    (gen_key, gen_value, filter_values) => filter_values.includes(true) && globalIsLegend(gen_key),
                ),
            )
        }

        if (this.hide_legendary_checkbox.checked) {
            filters.push(
                new FilterConfig('Hide Legends', true).setMonFunc(
                    (gen_key, gen_value, filter_values) => filter_values.includes(true) && !globalIsLegend(gen_key),
                ),
            )
        }

        if (this.starter_only_checkbox.checked) {
            filters.push(
                new FilterConfig('Starters Only', true).setMonFunc(
                    (gen_key, gen_value, filter_values) => filter_values.includes(true) && globalIsStarter(gen_key),
                ),
            )
        }

        if (this.search_dropdown.value) {
            filters.push(
                new FilterConfig('Pokemon Search', this.search_dropdown.value).setMonFunc((gen_key, gen_value, filter_values) =>
                    filter_values.some((x) => gen_value.Name.toLowerCase().includes(x.toLowerCase())),
                ),
            )
        }

        return filters
    }
}
customElements.define('party-pokemon-filter-form', PokemonFilterForm)
