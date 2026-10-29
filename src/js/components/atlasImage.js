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
