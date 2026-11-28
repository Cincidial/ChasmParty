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
    constructor(dex_page, option_id, table, data) {
        this.option_id = option_id
        this.option_element = dex_page.getElementById(this.option_id)
        this.table = table
        this.data = data

        this.option_element.onclick = () => {
            dex_page.current_target_data.option_element.active = false
            dex_page.current_target_data = this
            this.option_element.active = true

            dex_page.updateDisplay()
        }
    }

    onclick() {
        this.option_element.onclick()
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
            new FilterFormCard(this, 'filter_option_move', () => new FilterFormMoves()),
        ]
        this.target_data_list = [
            new TargetData(
                this,
                'filter_show_pokemon',
                new Table().setup(
                    [
                        new TableColumn('Dex #', 16, (x) => new VerticalStack().setup([x.dex_num, x._Data.Name])).setSortValueFunc((x) => x.dex_num),
                        new TableColumn('', 10, (x) => x.img_icon),
                        new TableColumn('Type 1', 5, (x) => x.type1.img_icon).setSortValueFunc((x) => x.type1._ID),
                        new TableColumn('Type 2', 5, (x) => x.type2?.img_icon ?? '').setSortValueFunc((x) => x.type2?._ID ?? '_'),
                        new TableColumn('Abilities', 15, (x) => new VerticalStack().setup(x.abilities.map((y) => y.capsule_element))),
                        new TableColumn('Tribes', 15, (x) => new VerticalStack().setup(x.tribes.map((x) => x.capsule_element))),
                        new TableColumn('HP', 9, (x) => x._Data.BaseStats.HP).sameSortAsElement(),
                        new TableColumn('Atk', 9, (x) => x._Data.BaseStats.Atk).sameSortAsElement(),
                        new TableColumn('Def', 9, (x) => x._Data.BaseStats.Def).sameSortAsElement(),
                        new TableColumn('SpAtk', 9, (x) => x._Data.BaseStats.SpAtk).sameSortAsElement(),
                        new TableColumn('SpDef', 9, (x) => x._Data.BaseStats.SpDef).sameSortAsElement(),
                        new TableColumn('Speed', 9, (x) => x._Data.BaseStats.Spe).sameSortAsElement(),
                        new TableColumn('BST', 10, (x) => x.bst).sameSortAsElement(),
                    ],
                    100,
                ),
                Object.values(pbs_data.pokemon),
            ),
            new TargetData(
                this,
                'filter_show_abilities',
                new Table().setup(
                    [
                        new TableColumn('Name', 15, (x) => x._Data.Name).sameSortAsElement(),
                        new TableColumn('Description', 75, (x) => x._Data.Description),
                        new TableColumn('Is Primeval', 10, (x) => isPrimevalTextDisplay(x._Data.IsPrimeval)),
                    ],
                    100,
                    (x) => this.addFilter(FilterConfig.AbilityNameFilter(x._Data.Name), this.target_data_list[0]),
                ),
                Object.values(pbs_data.abilities),
            ),
            new TargetData(
                this,
                'filter_show_moves',
                new Table().setup(
                    [
                        new TableColumn('Name', 10, (x) => x._Data.Name ?? '').sameSortAsElement(),
                        new TableColumn('Type', 5, (x) => x.type.img_icon ?? '').setSortValueFunc((x) => x._Data.Type ?? ''),
                        new TableColumn('Category', 5, (x) => x.category_icon ?? '').setSortValueFunc((x) => x._Data.Category ?? ''),
                        new TableColumn('Pow', 5, (x) => x._Data.Power ?? '').sameSortAsElement(),
                        new TableColumn('Acc', 5, (x) => x._Data.Accuracy ?? '').sameSortAsElement(),
                        new TableColumn('PP', 3, (x) => x._Data.TotalPP ?? '').sameSortAsElement(),
                        new TableColumn('Prio', 5, (x) => (!x?._Data.Priority ? '' : x._Data.Priority)).sameSortAsElement(),
                        new TableColumn('Flags', 10, (x) => x.display_flags).sameSortAsElement(),
                        new TableColumn('%', 5, (x) => ((x._Data.EffectChance ?? 100) == 100 ? '' : x._Data.EffectChance)).sameSortAsElement(),
                        new TableColumn('Primeval', 7, (x) => isPrimevalTextDisplay(x._Data.IsPrimeval)).sameSortAsElement(),
                        new TableColumn('Description', 40, (x) => x._Data.Description ?? ''),
                    ],
                    100,
                    (x) => this.addFilter(FilterConfig.MoveNameFilter(x._Data.Name), this.target_data_list[0]),
                ),
                Object.values(pbs_data.moves),
            ),
        ]

        this.current_filter_form_card = null
        this.current_target_data = this.target_data_list[0]
        this.applied_filters = []

        this.setFilterForm(this.filter_form_cards[0])
        this.current_target_data.onclick()
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

    addFilter(filter, nav_to_target_data = null) {
        this.applied_filters.push(filter)
        if (nav_to_target_data) {
            nav_to_target_data.onclick()
            window.scrollTo({ top: 0, behavior: 'smooth' }) // If we are changing data we should go back to the top
        }

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
