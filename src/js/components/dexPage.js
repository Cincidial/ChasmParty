class FilterTarget {
    constructor(div, func_id, generator) {
        this.div = div
        this.func_id = func_id
        this.generator = generator
    }
}

class DexPage extends HTMLElement {
    static FILTER_GROUP_POKEMON = 'pokemon'

    static POKEMON_GENERATION_FILTER_ID = 'pokemon_generation'
    static POKEMON_EVOLUTION_FILTER_ID = 'pokemon_evolution'
    static POKEMON_HIDE_LEGENDS_FILTER_ID = 'pokemon_legends'
    static POKEMON_STARTERS_ONLY_FILTER_ID = 'pokemon_starters'

    static FILTER_FUNC_POKEMON = 'filter_func_pokemon'

    constructor() {
        super()
        setupElement(this, 'party-dex-page-template')

        this.add_filter_button = this.getElementById('add_filter_button')
        this.filter_form = this.getElementById('filter_form')
        this.applied_filters_list = this.getElementById('applied_filters_list')
        this.pokemon_list = this.getElementById('pokemon_list')

        this.filter_options = [{ id: 'filter_option_pokemon', new_form_func: () => new PokemonFilterForm(), in_progress_form: null }]
        this.filter_targets = [new FilterTarget(this.pokemon_list, DexPage.FILTER_FUNC_POKEMON, globalGetPokemon)]

        this.current_filter_opt = null
        this.applied_filters = []

        this.add_filter_button.onclick = () => this.addCurrentFilter()
        this.filter_options.forEach((opt) => (this.getElementById(opt.id).onclick = (_) => this.setFilterForm(opt)))

        this.applyFilters([])
        this.setFilterForm(this.filter_options[0])
    }

    applyFilters(filter_configs) {
        // Filters of the same ID should be grouped as ORs, different filters should be applied as ANDs. Group name is used for display
        const grouped_filters = filter_configs.reduce((acc, data) => {
            acc[data.group] ??= {}
            const obj = (acc[data.group][data.id] ??= { funcs: data.funcs })
            const list = (obj.values ??= [])

            list.push(data.value)
            return acc
        }, {})

        this.filter_targets.forEach((ft) => ft.div.replaceChildren())
        this.filter_targets.forEach((ft) => {
            const imgs = ft
                .generator((gen_key, gen_value) => {
                    if (grouped_filters.length == 0) return true

                    for (const groupedFilter of Object.entries(grouped_filters)) {
                        for (const filter of Object.values(groupedFilter[1])) {
                            const filter_values = filter.values
                            const filtering_func = filter.funcs[ft.func_id]

                            if (filtering_func == undefined) continue
                            if (!filtering_func(gen_key, gen_value, filter_values)) return false
                        }
                    }

                    return true
                })
                .map((kv) => getPokemonIconImg(kv[0]))

            ft.div.append(...imgs)
        })

        this.applied_filters_list.replaceChildren(
            ...Object.entries(grouped_filters).map((kv) => {
                const filter_group_display = new FilterGroupDisplay()
                filter_group_display.setup(kv[0], kv[1])

                return filter_group_display
            }),
        )
    }

    setFilterForm(filter_opt) {
        if (this.current_filter_opt == filter_opt) return

        filter_opt.in_progress_form = filter_opt.in_progress_form ?? filter_opt.new_form_func()
        filter_opt.in_progress_form.onChange = () => this.inProgressFilterHasChanges()

        this.current_filter_opt = filter_opt
        this.filter_form.replaceChildren(filter_opt.in_progress_form)
    }

    inProgressFilterHasChanges() {
        const filters = this.current_filter_opt.in_progress_form.getFilters()
        this.applyFilters([...this.applied_filters, ...filters])
    }

    addCurrentFilter() {
        this.applied_filters.push(...this.current_filter_opt.in_progress_form.getFilters())
        this.applyFilters(this.applied_filters)

        this.current_filter_opt.in_progress_form = this.current_filter_opt.new_form_func()
        this.current_filter_opt.in_progress_form.onChange = () => this.inProgressFilterHasChanges()

        this.filter_form.replaceChildren(this.current_filter_opt.in_progress_form)
    }
}
customElements.define('party-dex-page', DexPage)
