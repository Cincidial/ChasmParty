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
            filters.push(
                new FilterConfig(
                    'Generation',
                    this.generation_select.value,
                    (d, fv) => {
                        switch (d.constructor) {
                            case PbsPokemon:
                                return fv.includes(`${d._Data.Generation ?? -1}`)
                        }

                        return false
                    },
                    () => (this.generation_select.value = 'Any'),
                ),
            )
        }

        if (this.evolution_select.value != 'Any') {
            filters.push(
                new FilterConfig(
                    'Evolution',
                    this.evolution_select.value,
                    (d, fv) => {
                        switch (d.constructor) {
                            case PbsPokemon:
                                if (fv.includes('First') && d.is_first_stage) return true
                                if (fv.includes('Final') && d.is_final_stage) return true
                                if (fv.includes('Single') && d.has_no_evo_line) return true
                                break
                        }

                        return false
                    },
                    () => (this.evolution_select.value = 'Any'),
                ),
            )
        }

        if (this.only_legendary_checkbox.checked) {
            filters.push(
                new FilterConfig(
                    'Only Legends',
                    true,
                    (d, fv) => {
                        switch (d.constructor) {
                            case PbsPokemon:
                                return fv.includes(true) && d.is_legend
                        }
                        return false
                    },
                    () => (this.only_legendary_checkbox.checked = false),
                ),
            )
        }

        if (this.hide_legendary_checkbox.checked) {
            filters.push(
                new FilterConfig(
                    'Hide Legends',
                    true,
                    (d, fv) => {
                        switch (d.constructor) {
                            case PbsPokemon:
                                return fv.includes(true) && !d.is_legend
                        }

                        return false
                    },
                    () => (this.hide_legendary_checkbox.checked = false),
                ),
            )
        }

        if (this.starter_only_checkbox.checked) {
            filters.push(
                new FilterConfig(
                    'Starters Only',
                    true,
                    (d, fv) => {
                        switch (d.constructor) {
                            case PbsPokemon:
                                return fv.includes(true) && d.is_starter
                        }
                        return false
                    },
                    () => (this.starter_only_checkbox.checked = false),
                ),
            )
        }

        if (this.search_dropdown.value) {
            filters.push(
                new FilterConfig(
                    'Pokemon Search',
                    this.search_dropdown.value,
                    (d, fv) => {
                        switch (d.constructor) {
                            case PbsPokemon:
                                return fv.some((x) => d._Data.Name.toLowerCase().includes(x.toLowerCase()))
                        }
                        return false
                    },
                    () => (this.search_dropdown.value = ''),
                ),
            )
        }

        return filters
    }
}
customElements.define('party-pokemon-filter-form', PokemonFilterForm)

class LoadingSplash extends HTMLElement {
    constructor() {
        super()
        setupElement(this, "party-loading-splash-template")
    }
}
customElements.define("party-loading-splash", LoadingSplash)

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

class AbilityFilterForm extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-ability-filter-form-template')

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

    get sort_id() {
        return undefined
    }

    set sort_id(id) {}

    getFilters() {
        const filters = []
        if (this.is_primival_checkbox.checked) {
            filters.push(
                new FilterConfig(
                    'Primeval Ability',
                    true,
                    (d, fv) => {
                        switch (d.constructor) {
                            case PbsAbility:
                                return fv.includes(true) && d._Data.IsPrimeval
                        }
                        return false
                    },
                    () => (this.is_primival_checkbox.checked = false),
                ),
            )
        }

        if (this.name_dropdown.value) {
            filters.push(
                new FilterConfig(
                    'Abilty Name',
                    this.name_dropdown.value,
                    (d, fv) => {
                        switch (d.constructor) {
                            case PbsPokemon:
                                const ability_names = d.abilities.map((a) => a._Data.Name.toLowerCase())
                                return fv.some((x) => ability_names.some((a) => a.includes(x.toLowerCase())))
                        }
                        return false
                    },
                    () => (this.name_dropdown.value = ''),
                ),
            )
        }

        if (this.desc_input.value) {
            filters.push(
                new FilterConfig(
                    'Ability Description',
                    this.desc_input.value,
                    (d, fv) => {
                        switch (d.constructor) {
                            case PbsPokemon:
                                const ability_descs = d.abilities.map((a) => a._Data.Description.toLowerCase())
                                return fv.some((x) => ability_descs.some((a) => a.includes(x.toLowerCase())))
                        }
                        return false
                    },
                    () => (this.name_dropdown.value = ''),
                ),
            )
        }

        return filters
    }
}
customElements.define('party-ability-filter-form', AbilityFilterForm)

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
                const capsule = new Capsule()
                var text = x.value

                if (text === true) {
                    text = 'True'
                } else if (text === false) {
                    text = 'False'
                }

                capsule.setup(text, x, remove_callback)

                return capsule
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

function getAtlasImg(x, y, w, h, atlas_img, filename, scale = 1.0, tooltip = '') {
    const element = new AtlasImg()
    const img = element.getElementById('img')
    const sizeX = (atlas_img.naturalWidth / w) * 100
    const sizeY = (atlas_img.naturalHeight / h) * 100
    const posX = atlas_img.naturalWidth === w ? 0 : (x / (atlas_img.naturalWidth - w)) * 100
    const posY = atlas_img.naturalHeight === h ? 0 : (y / (atlas_img.naturalHeight - h)) * 100

    img.style = `width: ${w * scale}px; height: ${h * scale}px; background-image: url('${filename}');`
    img.style.backgroundSize = `${sizeX}% ${sizeY}%`
    img.style.backgroundPosition = `${posX}% ${posY}%`
    img.title = tooltip

    return element
}

function getTypeIcon(id, scale = 0.25) {
    const w = sprite_atlas_data.Type.w
    const h = sprite_atlas_data.Type.h
    const data = sprite_atlas_data.Type[id]

    return getAtlasImg(data.x, data.y, w, h, sprite_atlas_img, sprite_atlas_data.Artifact, scale, pbs_data.types[id]._Data.Name)
}

function getPokemonIconImg(id) {
    const w = sprite_atlas_data.Icon.w
    const h = sprite_atlas_data.Icon.h
    const data = sprite_atlas_data.Icon[id] ?? sprite_atlas_data.Icon['000']

    return getAtlasImg(data.x, data.y, w, h, sprite_atlas_img, sprite_atlas_data.Artifact, 1.0, pbs_data.pokemon[id]._Data.Name)
}

function getPokemonFrontImg(id) {
    const w = sprite_atlas_data.Front.w
    const h = sprite_atlas_data.Front.h
    const data = sprite_atlas_data.Front[id] ?? sprite_atlas_data.Front['000']

    return getAtlasImg(data.x, data.y, w, h, sprite_atlas_img, sprite_atlas_data.Artifact, 1.0, pbs_data.pokemon[id]._Data.Name)
}

class TableColumn {
    constructor(header_name, element_func, sort_value_func = null) {
        this.header_name = header_name
        this.element_func = element_func
        this.sort_value_func = sort_value_func
        this.th = null
    }
}

class Table extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-table-template')

        this.table = this.getElementById('table')
        this.thead = this.getElementById('thead')
        this.tbody = this.getElementById('tbody')

        this.table_column_list = []
        this.data = null
        this.sort_descending = false
        this.sort_col = null
    }

    setData(data) {
        this.data = data
        this.updateBody()

        return this
    }

    setup(table_column_list) {
        this.table_column_list = table_column_list
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
                        this.updateBody()
                    }
                }

                col.th = th
                return th
            }),
        )

        return this
    }

    updateBody() {
        const sort_value_func = this.sort_col.sort_value_func
        this.tbody.replaceChildren(
            ...this.data
                .sort((a, b) => {
                    const value_a = sort_value_func(a)
                    const value_b = sort_value_func(b)

                    return (value_a === value_b ? 0 : value_a > value_b ? 1 : -1) * (this.sort_descending ? -1 : 1)
                })
                .flatMap((d) => {
                    const row = this.tbody.insertRow()
                    row.classList.add('dataRow')
                    row.replaceChildren(
                        ...this.table_column_list.map((col) => {
                            const cell = row.insertCell()
                            cell.replaceChildren(col.element_func(d))

                            return cell
                        }),
                    )

                    return row
                }),
        )
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
            new FilterFormCard(this, 'filter_option_pokemon', () => new PokemonFilterForm()),
            new FilterFormCard(this, 'filter_option_ability', () => new AbilityFilterForm()),
            new FilterFormCard(this, 'filter_option_move', () => new PokemonFilterForm()),
        ]
        this.target_data_list = [
            new TargetData(
                this,
                'filter_show_pokemon',
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
                    new TableColumn(
                        'BST',
                        (x) => x.bst,
                        (x) => x.bst,
                    ),
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
                ]),
                Object.values(pbs_data.pokemon),
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
            .forEach((x) => {
                x.getFilters().forEach((x) => {
                    x.in_progress = false
                    this.applied_filters.push(x)
                })
                x.in_progress_form = null
            })

        this.current_filter_form_card.in_progress_form = this.current_filter_form_card.new_form_func()
        this.current_filter_form_card.in_progress_form.on_change = () => this.updateDisplay()

        this.filter_form.replaceChildren(this.current_filter_form_card.in_progress_form)
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
        return this.list.value
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

        this.text_display = this.getElementById('text_display')
    }

    setup(text, data, on_remove_callback = null) {
        this.text_display.innerHTML = text
        this.data = data

        if (on_remove_callback !== null) {
            this.setAttribute('removable', '')
            this.onclick = () => on_remove_callback(this.data)
        }
    }
}
customElements.define('party-capsule', Capsule)

class PbsPokemon {
    constructor(k, v, i) {
        setPbsBaseMembers(this, k, v)

        this.dex_num = i + 1
        this.root_evolution = this._Data.Prevo == undefined ? this : undefined
        this.is_starter = false
        this.type1 = pbs_data.types[this._Data.Type1]
        this.type2 = this._Data.Type2 ? pbs_data.types[this._Data.Type2] : undefined
        this.bst = Object.values(this._Data.BaseStats).reduce((a, cv) => a + cv, 0)
    }

    get is_legend() {
        return this._Data.Flags?.some((x) => x == 'Legendary') ?? false
    }

    get abilities() {
        return this._Data.Abilities.map((x) => pbs_data.abilities[x])
    }

    get is_first_stage() {
        return this._Data.Prevo == undefined && this._Data.Evolutions
    }

    get is_final_stage() {
        return this._Data.Prevo && this._Data.Evolutions == undefined
    }

    get has_no_evo_line() {
        return this._Data.Prevo == undefined && this._Data.Evolutions == undefined
    }

    get img_icon() {
        return getPokemonIconImg(this._ID)
    }
}

class PbsAbility {
    constructor(k, v) {
        setPbsBaseMembers(this, k, v)
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

class FilterConfig {
    constructor(id, value, filter_func, in_prog_reset_func) {
        this.id = id
        this.value = value
        this.in_progress = true
        this.filter_func = filter_func // Filter funcs always indicate the value passes the filter (return true)
        this.in_prog_reset_func = in_prog_reset_func
    }
}

document.addEventListener('DOMContentLoaded', () => getServerData())

var sprite_atlas_img
var sprite_atlas_data = {}
var rx_data = {}
var pbs_data = {}

async function getServerData() {
    const loadingSplash = document.getElementById('loadingSplash')

    function convertPbsDataListToHash(data) {
        return Object.fromEntries(data.map((x) => [x._ID, x]))
    }

    async function handleData() {
        const response = await fetch('data.json')
        const server_data = await response.json()

        sprite_atlas_data = server_data.Atlas.SpriteAtlas
        rx_data = server_data.RxData

        // Build all the PBS data classes
        pbs_data.generations = [...new Set(Object.values(server_data.PBS.Pokemon).map((x) => x.Generation))].filter((x) => x).sort()
        pbs_data.types = convertPbsDataListToHash(Object.entries(server_data.PBS.Types).map(([k, v]) => new PbsType(k, v)))
        pbs_data.pokemon = convertPbsDataListToHash(Object.entries(server_data.PBS.Pokemon).map(([k, v], i) => new PbsPokemon(k, v, i)))
        pbs_data.abilities = convertPbsDataListToHash(Object.entries(server_data.PBS.Abilities).map(([k, v]) => new PbsAbility(k, v)))

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
        const data_promise = handleData()

        sprite_atlas_img = new Image()
        const sprite_atlas_promise = new Promise((resolve, reject) => {
            sprite_atlas_img.onload = resolve()
            sprite_atlas_img.onerror = reject(new Error(`Failed to load sprite atlas`))
            sprite_atlas_img.src = 'sprite_atlas.png'
        })

        Promise.all([data_promise, sprite_atlas_promise])
            .then(() => {
                loadingSplash.remove()
                document.body.appendChild(new DexPage())
            })
            .catch((err) => console.log(`Data load error: ${err}`))
    } catch (error) {
        console.error(error.message)
    }
}

function setPbsBaseMembers(self, k, v) {
    // No a base class cannot be used because the build script might not put the base class first in src.js
    // Yes, this is very janky, but so is writing this website in pure JS
    self._ID = k
    self._Data = v
}

