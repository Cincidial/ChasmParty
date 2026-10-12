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
