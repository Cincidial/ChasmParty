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
            filters.push(FilterConfig.AbilityDescFilter(this.desc_input.value.trim(), () => (this.desc_input.value = '')))
        }

        return filters
    }
}
customElements.define('party-filter-form-abilities', FilterFormAbilities)

class FilterFormMoves extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-filter-form-moves-template')

        this.is_primival_checkbox = this.getElementById('is_primival_checkbox')
        this.name_dropdown = this.getElementById('name_dropdown')
        this.desc_input = this.getElementById('desc_input')

        this.name_dropdown.populate(Object.values(pbs_data.moves).map((x) => x._Data.Name))
    }

    set on_change(func) {
        this.is_primival_checkbox.onchange = func
        this.name_dropdown.onchange = func
        this.desc_input.oninput = func
    }

    getFilters() {
        const filters = []
        if (this.is_primival_checkbox.checked) {
            filters.push(FilterConfig.MovePrimevalFilter(true, () => (this.is_primival_checkbox.checked = false)))
        }

        if (this.name_dropdown.value) {
            filters.push(FilterConfig.MoveNameFilter(this.name_dropdown.value, () => (this.name_dropdown.value = '')))
        }

        if (this.desc_input.value) {
            filters.push(FilterConfig.MoveDescFilter(this.desc_input.value.trim(), () => (this.desc_input.value = '')))
        }

        return filters
    }
}
customElements.define('party-filter-form-moves', FilterFormMoves)

class Checkbox extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-checkbox-template')

        this.checkbox = this.getElementById('checkbox')
    }

    set onchange(func) {
        this.checkbox.onchange = func
    }

    get checked() {
        return this.checkbox.checked
    }

    set checked(value) {
        this.checkbox.checked = value
    }
}
customElements.define('party-checkbox', Checkbox)

class LoadingSplash extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-loading-splash-template')
    }
}
customElements.define('party-loading-splash', LoadingSplash)

class RadioGroup extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-radio-group-template')

        this.container = this.getElementById('container')
    }

    get checkedKey() {
        return this.container.children.filter((x) => x.checked)[0].value
    }

    setup(key_value_list, on_change_func) {
        this.container.replaceChildren(
            ...key_value_list.map(([k, v], i) => {
                const radio = document.createElement('input')
                radio.type = 'radio'
                radio.name = 'groupedRadios'
                radio.value = k
                radio.onchange = on_change_func
                radio.checked = i == 0

                const label = document.createElement('label')
                label.appendChild(document.createTextNode(v))
                label.appendChild(radio)

                return label
            }),
        )

        return this
    }
}
customElements.define('party-radio-group', RadioGroup)

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

class VerticalStack extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-vertical-stack-template')

        this.container = this.getElementById('container')
    }

    setup(list) {
        this.container.replaceChildren(
            ...list.map((x) => {
                if (x instanceof HTMLElement) return x

                const div = document.createElement('div')
                div.innerHTML = x
                return div
            }),
        )
        return this
    }
}
customElements.define('party-vertical-stack', VerticalStack)

class FilterGroupDisplay extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-filter-group-display-template')

        this.header_div = this.getElementById('header_div')
        this.data_div = this.getElementById('data_div')
    }

    setup(group_name, filter_configs, remove_callback) {
        this.header_div.replaceChildren(group_name)
        this.data_div.replaceChildren(
            ...filter_configs.map((x) => {
                var text = x.value
                if (text === true) {
                    text = 'True'
                } else if (text === false) {
                    text = 'False'
                }

                return new Capsule().setup(text, x, remove_callback)
            }),
        )
    }
}
customElements.define('party-filter-group-display', FilterGroupDisplay)

function setupElement(element, templateId) {
    const template = document.getElementById(templateId).content
    const node = document.importNode(template, true)

    const shadow_link = document.createElement('link')
    shadow_link.rel = 'stylesheet'
    shadow_link.type = 'text/css'
    shadow_link.href = 'style.css'

    element.root = element.attachShadow({ mode: 'open' })
    element.root.appendChild(shadow_link)
    element.root.appendChild(node)

    element.getElementById = (id) => element.root.getElementById(id)
}

class AtlasImg extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-atlas-img-template')
    }
}
customElements.define('party-atlas-img', AtlasImg)

function getAtlasImg(img_data, scale = 1.0, tooltip = '') {
    const element = new AtlasImg()
    const img = element.getElementById('img')

    img.width = Math.ceil(img_data.w * scale)
    img.height = Math.ceil(img_data.h * scale)
    img.title = tooltip

    const ctx = img.getContext('2d')
    ctx.scale(scale, scale)
    ctx.drawImage(img_data.img, 0, 0)

    return element
}

function getTypeIcon(id, scale = 0.35) {
    return getAtlasImg(sprite_atlas_data[`Type_${id}`], scale, pbs_data.types[id]._Data.Name)
}

function getCategoryIcon(id, scale = 1.0) {
    return getAtlasImg(sprite_atlas_data[`MoveCategory_${id}`], scale, id)
}

function getPokemonIconImg(id) {
    return getAtlasImg(sprite_atlas_data[`Icon_${id ?? '000'}`], 1.0, pbs_data.pokemon[id]._Data.Name)
}

function getPokemonFrontImg(id) {
    return getAtlasImg(sprite_atlas_data[`Front_${id ?? '000'}`], 1.0, pbs_data.pokemon[id]._Data.Name)
}

async function sliceAtlasInBatches(atlas_meta_data, batch_size = 100) {
    const response = await fetch(atlas_meta_data.Artifact)
    const blob = await response.blob()
    const atlas_bitmap = await createImageBitmap(blob)

    const result = {}
    Object.entries(atlas_meta_data).forEach(([k1, v1]) => {
        if (k1 != 'Artifact') {
            Object.entries(v1).forEach(([k2, v2]) => {
                if (k2 != 'w' && k2 != 'h') {
                    result[`${k1}_${k2}`] = {
                        x: v2.x,
                        y: v2.y,
                        w: v1.w,
                        h: v1.h,
                    }
                }
            })
        }
    })

    const result_list = Object.values(result)
    for (let i = 0; i < result_list.length; i += batch_size) {
        const batch = result_list.slice(i, i + batch_size)
        await Promise.all(batch.map(async (sprite) => (sprite.img = await createImageBitmap(atlas_bitmap, sprite.x, sprite.y, sprite.w, sprite.h))))
    }

    atlas_bitmap.close()
    return result
}

class TableColumn {
    constructor(header_name, element_func, sort_value_func = null) {
        this.header_name = header_name
        this.element_func = element_func
        this.sort_value_func = sort_value_func
        this.th = null
    }
}

class TableRow {
    constructor(data, tr) {
        this.data = data
        this.tr = tr
    }
}

class Table extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-table-template')

        this.table_scroll = this.getElementById('table_scroll')
        this.table_space = this.getElementById('table_space')
        this.table = this.getElementById('table')
        this.thead = this.getElementById('thead')
        this.tbody = this.getElementById('tbody')

        this.data = undefined
        this.table_column_list = []
        this.row_height = 0
        this.row_onclick_func = undefined
        this.sort_descending = false
        this.sort_col = null

        this.table_scroll.addEventListener('scroll', () => this.render())
        this.handle_resize = () => this.updateScrollContainerHeight()
    }

    connectedCallback() {
        this.updateScrollContainerHeight()
        window.addEventListener('resize', this.handle_resize)
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.handle_resize)
    }

    updateScrollContainerHeight() {
        const topPosition = this.table_scroll.getBoundingClientRect().top + this.row_height / 3
        this.table_scroll.style = `height: ${window.innerHeight - topPosition}px`

        this.render()
    }

    setup(table_column_list, row_height, row_onclick_func) {
        this.table_column_list = table_column_list
        this.row_height = row_height
        this.row_onclick_func = row_onclick_func
        this.sort_descending = false

        const header_row = this.thead.insertRow()
        header_row.replaceChildren(
            ...table_column_list.map((col) => {
                const th = document.createElement('th')
                th.textContent = col.header_name

                if (col.sort_value_func) {
                    if (!this.sort_col) {
                        this.sort_col = col
                        th.textContent = `↑ ${col.header_name}`
                    }

                    th.classList.add('sortable')
                    th.onclick = () => {
                        const old_col = this.sort_col
                        const new_col = col

                        if (this.sort_col == col) {
                            this.sort_descending = !this.sort_descending
                        } else {
                            this.sort_col = col
                            this.sort_descending = false
                        }

                        old_col.th.textContent = old_col.header_name
                        new_col.th.textContent = `${this.sort_descending ? '↓' : '↑'} ${col.header_name}`
                        this.updateData()
                    }
                }

                col.th = th
                return th
            }),
        )

        return this
    }

    setData(data) {
        this.data = data
        this.updateData()

        return this
    }

    updateData() {
        this.data = this.data.sort((a, b) => {
            const value_a = this.sort_col.sort_value_func(a)
            const value_b = this.sort_col.sort_value_func(b)

            return (value_a === value_b ? 0 : value_a > value_b ? 1 : -1) * (this.sort_descending ? -1 : 1)
        })

        this.table_scroll.scrollTo({ top: 0, behavior: 'smooth' })
        this.render()
    }

    render() {
        const header_height = this.thead ? this.thead.getBoundingClientRect().height : 0
        const scroll_top = Math.max(0, this.table_scroll.scrollTop - header_height)
        const viewport_height = this.table_scroll.getBoundingClientRect().height - header_height

        const start = Math.max(Math.floor(scroll_top / this.row_height) - 1, 0)
        const end = Math.min(start + Math.ceil(viewport_height / this.row_height) + 1, this.data.length)

        if (this.data && this.row_height && this.table_space) {
            const spacing_height = `${this.data.length * this.row_height + header_height + 15}px`
            if (this.table_space.style.height != spacing_height) this.table_space.style.height = spacing_height
        }

        this.tbody.replaceChildren()
        const row_count = end - start + 1
        Array.from({ length: row_count }).forEach((_, i) => {
            const data_index = start + i
            if (data_index >= this.data.length) return

            const data = this.data[data_index]
            const tr = this.tbody.insertRow()

            tr.classList.add(data_index % 2 == 0 ? 'tr_even' : 'tr_odd')
            tr.style.height = `${this.row_height}px`
            tr.style.transform = `translateY(${start * this.row_height}px)`

            if (this.row_onclick_func) {
                tr.onclick = () => this.row_onclick_func(data)
                tr.setAttribute('has-onclick', '')
            }

            this.table_column_list.forEach((col) => {
                const cell = tr.insertCell()
                cell.replaceChildren(col.element_func(data))
            })
        })

        const remaining_height = Math.max(0, (this.data.length - row_count) * this.row_height)
        if (remaining_height > 0) {
            const filler = this.tbody.insertRow()
            filler.style.height = `${remaining_height}px`
        }
    }
}
customElements.define('party-table', Table)

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
                        new TableColumn(
                            'Dex #',
                            (x) => new VerticalStack().setup([x.dex_num, x._Data.Name]),
                            (x) => x.dex_num,
                        ),
                        new TableColumn('', (x) => x.img_icon),
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
                        new TableColumn(
                            'Name',
                            (x) => x._Data.Name,
                            (x) => x._Data.Name,
                        ),
                        new TableColumn('Description', (x) => x._Data.Description),
                        new TableColumn('Is Primeval', (x) => isPrimevalTextDisplay(x._Data.IsPrimeval)),
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
                        new TableColumn(
                            'Name',
                            (x) => x._Data.Name ?? '',
                            (x) => x._Data.Name ?? '',
                        ),
                        new TableColumn(
                            'Type',
                            (x) => x.type.img_icon ?? '',
                            (x) => x._Data.Type ?? '',
                        ),
                        new TableColumn(
                            'Category',
                            (x) => x.category_icon ?? '',
                            (x) => x._Data.Category ?? '',
                        ),
                        new TableColumn(
                            'Pow',
                            (x) => x._Data.Power ?? '',
                            (x) => x._Data.Power ?? '',
                        ),
                        new TableColumn(
                            'Acc',
                            (x) => x._Data.Accuracy ?? '',
                            (x) => x._Data.Accuracy ?? '',
                        ),
                        new TableColumn(
                            'PP',
                            (x) => x._Data.TotalPP ?? '',
                            (x) => x._Data.TotalPP ?? '',
                        ),
                        new TableColumn(
                            'Prio',
                            (x) => (x._Data.Priority == undefined || x._Data.Priority == 0 ? '' : x._Data.Priority),
                            (x) => (x._Data.Priority == undefined || x._Data.Priority == 0 ? '' : x._Data.Priority),
                        ),
                        new TableColumn(
                            'Flags',
                            (x) => x._Data.Flags?.filter((x) => !local_data.ignored_move_flags.includes(x))?.join(', ') ?? '',
                            (x) => x._Data.Flags?.filter((x) => !local_data.ignored_move_flags.includes(x))?.join(', ') ?? '',
                        ),
                        new TableColumn(
                            '%',
                            (x) => (x._Data.EffectChance == undefined || x._Data.EffectChance == 100 ? '' : x._Data.EffectChance),
                            (x) => (x._Data.EffectChance == undefined || x._Data.EffectChance == 100 ? '' : x._Data.EffectChance),
                        ),
                        new TableColumn(
                            'Primeval',
                            (x) => isPrimevalTextDisplay(x._Data.IsPrimeval),
                            (x) => isPrimevalTextDisplay(x._Data.IsPrimeval),
                        ),
                        new TableColumn('Description', (x) => x._Data.Description ?? ''),
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

class FilterOption extends HTMLElement {
    static get observedAttributes() {
        return ['key']
    }

    constructor() {
        super()
        setupElement(this, 'party-filter-option-template')

        this.header = this.getElementById('header')
    }

    set active(value) {
        if (value === true) {
            this.setAttribute('active', '')
        } else {
            this.removeAttribute('active')
        }
    }

    attributeChangedCallback(name, _, new_value) {
        if (name === 'key') {
            this.key = new_value
        }
    }
}
customElements.define('party-filter-option', FilterOption)

class Dropdown extends HTMLElement {
    static get observedAttributes() {
        return ['placeholder']
    }

    constructor() {
        super()
        setupElement(this, 'party-dropdown-template')

        this.datalist = this.getElementById('data')
        this.list = this.getElementById('list')
    }

    get value() {
        return this.list.value.trim()
    }

    set value(value) {
        this.list.value = value
    }

    set onchange(func) {
        this.list.addEventListener('input', (e) => func())
    }

    attributeChangedCallback(name, _, new_value) {
        if (name === 'placeholder') {
            this.list.setAttribute('placeholder', new_value || '')
        }
    }

    populate(options) {
        this.datalist.replaceChildren(
            ...options.map((option) => {
                var element = document.createElement('option')
                element.value = option
                return element
            }),
        )
    }
}
customElements.define('party-drop-down', Dropdown)

class Capsule extends HTMLElement {
    static get observedAttributes() {
        return ['removable']
    }

    constructor() {
        super()
        setupElement(this, 'party-capsule-template')

        this.text_span = this.getElementById('text_span')
    }

    setup(display_value, data, on_remove_callback = null) {
        var text = display_value
        if (text instanceof TextWithTooltip) {
            text = display_value.text
            this.text_span.title = display_value.tooltip
        }

        this.text_span.innerHTML = text
        this.data = data

        if (on_remove_callback !== null) {
            this.setAttribute('removable', '')
            this.onclick = () => on_remove_callback(this.data)
        }

        return this
    }
}
customElements.define('party-capsule', Capsule)

class TextWithTooltip {
    constructor(text, tooltip) {
        this.text = text
        this.tooltip = tooltip
    }
}

class PbsPokemonLevelMove {
    constructor(lvl, id) {
        this.lvl = lvl
        this.move = pbs_data.moves[id]
    }
}

class PbsPokemon {
    constructor(k, v, i) {
        setPbsBaseMembers(this, k, v)

        this.dex_num = i + 1
        this.root_evolution = this._Data.Prevo == undefined ? this : undefined
        this.is_starter = false // Note - this is setup later in data post-processing
        this.type1 = pbs_data.types[this._Data.Type1]
        this.type2 = this._Data.Type2 ? pbs_data.types[this._Data.Type2] : undefined
        this.abilities = this._Data.Abilities.map((x) => pbs_data.abilities[x])
        this.tribes = this._Data.Tribes.map((x) => pbs_data.tribes[x])
        this.bst = Object.values(this._Data.BaseStats).reduce((a, cv) => a + cv, 0)
        this.is_legend = this._Data.Flags?.some((x) => x == 'Legendary') ?? false
        this.is_first_stage = this._Data.Prevo == undefined && this._Data.Evolutions
        this.is_final_stage = this._Data.Prevo && this._Data.Evolutions == undefined
        this.has_no_evo_line = this._Data.Prevo == undefined && this._Data.Evolutions == undefined
        this.level_moves = this._Data.Moves?.map((x) => new PbsPokemonLevelMove(x.Lvl, x.ID)) ?? []
        this.teachable_moves = this._Data.LineMoves?.map((x) => pbs_data.moves[x]) ?? []
        this.evo_moves = this._Data.UponEvoMoves?.map((x) => pbs_data.moves[x]) ?? []
        this.all_moves = [...new Set([...this.level_moves.map((x) => x.move), ...this.teachable_moves, ...this.evo_moves])]
    }

    get img_icon() {
        return getPokemonIconImg(this._ID)
    }
}

class PbsTribe {
    constructor(k, v) {
        setPbsBaseMembers(this, k, v)
    }

    get capsule_element() {
        return new Capsule().setup(new TextWithTooltip(this._Data.Name, this._Data.Description), this)
    }
}

class PbsAbility {
    constructor(k, v) {
        setPbsBaseMembers(this, k, v)
    }

    get capsule_element() {
        return new Capsule().setup(new TextWithTooltip(this._Data.Name, this._Data.Description), this)
    }
}

class PbsType {
    static type_chart = {} // This is setup as `type_chart[user_type][target_type] = multiplier`
    static init(pbs_types) {
        pbs_types.forEach((x) => (this.type_chart[x._ID] = {}))
        pbs_types.filter((x) => x._Data.Resistances).forEach((x) => x._Data.Resistances.forEach((y) => (this.type_chart[y][x._ID] = 0.5)))
        pbs_types.filter((x) => x._Data.Immunities).forEach((x) => x._Data.Immunities.forEach((y) => (this.type_chart[y][x._ID] = 0)))
        pbs_types.filter((x) => x._Data.Weaknesses).forEach((x) => x._Data.Weaknesses.forEach((y) => (this.type_chart[y][x._ID] = 2)))
    }

    constructor(k, v) {
        setPbsBaseMembers(this, v.InternalName, v)
    }

    get img_icon() {
        return getTypeIcon(this._ID)
    }
}

class PbsMove {
    constructor(k, v) {
        setPbsBaseMembers(this, k, v)

        this.type = pbs_data.types[this._Data.Type]
    }

    get category_icon() {
        return getCategoryIcon(this._Data.Category)
    }
}

class FilterConfig {
    constructor(id, value, in_prog_reset_func, filter_func) {
        this.id = id
        this.value = value
        this.in_progress = in_prog_reset_func ? true : false
        this.in_prog_reset_func = in_prog_reset_func
        this.filter_func = filter_func // Filter funcs always indicate the value passes the filter (return true)
    }

    static {
        // Only get filter funcs, doesn't matter what value is passed as we won't be calling them here
        this.static_filter_functions_lookup = Object.fromEntries(
            Object.getOwnPropertyNames(FilterConfig)
                .filter((prop) => typeof FilterConfig[prop] === 'function' && FilterConfig[prop](0)?.id)
                .map((prop) => [FilterConfig[prop](0).id, FilterConfig[prop]]),
        )
    }

    static allToUrlQuery(filters) {}

    static fromUrlQuery(query) {}

    static PokemonGenerationFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Generation', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    return fv.includes(`${d._Data.Generation ?? -1}`)
            }

            return false
        })
    }

    static PokemonEvolutionFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Evolution', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    if (fv.includes('First') && d.is_first_stage) return true
                    if (fv.includes('Final') && d.is_final_stage) return true
                    if (fv.includes('Single') && d.has_no_evo_line) return true
                    break
            }

            return false
        })
    }

    static PokemonOnlyLegendsFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Only Legends', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    return fv.includes(true) && d.is_legend
            }

            return false
        })
    }

    static PokemonHideLegendsFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Hide Legends', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    return fv.includes(true) && !d.is_legend
            }

            return false
        })
    }

    static PokemonStartersOnlyFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Starters Only', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    return fv.includes(true) && d.is_starter
            }

            return false
        })
    }

    static PokemonSearchFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Pokemon Search', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    return fv.some((x) => d._Data.Name.toLowerCase().includes(x.toLowerCase()))
            }

            return false
        })
    }

    static AbilityPrimevalFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Primeval Ability', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsAbility:
                    return fv.includes(true) && d._Data.IsPrimeval
            }

            return false
        })
    }

    static AbilityNameFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Ability Name', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    const ability_names = d.abilities.map((a) => a._Data.Name.toLowerCase())
                    return fv.some((x) => ability_names.some((a) => a.includes(x.toLowerCase())))
                case PbsAbility:
                    return fv.some((x) => d._Data.Name.toLowerCase().includes(x.toLowerCase()))
            }

            return false
        })
    }

    static AbilityDescFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Ability Description', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    const ability_descs = d.abilities.map((a) => a._Data.Description.toLowerCase())
                    return fv.some((x) => ability_descs.some((a) => a.includes(x.toLowerCase())))
                case PbsAbility:
                    return fv.some((x) => d._Data.Description.toLowerCase().includes(x.toLowerCase()))
            }

            return false
        })
    }

    static MovePrimevalFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Primeval Move', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsMove:
                    return fv.includes(true) && d._Data.IsPrimeval
            }

            return false
        })
    }

    static MoveNameFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Move Name', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    const names = d.all_moves.map((x) => x._Data.Name.toLowerCase())
                    return fv.some((x) => names.some((y) => y.includes(x.toLowerCase())))
                case PbsMove:
                    return fv.some((x) => d._Data.Name.toLowerCase().includes(x.toLowerCase()))
            }

            return false
        })
    }

    static MoveDescFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Move Description', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    const names = d.all_moves.map((x) => x._Data.Description.toLowerCase())
                    return fv.some((x) => names.some((y) => y.includes(x.toLowerCase())))
                case PbsMove:
                    return fv.some((x) => d._Data.Description.toLowerCase().includes(x.toLowerCase()))
            }

            return false
        })
    }
}

document.addEventListener('DOMContentLoaded', () => getServerData())

let sprite_atlas_data = {}
let rx_data = {}
let pbs_data = {}
let local_data = {
    ignored_move_flags: [
        'CanProtect',
        'ForceSignature',
        'Uninvocable',
        'Staple',
        'HalfDamageToAllies',
        'AvatarSignature',
        'Empowered',
        'CanSnatch',
        'CanRandomCrit',
        'DoubleCritChance',
        'CanMagicCoat',
        'FakeRandomEffect',
    ],
    move_target_text_map: {
        NearOther: 'Near',
        User: '',
        None: '',
        AllNearOthers: 'All Near',
        AllNearFoes: 'All Near',
        UserAndAllies: 'User & Allies',
        NearAlly: 'Near',
        NearFoe: 'Near',
        Ally: '',
        ClosestNearFoe: '',
        AllBattlers: 'All',
        UserSide: '',
        BothSides: '',
        FoeSide: '',
        UserOrNearOther: '',
    },
}

async function getServerData() {
    const loading_splash = document.getElementById('loading_splash')

    function convertPbsDataListToHash(data) {
        return Object.fromEntries(data.map((x) => [x._ID, x]))
    }

    let server_data = undefined
    async function handleData() {
        const response = await fetch('data.json')

        server_data = await response.json()
        rx_data = server_data.RxData

        // Build all the PBS data classes
        pbs_data.generations = [...new Set(Object.values(server_data.PBS.Pokemon).map((x) => x.Generation))].filter((x) => x).sort()
        pbs_data.types = convertPbsDataListToHash(Object.entries(server_data.PBS.Types).map(([k, v]) => new PbsType(k, v)))
        pbs_data.abilities = convertPbsDataListToHash(Object.entries(server_data.PBS.Abilities).map(([k, v]) => new PbsAbility(k, v)))
        pbs_data.tribes = convertPbsDataListToHash(Object.entries(server_data.PBS.Tribes).map(([k, v]) => new PbsTribe(k, v)))
        pbs_data.moves = convertPbsDataListToHash(Object.entries(server_data.PBS.Moves).map(([k, v]) => new PbsMove(k, v)))
        pbs_data.pokemon = convertPbsDataListToHash(Object.entries(server_data.PBS.Pokemon).map(([k, v], i) => new PbsPokemon(k, v, i)))

        // Post-Processing
        PbsType.init(Object.values(pbs_data.types))

        const evolutions_to_process = Object.values(pbs_data.pokemon).filter((x) => x.root_evolution)
        while (evolutions_to_process.length > 0) {
            const mon = evolutions_to_process.pop()
            if (mon._Data.Evolutions) {
                mon._Data.Evolutions.forEach((evo) => {
                    pbs_data.pokemon[evo.Pokemon].root_evolution = mon.root_evolution
                    evolutions_to_process.push(pbs_data.pokemon[evo.Pokemon])
                })
            }
        }

        const starters = new Set(
            Object.values(server_data.PBS.Encounters)
                .filter((x) => x.Name.includes('Starter'))
                .flatMap((x) => x.Tables[0].Encounters.map((y) => y.Pokemon)),
        )
        Object.values(pbs_data.pokemon)
            .filter((x) => starters.has(x.root_evolution._ID))
            .forEach((x) => (x.is_starter = true))
    }

    try {
        await handleData()
        sprite_atlas_data = await sliceAtlasInBatches(server_data.Atlas.SpriteAtlas)

        loading_splash.remove()
        document.body.appendChild(new DexPage())
    } catch (error) {
        console.log(`Data load error: ${error}`)
    }
}

function isPrimevalTextDisplay(value) {
    return value ? '✓' : ''
}

function setPbsBaseMembers(self, k, v) {
    // No a base class cannot be used because the build script might not put the base class first in src.js
    // Yes, this is very janky, but so is writing this website in pure JS
    self._ID = k
    self._Data = v
}

