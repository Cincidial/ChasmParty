class PokemonFilterForm extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-pokemon-filter-form-template')

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
            filters.push(new FilterConfig('Generation', this.generation_select.value, (d, fv) => fv.includes(`${d._Data.Generation ?? -1}`)))
        }

        if (this.evolution_select.value != 'Any') {
            filters.push(
                new FilterConfig('Evolution', this.evolution_select.value, (d, fv) => {
                    if (fv.includes('First') && d.is_first_stage) return true
                    if (fv.includes('Final') && d.is_final_stage) return true
                    if (fv.includes('Single') && d.has_no_evo_line) return true

                    return false
                }),
            )
        }

        if (this.only_legendary_checkbox.checked) {
            filters.push(new FilterConfig('Only Legends', true, (d, fv) => fv.includes(true) && d.is_legend))
        }

        if (this.hide_legendary_checkbox.checked) {
            filters.push(new FilterConfig('Hide Legends', true, (d, fv) => fv.includes(true) && !d.is_legend))
        }

        if (this.starter_only_checkbox.checked) {
            filters.push(new FilterConfig('Starters Only', true, (d, fv) => fv.includes(true) && d.is_starter))
        }

        if (this.search_dropdown.value) {
            filters.push(
                new FilterConfig('Pokemon Search', this.search_dropdown.value, (d, fv) =>
                    fv.some((x) => d._Data.Name.toLowerCase().includes(x.toLowerCase())),
                ),
            )
        }

        return filters
    }
}
customElements.define('party-pokemon-filter-form', PokemonFilterForm)
