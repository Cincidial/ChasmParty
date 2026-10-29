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

class LoadingSplash extends HTMLElement {
    constructor() {
        super()
        setupElement(this, "party-loading-splash-template")
    }
}
customElements.define("party-loading-splash", LoadingSplash)

class FilterGroupDisplay extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-filter-group-display-template')

        this.header_div = this.getElementById('header_div')
        this.data_div = this.getElementById('data_div')
    }

    setup(group_name, values) {
        this.header_div.replaceChildren(group_name)
        this.data_div.replaceChildren(Object.entries(values).map((kv) => `${kv[0]}: ${kv[1].values.join(',')}`))
    }
}
customElements.define('party-filter-group-display', FilterGroupDisplay)

function setupElement(element, templateId) {
    const template = document.getElementById(templateId).content
    const node = document.importNode(template, true)
    
    element.root = element.attachShadow({mode: 'open'})
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
    const w = server_data.Atlas.SpriteAtlas.Icon.w
    const h = server_data.Atlas.SpriteAtlas.Icon.h
    const data = server_data.Atlas.SpriteAtlas.Icon[id]
    return getAtlasImg(data.x, data.y, w, h, server_data.Atlas.SpriteAtlas.Artifact)
}

function getPokemonFrontImg(id) {
    const w = server_data.Atlas.SpriteAtlas.Front.w
    const h = server_data.Atlas.SpriteAtlas.Front.h
    const data = server_data.Atlas.SpriteAtlas.Front[id]
    return getAtlasImg(data.x, data.y, w, h, server_data.Atlas.SpriteAtlas.Artifact)
}

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

class FilterOption extends HTMLElement {
    static get observedAttributes() {
        return ['key']
    }

    constructor() {
        super()
        setupElement(this, 'party-filter-option-template')

        this.header = this.getElementById('header')
    }

    set onclick(func) {
        this.header.onclick = () => func(this.key)
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

    set onSelect(func) {
        this.list.addEventListener('input', (e) => func(e.target.value))
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

class FilterConfig {
    constructor(id, group, value) {
        this.id = id
        this.group = group
        this.value = value
        this.funcs = {} // Filter funcs always indicate the value passes the filter (return true)
    }

    setMonFunc(func) {
        this.funcs[DexPage.FILTER_FUNC_POKEMON] = func
        return this
    }
}

document.addEventListener('DOMContentLoaded', () => getServerData())

var server_data
var sprite_atlas_img
var local_data = {}

async function getServerData() {
    const loadingSplash = document.getElementById('loadingSplash')

    async function handleData() {
        const response = await fetch('data.json')
        server_data = await response.json()
        globalBuildLocalData()
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

function globalBuildLocalData() {
    local_data.generations = [...new Set(Object.values(server_data.PBS.Pokemon).map((x) => x.Generation))].filter((x) => x).sort()
    local_data.starters = new Set(
        Object.values(server_data.PBS.Encounters)
            .filter((x) => x.Name.includes('Starter'))
            .flatMap((x) => x.Tables[0].Encounters.map((y) => y.Pokemon)),
    )

    local_data.evolution_roots = Object.fromEntries(
        Object.entries(server_data.PBS.Pokemon)
            .filter((kv) => kv[1].Prevo == undefined)
            .map((kv) => [kv[0], kv[0]]),
    )
    const evolutions_to_process = Object.keys(local_data.evolution_roots)
    while (evolutions_to_process.length > 0) {
        const processing_mon_key = evolutions_to_process.pop()
        const root = local_data.evolution_roots[processing_mon_key]
        const mon = server_data.PBS.Pokemon[processing_mon_key]

        if (mon.Evolutions) {
            mon.Evolutions.forEach((evo) => {
                local_data.evolution_roots[evo.Pokemon] = root
                evolutions_to_process.push(evo.Pokemon)
            })
        }
    }
}

function globalGetPokemon(filter) {
    const pokemon = Object.entries(server_data.PBS.Pokemon)
    return filter ? pokemon.filter((kv) => filter(kv[0], kv[1])) : pokemon
}

function globalIsLegend(pokemon_id) {
    const flags = server_data.PBS.Pokemon[pokemon_id].Flags

    if (flags == undefined) return false
    if (!Array.isArray(flags)) return flags == 'Legendary'

    return flags.some((x) => x == 'Legendary')
}

function globalIsStarter(pokemon_id) {
    return local_data.starters.has(local_data.evolution_roots[pokemon_id])
}

