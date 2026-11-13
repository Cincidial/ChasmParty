// This is the data for one of the filter cards
class FilterFormCard {
    constructor(dex_page, id, new_form_func) {
        this.id = id
        this.new_form_func = new_form_func
        this.in_progress_form = null

        dex_page.getElementById(this.id).onclick = (_) => dex_page.setFilterForm(this)
    }
}

// This is data for how to sort the target list
class SortOption {
    constructor(key, value, get_sort_value_func) {
        this.key = key
        this.value = value
        this.get_sort_value_func = get_sort_value_func
    }
}

// This is the target set of data that the filter and sort options will be used on
class TargetData {
    constructor(dex_page, checkbox_id, data, sort_options, gen_element_func) {
        this.option_id = checkbox_id
        this.option_element = dex_page.getElementById(this.option_id)
        this.data = data
        this.gen_element_func = gen_element_func
        this.sort_descending = false
        this.get_sort_value_func = sort_options[0].get_sort_value_func
        this.sort_radio_group = new RadioGroup().setup(
            sort_options.map((x) => [x.key, x.value]),
            (event) => {
                this.get_sort_value_func = this.sort_options_to_func_hash[event.target.value]
                dex_page.updateDisplay()
            },
        )
        this.sort_options_to_func_hash = {}

        this.option_element.onclick = () => {
            dex_page.current_target_data.option_element.active = false
            dex_page.current_target_data = this
            this.option_element.active = true

            dex_page.target_data_sort_container.replaceChildren(this.sort_radio_group)
            dex_page.updateDisplay()
        }

        sort_options.forEach((x) => {
            this.sort_options_to_func_hash[x.key] = x.get_sort_value_func
        })
    }
}

class DexPage extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-dex-page-template')

        this.add_filter_button = this.getElementById('add_filter_button')
        this.filter_form = this.getElementById('filter_form')
        this.applied_filters_list = this.getElementById('applied_filters_list')
        this.filtered_data_list = this.getElementById('filtered_data_list')
        this.target_data_sort_button = this.getElementById('target_data_sort_button')
        this.target_data_sort_container = this.getElementById('target_data_sort_container')

        this.filter_form_cards = [
            new FilterFormCard(this, 'filter_option_pokemon', () => new PokemonFilterForm()),
            new FilterFormCard(this, 'filter_option_ability', () => new AbilityFilterForm()),
            new FilterFormCard(this, 'filter_option_move', () => new PokemonFilterForm()),
        ]
        this.target_data_list = [
            new TargetData(
                this,
                'filter_show_pokemon',
                Object.values(pbs_data.pokemon),
                [new SortOption('dex-num', 'Dex Number', (d) => d.dex_num), new SortOption('bst', 'BST', (d) => d.bst)],
                (x) => getPokemonIconImg(x._ID),
            ),
            new TargetData(
                this,
                'filter_show_abilities',
                Object.values(pbs_data.pokemon),
                [new SortOption('dex-num', 'Dex Number', (d) => d.dex_num)],
                (x) => getPokemonIconImg(x._ID),
            ),
            new TargetData(
                this,
                'filter_show_moves',
                Object.values(pbs_data.pokemon),
                [new SortOption('dex-num', 'Dex Number', (d) => d.dex_num)],
                (x) => getPokemonIconImg(x._ID),
            ),
        ]

        this.current_filter_form_card = null
        this.current_target_data = this.target_data_list[0]
        this.applied_filters = []

        this.add_filter_button.onclick = () => this.addCurrentFilter()
        this.target_data_sort_button.onclick = () => {
            this.current_target_data.sort_descending = !this.current_target_data.sort_descending
            this.updateDisplay()
        }
        this.current_target_data.option_element.onclick()

        this.updateDisplay()
        this.setFilterForm(this.filter_form_cards[0])
    }

    updateDisplay() {
        const filter_target = this.current_target_data
        const filter_configs = [...this.applied_filters, ...(this.current_filter_form_card?.in_progress_form?.getFilters() ?? [])]

        // Filters of the same ID should be grouped as ORs, different filters should be applied as ANDs
        const grouped_filters = filter_configs.reduce((acc, data) => {
            const list = (acc[data.id] ??= [])
            list.push(data)

            return acc
        }, {})

        this.filtered_data_list.replaceChildren(
            ...filter_target.data
                .filter((d) => {
                    if (grouped_filters.length == 0) return true

                    for (const grouped_filter of Object.values(grouped_filters)) {
                        const fv = grouped_filter.map((x) => x.value)
                        if (!grouped_filter[0].filter_func(d, fv)) return false
                    }

                    return true
                })
                .sort((a, b) => {
                    const value_a = filter_target.get_sort_value_func(a)
                    const value_b = filter_target.get_sort_value_func(b)

                    return (value_a === value_b ? 0 : value_a > value_b ? 1 : -1) * (filter_target.sort_descending ? -1 : 1)
                })
                .map((x) => filter_target.gen_element_func(x)),
        )

        this.applied_filters_list.replaceChildren(
            ...Object.entries(grouped_filters).map((kv) => {
                const filter_group_display = new FilterGroupDisplay()
                filter_group_display.setup(kv[0], kv[1], (filter_config) => this.removeFilter(filter_config))

                return filter_group_display
            }),
        )

        this.target_data_sort_button.innerText = this.current_target_data.sort_descending ? '↓' : '↑'
    }

    setFilterForm(filter_form_card) {
        if (this.current_filter_form_card == filter_form_card) return

        if (this.current_filter_form_card != null) this.getElementById(this.current_filter_form_card.id).active = false
        this.getElementById(filter_form_card.id).active = true

        filter_form_card.in_progress_form = filter_form_card.in_progress_form ?? filter_form_card.new_form_func()
        filter_form_card.in_progress_form.on_change = () => this.updateDisplay()

        this.current_filter_form_card = filter_form_card
        this.filter_form.replaceChildren(filter_form_card.in_progress_form)
        this.updateDisplay()
    }

    addCurrentFilter() {
        this.current_filter_form_card.in_progress_form.getFilters().forEach((x) => {
            x.in_progress = false
            this.applied_filters.push(x)
        })
        this.updateDisplay()

        this.current_filter_form_card.in_progress_form = this.current_filter_form_card.new_form_func()
        this.current_filter_form_card.in_progress_form.on_change = () => this.updateDisplay()

        this.filter_form.replaceChildren(this.current_filter_form_card.in_progress_form)
    }

    removeFilter(filter_config) {
        this.applied_filters = this.applied_filters.filter((x) => x !== filter_config)
        this.updateDisplay()
    }
}
customElements.define('party-dex-page', DexPage)
