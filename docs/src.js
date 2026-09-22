function getAtlasImg(x, y, w, h, filename) {
    const template = new Template('atlas-img-template')
    const img = template.node.getElementById('img')
    img.style = `width: ${w}px; height: ${h}px; background-image: url('${filename}'); background-position: -${x}px -${y}px;`

    return template
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
// Named with '_' so that it's always the first file compiled

document.addEventListener('DOMContentLoaded', () => getBuildData())

var compiled_data
var sprite_atlas_img

async function getBuildData() {
    const loadingSplash = getLoadingSplash()
    loadingSplash.addToDom()

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
            loadingSplash.removeFromDom()
            getPokemonFrontImg('CHARMANDER').addToDom()
        }).catch((err) => console.log(`Data load error: ${err}`))
    } catch (error) {
        console.error(error.message)
    }
}
function getLoadingSplash() {
    return new Template('loading-splash-template')
}
class Template {
    constructor(template_name) {
        this.node = document.getElementById(template_name).content.cloneNode(true)
        this.root = this.node.querySelector(':not(style)')
    }

    getElementById(id) {
        return this.node.getElementById(id)
    }

    addToDom() {
        document.body.appendChild(this.node)
    }

    removeFromDom() {
        this.root.remove()
    }
}
