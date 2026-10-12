class LoadingSplash extends HTMLElement {
    constructor() {
        super()
        setupElement(this, "loading-splash-template")
    }
}
customElements.define("loading-splash", LoadingSplash)

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
        setupElement(this, "atlas-img-template")
    }
}
customElements.define("atlas-img", AtlasImg)

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
        setupElement(this, "dex-page-template")

        this.test = this.getElementById("test")
        this.test.populate(["a", "b", "c"])
        this.test.onSelect((value) => console.log(value))
    }
}
customElements.define("dex-page", DexPage)

class Dropdown extends HTMLElement {
    static get observedAttributes() {
        return ["placeholder"]
    }

    constructor() {
        super()
        setupElement(this, "dropdown-template")

        this.datalist = this.getElementById("data")
        this.list = this.getElementById("list")
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "placeholder" && oldValue != newValue) {
            this.list.setAttribute("placeholder", newValue || "")
        }
    }

    populate(options) {
        this.datalist.replaceChildren(
            ...options.map((option) => {
                var element = document.createElement("option")
                element.value = option
                return element
            }),
        )
    }

    onSelect(func) {
        this.list.addEventListener("input", (e) => func(e.target.value))
    }
}
customElements.define("drop-down", Dropdown)

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
