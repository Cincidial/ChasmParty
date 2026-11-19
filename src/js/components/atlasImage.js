class AtlasImg extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-atlas-img-template')
    }
}
customElements.define('party-atlas-img', AtlasImg)

function getAtlasImg(x, y, w, h, atlas_img, filename, scale = 1.0) {
    const element = new AtlasImg()
    const img = element.getElementById('img')
    const sizeX = (atlas_img.naturalWidth / w) * 100
    const sizeY = (atlas_img.naturalHeight / h) * 100
    const posX = atlas_img.naturalWidth === w ? 0 : (x / (atlas_img.naturalWidth - w)) * 100
    const posY = atlas_img.naturalHeight === h ? 0 : (y / (atlas_img.naturalHeight - h)) * 100

    img.style = `width: ${w * scale}px; height: ${h * scale}px; background-image: url('${filename}');`
    img.style.backgroundSize = `${sizeX}% ${sizeY}%`
    img.style.backgroundPosition = `${posX}% ${posY}%`

    return element
}

function getTypeIcon(id, scale = 0.25) {
    const w = sprite_atlas_data.Type.w
    const h = sprite_atlas_data.Type.h
    const data = sprite_atlas_data.Type[id]

    return getAtlasImg(data.x, data.y, w, h, sprite_atlas_img, sprite_atlas_data.Artifact, scale)
}

function getPokemonIconImg(id) {
    const w = sprite_atlas_data.Icon.w
    const h = sprite_atlas_data.Icon.h
    const data = sprite_atlas_data.Icon[id] ?? sprite_atlas_data.Icon['000']

    return getAtlasImg(data.x, data.y, w, h, sprite_atlas_img, sprite_atlas_data.Artifact)
}

function getPokemonFrontImg(id) {
    const w = sprite_atlas_data.Front.w
    const h = sprite_atlas_data.Front.h
    const data = sprite_atlas_data.Front[id] ?? sprite_atlas_data.Front['000']

    return getAtlasImg(data.x, data.y, w, h, sprite_atlas_img, sprite_atlas_data.Artifact)
}
