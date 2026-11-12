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
    const data = sprite_atlas_data.Icon[id] ?? sprite_atlas_data.Icon['000']

    return getAtlasImg(data.x, data.y, w, h, sprite_atlas_data.Artifact)
}

function getPokemonFrontImg(id) {
    const w = sprite_atlas_data.Front.w
    const h = sprite_atlas_data.Front.h
    const data = sprite_atlas_data.Front[id] ?? sprite_atlas_data.Front['000']

    return getAtlasImg(data.x, data.y, w, h, sprite_atlas_data.Artifact)
}
