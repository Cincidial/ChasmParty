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
                new FilterConfig('Generation', this.generation_select.value, (d, fv) => {
                    switch (d.constructor) {
                        case PbsPokemon:
                            return fv.includes(`${d._Data.Generation ?? -1}`)
                    }

                    return false
                }),
            )
        }

        if (this.evolution_select.value != 'Any') {
            filters.push(
                new FilterConfig('Evolution', this.evolution_select.value, (d, fv) => {
                    switch (d.constructor) {
                        case PbsPokemon:
                            if (fv.includes('First') && d.is_first_stage) return true
                            if (fv.includes('Final') && d.is_final_stage) return true
                            if (fv.includes('Single') && d.has_no_evo_line) return true
                            break
                    }

                    return false
                }),
            )
        }

        if (this.only_legendary_checkbox.checked) {
            filters.push(
                new FilterConfig('Only Legends', true, (d, fv) => {
                    switch (d.constructor) {
                        case PbsPokemon:
                            return fv.includes(true) && d.is_legend
                    }
                    return false
                }),
            )
        }

        if (this.hide_legendary_checkbox.checked) {
            filters.push(
                new FilterConfig('Hide Legends', true, (d, fv) => {
                    switch (d.constructor) {
                        case PbsPokemon:
                            return fv.includes(true) && !d.is_legend
                    }

                    return false
                }),
            )
        }

        if (this.starter_only_checkbox.checked) {
            filters.push(
                new FilterConfig('Starters Only', true, (d, fv) => {
                    switch (d.constructor) {
                        case PbsPokemon:
                            return fv.includes(true) && d.is_starter
                    }
                    return false
                }),
            )
        }

        if (this.search_dropdown.value) {
            filters.push(
                new FilterConfig('Pokemon Search', this.search_dropdown.value, (d, fv) => {
                    switch (d.constructor) {
                        case PbsPokemon:
                            return fv.some((x) => d._Data.Name.toLowerCase().includes(x.toLowerCase()))
                    }
                    return false
                }),
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

    getFilters() {
        const filters = []
        if (this.is_primival_checkbox.checked) {
            filters.push(
                new FilterConfig('Primeval Ability', true, (d, fv) => {
                    switch (d.constructor) {
                        case PbsAbility:
                            return fv.includes(true) && d._Data.IsPrimeval
                    }
                    return false
                }),
            )
        }

        if (this.name_dropdown.value) {
            filters.push(
                new FilterConfig('Abilty Name', this.name_dropdown.value, (d, fv) => {
                    switch (d.constructor) {
                        case PbsPokemon:
                            const ability_names = d.abilities.map((a) => a._Data.Name.toLowerCase())
                            return fv.some((x) => ability_names.some((a) => a.includes(x.toLowerCase())))
                    }
                    return false
                }),
            )
        }

        if (this.desc_input.value) {
            filters.push(
                new FilterConfig('Ability Description', this.desc_input.value, (d, fv) => {
                    switch (d.constructor) {
                        case PbsPokemon:
                            const ability_descs = d.abilities.map((a) => a._Data.Description.toLowerCase())
                            return fv.some((x) => ability_descs.some((a) => a.includes(x.toLowerCase())))
                    }
                    return false
                }),
            )
        }

        return filters
    }
}
customElements.define('party-ability-filter-form', AbilityFilterForm)

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

                capsule.setup(text, x, x.in_progress ? null : remove_callback)

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

function getAtlasImg(x, y, w, h, filename) {
    const atlas_img = new AtlasImg()
    const img = atlas_img.getElementById('img')
    img.style = `width: ${w}px; height: ${h}px; background-image: url('${filename}'); background-position: -${x}px -${y}px;`

    return atlas_img
}

function getPokemonIconImg(id) {
    const w = sprite_atlas_data.Icon.w
    const h = sprite_atlas_data.Icon.h
    const data = sprite_atlas_data.Icon[id]

    // TODO: Show missing icon if data is not found
    return getAtlasImg(data.x, data.y, w, h, sprite_atlas_data.Artifact)
}

function getPokemonFrontImg(id) {
    const w = sprite_atlas_data.Front.w
    const h = sprite_atlas_data.Front.h
    const data = sprite_atlas_data.Front[id]

    // TODO: Show missing icon if data is not found
    return getAtlasImg(data.x, data.y, w, h, sprite_atlas_data.Artifact)
}

class FilterTarget {
    constructor(checkbox_id, data, gen_element_func) {
        this.checkbox_id = checkbox_id
        this.checkbox_element = null
        this.data = data
        this.gen_element_func = gen_element_func
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

        this.filter_options = [
            { id: 'filter_option_pokemon', new_form_func: () => new PokemonFilterForm(), in_progress_form: null },
            { id: 'filter_option_ability', new_form_func: () => new AbilityFilterForm(), in_progress_form: null },
            { id: 'filter_option_move', new_form_func: () => new PokemonFilterForm(), in_progress_form: null },
        ]
        this.filter_targets = [
            new FilterTarget('filter_show_pokemon_checkbox', Object.values(pbs_data.pokemon), (x) => getPokemonIconImg(x._ID)),
            new FilterTarget('filter_show_abilities_checkbox', Object.values(pbs_data.pokemon), (x) => getPokemonIconImg(x._ID)),
            new FilterTarget('filter_show_moves_checkbox', Object.values(pbs_data.pokemon), (x) => getPokemonIconImg(x._ID)),
        ]

        this.current_filter_opt = null
        this.applied_filters = []

        this.add_filter_button.onclick = () => this.addCurrentFilter()
        this.filter_options.forEach((opt) => (this.getElementById(opt.id).onclick = (_) => this.setFilterForm(opt)))
        this.filter_targets.forEach((ft) => {
            ft.checkbox_element = this.getElementById(ft.checkbox_id)
            ft.checkbox_element.onchange = () => this.applyAllFiltering()
        })

        this.applyFilters([])
        this.setFilterForm(this.filter_options[0])
    }

    applyFilters(filter_configs) {
        // Filters of the same ID should be grouped as ORs, different filters should be applied as ANDs
        const grouped_filters = filter_configs.reduce((acc, data) => {
            const list = (acc[data.id] ??= [])
            list.push(data)

            return acc
        }, {})

        this.filtered_data_list.replaceChildren(
            ...this.filter_targets
                .filter((ft) => ft.checkbox_element.checked)
                .flatMap((ft) =>
                    ft.data
                        .filter((d) => {
                            if (grouped_filters.length == 0) return true

                            for (const grouped_filter of Object.values(grouped_filters)) {
                                const fv = grouped_filter.map((x) => x.value)
                                if (!grouped_filter[0].filter_func(d, fv)) return false
                            }

                            return true
                        })
                        .map((x) => ft.gen_element_func(x)),
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

    setFilterForm(filter_opt) {
        if (this.current_filter_opt == filter_opt) return

        if (this.current_filter_opt != null) this.getElementById(this.current_filter_opt.id).active = false
        this.getElementById(filter_opt.id).active = true

        filter_opt.in_progress_form = filter_opt.in_progress_form ?? filter_opt.new_form_func()
        filter_opt.in_progress_form.on_change = () => this.applyAllFiltering()

        this.current_filter_opt = filter_opt
        this.filter_form.replaceChildren(filter_opt.in_progress_form)
        this.applyAllFiltering()
    }

    applyAllFiltering() {
        const in_progress_filters = this.current_filter_opt.in_progress_form.getFilters()
        in_progress_filters.forEach((x) => (x.in_progress = true))

        this.applyFilters([...this.applied_filters, ...in_progress_filters])
    }

    addCurrentFilter() {
        this.applied_filters.push(...this.current_filter_opt.in_progress_form.getFilters())
        this.applyFilters(this.applied_filters)

        this.current_filter_opt.in_progress_form = this.current_filter_opt.new_form_func()
        this.current_filter_opt.in_progress_form.on_change = () => this.applyAllFiltering()

        this.filter_form.replaceChildren(this.current_filter_opt.in_progress_form)
    }

    removeFilter(filter_config) {
        this.applied_filters = this.applied_filters.filter((x) => x !== filter_config)
        this.applyAllFiltering()
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
    constructor(k, v) {
        setPbsBaseMembers(this, k, v)
        this.root_evolution = this._Data.Prevo == undefined ? this : undefined
        this.is_starter = false
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
}

class PbsAbility {
    constructor(k, v) {
        setPbsBaseMembers(this, k, v)
    }
}

class FilterConfig {
    constructor(id, value, filter_func) {
        this.id = id
        this.value = value
        this.in_progress = false
        this.filter_func = filter_func // Filter funcs always indicate the value passes the filter (return true)
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
        pbs_data.pokemon = convertPbsDataListToHash(Object.entries(server_data.PBS.Pokemon).map((kv) => new PbsPokemon(kv[0], kv[1])))
        pbs_data.abilities = convertPbsDataListToHash(Object.entries(server_data.PBS.Abilities).map((kv) => new PbsAbility(kv[0], kv[1])))

        // Post-Processing
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

