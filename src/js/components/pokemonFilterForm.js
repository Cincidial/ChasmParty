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
        this.hide_legendary_checkbox = this.getElementById('hide_legendary_checkbox')
        this.starter_only_checkbox = this.getElementById('starter_only_checkbox')
    }

    set onChange(func) {
        this.generation_select.onchange = func
        this.evolution_select.onchange = func
        this.hide_legendary_checkbox.onchange = func
        this.starter_only_checkbox.onchange = func
    }

    clear() {
        this.generation_select.value = 'Any'
        this.evolution_select.value = 'Any'
        this.hide_legendary_checkbox.checked = false
        this.starter_only_checkbox.checked = false
    }

    getFilters() {
        const filters = []
        if (this.generation_select.value != 'Any') {
            filters.push(
                new FilterConfig(DexPage.POKEMON_GENERATION_FILTER_ID, DexPage.FILTER_GROUP_POKEMON, this.generation_select.value).setMonFunc(
                    (gen_key, gen_value, filter_values) => filter_values.includes(`${gen_value.Generation ?? -1}`),
                ),
            )
        }

        if (this.evolution_select.value != 'Any') {
            filters.push(
                new FilterConfig(DexPage.POKEMON_EVOLUTION_FILTER_ID, DexPage.FILTER_GROUP_POKEMON, this.evolution_select.value).setMonFunc(
                    (gen_key, gen_value, filter_values) => {
                        if (filter_values.includes('First') && gen_value.Prevo == undefined && gen_value.Evolutions) return true
                        if (filter_values.includes('Final') && gen_value.Prevo && gen_value.Evolutions == undefined) return true
                        if (filter_values.includes('Single') && gen_value.Prevo == undefined && gen_value.Evolutions == undefined) return true

                        return false
                    },
                ),
            )
        }

        if (this.hide_legendary_checkbox.checked) {
            filters.push(
                new FilterConfig(DexPage.POKEMON_HIDE_LEGENDS_FILTER_ID, DexPage.FILTER_GROUP_POKEMON, true).setMonFunc(
                    (gen_key, gen_value, filter_values) => filter_values.includes(true) && !globalIsLegend(gen_key),
                ),
            )
        }

        if (this.starter_only_checkbox.checked) {
            filters.push(
                new FilterConfig(DexPage.POKEMON_STARTERS_ONLY_FILTER_ID, DexPage.FILTER_GROUP_POKEMON, true).setMonFunc(
                    (gen_key, gen_value, filter_values) => filter_values.includes(true) && globalIsStarter(gen_key),
                ),
            )
        }

        return filters
    }
}
customElements.define('party-pokemon-filter-form', PokemonFilterForm)
