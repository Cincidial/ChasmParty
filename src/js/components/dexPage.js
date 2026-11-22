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

// This is the target set of data that the filter will be used on
class TargetData {
    constructor(dex_page, option_id, id_func, table, data) {
        this.option_id = option_id
        this.option_element = dex_page.getElementById(this.option_id)
        this.id_func = id_func
        this.table = table
        this.data = data

        this.option_element.onclick = () => {
            dex_page.current_target_data.option_element.active = false
            dex_page.current_target_data = this
            this.option_element.active = true

            dex_page.updateDisplay()
        }
    }
}

class DexPage extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-dex-page-template')

        this.add_filter_button = this.getElementById('add_filter_button')
        this.filter_form = this.getElementById('filter_form')
        this.applied_filters_list = this.getElementById('applied_filters_list')
        this.filtered_data_container = this.getElementById('filtered_data_container')

        this.add_filter_button.onclick = () => this.addCurrentFilter()

        this.filter_form_cards = [
            new FilterFormCard(this, 'filter_option_pokemon', () => new FilterFormPokemon()),
            new FilterFormCard(this, 'filter_option_ability', () => new FilterFormAbilities()),
            new FilterFormCard(this, 'filter_option_move', () => new FilterFormPokemon()),
        ]
        this.target_data_list = [
            new TargetData(
                this,
                'filter_show_pokemon',
                (x) => x._ID,
                new Table().setup([
                    new TableColumn(
                        'Dex #',
                        (x) => new VerticalStack().setup([x.dex_num, x._Data.Name]),
                        (x) => x.dex_num,
                    ),
                    new TableColumn('', (x) => x.img_icon), // Add the name here and make it sort by name
                    new TableColumn(
                        'Type 1',
                        (x) => x.type1.img_icon,
                        (x) => x.type1._ID,
                    ),
                    new TableColumn(
                        'Type 2',
                        (x) => x.type2?.img_icon ?? '',
                        (x) => x.type2?._ID ?? '_',
                    ),
                    new TableColumn('Abilities', (x) => new VerticalStack().setup(x.abilities.map((y) => y.capsule_element))),
                    new TableColumn('Tribes', (x) => new VerticalStack().setup(x.tribes.map((x) => x.capsule_element))),
                    new TableColumn(
                        'HP',
                        (x) => x._Data.BaseStats.HP,
                        (x) => x._Data.BaseStats.HP,
                    ),
                    new TableColumn(
                        'Atk',
                        (x) => x._Data.BaseStats.Atk,
                        (x) => x._Data.BaseStats.Atk,
                    ),
                    new TableColumn(
                        'Def',
                        (x) => x._Data.BaseStats.Def,
                        (x) => x._Data.BaseStats.Def,
                    ),
                    new TableColumn(
                        'SpAtk',
                        (x) => x._Data.BaseStats.SpAtk,
                        (x) => x._Data.BaseStats.SpAtk,
                    ),
                    new TableColumn(
                        'SpDef',
                        (x) => x._Data.BaseStats.SpDef,
                        (x) => x._Data.BaseStats.SpDef,
                    ),
                    new TableColumn(
                        'Speed',
                        (x) => x._Data.BaseStats.Spe,
                        (x) => x._Data.BaseStats.Spe,
                    ),
                    new TableColumn(
                        'BST',
                        (x) => x.bst,
                        (x) => x.bst,
                    ),
                ]),
                Object.values(pbs_data.pokemon),
            ),
            new TargetData(
                this,
                'filter_show_abilities',
                (x) => x._ID,
                new Table().setup(
                    [
                        new TableColumn(
                            'Name',
                            (x) => x._Data.Name,
                            (x) => x._Data.Name,
                        ),
                        new TableColumn('Description', (x) => x._Data.Description),
                    ],
                    (x) => this.addFilter(FilterConfig.AbilityNameFilter(x._Data.Name)),
                ),
                Object.values(pbs_data.abilities),
            ),
        ]

        this.current_filter_form_card = null
        this.current_target_data = this.target_data_list[0]
        this.applied_filters = []

        this.setFilterForm(this.filter_form_cards[0])
        this.current_target_data.option_element.onclick()
    }

    updateDisplay() {
        const target_data = this.current_target_data
        const filter_configs = [
            ...this.applied_filters,
            ...this.filter_form_cards.filter((x) => x.in_progress_form).flatMap((x) => x.in_progress_form.getFilters()),
        ]

        // Filters of the same ID should be grouped as ORs, different filters should be applied as ANDs
        const grouped_filters = filter_configs.reduce((acc, data) => {
            const list = (acc[data.id] ??= [])
            list.push(data)

            return acc
        }, {})

        this.filtered_data_container.replaceChildren(
            this.current_target_data.table.setData(
                target_data.data.filter((d) => {
                    if (grouped_filters.length == 0) return true

                    for (const grouped_filter of Object.values(grouped_filters)) {
                        const fv = grouped_filter.map((x) => x.value)
                        if (!grouped_filter[0].filter_func(d, fv)) return false
                    }

                    return true
                }),
                this.current_target_data.id_func,
            ),
        )

        this.applied_filters_list.replaceChildren(
            ...Object.entries(grouped_filters).map((kv) => {
                const filter_group_display = new FilterGroupDisplay()
                filter_group_display.setup(kv[0], kv[1], (filter_config) => this.removeFilter(filter_config))

                return filter_group_display
            }),
        )
    }

    setFilterForm(filter_form_card) {
        if (this.current_filter_form_card == filter_form_card) return

        if (this.current_filter_form_card != null) this.getElementById(this.current_filter_form_card.id).active = false
        this.getElementById(filter_form_card.id).active = true

        filter_form_card.in_progress_form = filter_form_card.in_progress_form ?? filter_form_card.new_form_func()
        filter_form_card.in_progress_form.on_change = () => this.updateDisplay()

        this.current_filter_form_card = filter_form_card
        this.filter_form.replaceChildren(filter_form_card.in_progress_form)
    }

    addCurrentFilter() {
        this.filter_form_cards
            .filter((x) => x.in_progress_form)
            .forEach((card) => {
                card.in_progress_form.getFilters().forEach((fc) => {
                    fc.in_progress = false
                    this.applied_filters.push(fc)
                })
                card.in_progress_form = null
            })

        this.current_filter_form_card.in_progress_form = this.current_filter_form_card.new_form_func()
        this.current_filter_form_card.in_progress_form.on_change = () => this.updateDisplay()

        this.filter_form.replaceChildren(this.current_filter_form_card.in_progress_form)
        this.updateDisplay()
    }

    addFilter(filter) {
        this.applied_filters.push(filter)
        this.updateDisplay()
    }

    removeFilter(filter_config) {
        if (filter_config.in_progress) {
            filter_config.in_prog_reset_func()
        } else {
            this.applied_filters = this.applied_filters.filter((x) => x !== filter_config)
        }
        this.updateDisplay()
    }
}
customElements.define('party-dex-page', DexPage)
