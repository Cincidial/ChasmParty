class LoadingSplash extends HTMLElement {
    constructor() {
        super()
        setupElement(this, "party-loading-splash-template")
    }
}
customElements.define("party-loading-splash", LoadingSplash)

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
        setupElement(this, "party-atlas-img-template")
    }
}
customElements.define("party-atlas-img", AtlasImg)

function getAtlasImg(x, y, w, h, filename) {
    const atlasImg = new AtlasImg()
    const img = atlasImg.getElementById("img")
    img.style = `width: ${w}px; height: ${h}px; background-image: url('${filename}'); background-position: -${x}px -${y}px;`

    return atlasImg
}

function getPokemonIconImg(id) {
    const w = compiled_data.Atlas.sprite_atlas.icon.w
    const h = compiled_data.Atlas.sprite_atlas.icon.h
    const data = compiled_data.Atlas.sprite_atlas.icon[id]
    return getAtlasImg(data.x, data.y, w, h, compiled_data.Atlas.sprite_atlas.artifact)
}

function getPokemonFrontImg(id) {
    const w = compiled_data.Atlas.sprite_atlas.front.w
    const h = compiled_data.Atlas.sprite_atlas.front.h
    const data = compiled_data.Atlas.sprite_atlas.front[id]
    return getAtlasImg(data.x, data.y, w, h, compiled_data.Atlas.sprite_atlas.artifact)
}

class DexPage extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-dex-page-template')

        this.test = this.getElementById('test')
        this.test.populate(['a', 'b', 'c'])
        this.test.onSelect = (value) => console.log(value)

        this.filterOptions = [
            this.getElementById('filterOptionPokemon'),
            this.getElementById('filterOptionAbility'),
            this.getElementById('filterOptionMove'),
        ]
        this.filterOptions.forEach((opt) => {
            opt.onclick = (key) => console.log(key)
        })
    }
}
customElements.define('party-dex-page', DexPage)

class HeaderOption extends HTMLElement {
    static get observedAttributes() {
        return ['key']
    }

    constructor() {
        super()
        setupElement(this, 'party-header-option-template')

        this.header = this.getElementById('header')
    }

    set onclick(func) {
        this.header.onclick = () => func(this.key)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'key') {
            this.key = newValue
        }
    }
}
customElements.define('party-header-option', HeaderOption)

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

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'placeholder') {
            this.list.setAttribute('placeholder', newValue || '')
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

document.addEventListener('DOMContentLoaded', () => getBuildData())

var compiled_data
var sprite_atlas_img

async function getBuildData() {
    const loadingSplash = document.getElementById('loadingSplash')

    async function handleData() {
        const response = await fetch('data.json')
        compiled_data = await response.json()
    }

    try {
        const data_promise = handleData()

        sprite_atlas_img = new Image()
        const sprite_atlas_promise = new Promise((resolve, reject) => {
            sprite_atlas_img.onload = resolve()
            sprite_atlas_img.onerror = reject(new Error(`Failed to load sprite atlas`))
            sprite_atlas_img.src = 'sprite_atlas.png'
        })

        Promise.all([data_promise, sprite_atlas_promise]).then(() => {
            loadingSplash.remove()
            document.body.appendChild(new DexPage())
        }).catch((err) => console.log(`Data load error: ${err}`))
    } catch (error) {
        console.error(error.message)
    }
}
