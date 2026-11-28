class AtlasImg extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-atlas-img-template')
    }
}
customElements.define('party-atlas-img', AtlasImg)

function getAtlasImg(img_data, scale = 1.0, tooltip = '') {
    const element = new AtlasImg()
    const img = element.getElementById('img')

    img.width = Math.ceil(img_data.w * scale)
    img.height = Math.ceil(img_data.h * scale)
    img.title = tooltip

    const ctx = img.getContext('2d')
    ctx.scale(scale, scale)
    ctx.drawImage(img_data.img, 0, 0)

    return element
}

function getTypeIcon(id, scale = 0.35) {
    return getAtlasImg(sprite_atlas_data[`Type_${id}`], scale, pbs_data.types[id]._Data.Name)
}

function getCategoryIcon(id, scale = 1.0) {
    return getAtlasImg(sprite_atlas_data[`MoveCategory_${id}`], scale, id)
}

function getPokemonIconImg(id) {
    return getAtlasImg(sprite_atlas_data[`Icon_${id ?? '000'}`], 1.0, pbs_data.pokemon[id]._Data.Name)
}

function getPokemonFrontImg(id) {
    return getAtlasImg(sprite_atlas_data[`Front_${id ?? '000'}`], 1.0, pbs_data.pokemon[id]._Data.Name)
}

async function sliceAtlasInBatches(atlas_meta_data, batch_size = 100) {
    const response = await fetch(atlas_meta_data.Artifact)
    const blob = await response.blob()
    const atlas_bitmap = await createImageBitmap(blob)

    const result = {}
    Object.entries(atlas_meta_data).forEach(([k1, v1]) => {
        if (k1 != 'Artifact') {
            Object.entries(v1).forEach(([k2, v2]) => {
                if (k2 != 'w' && k2 != 'h') {
                    result[`${k1}_${k2}`] = {
                        x: v2.x,
                        y: v2.y,
                        w: v1.w,
                        h: v1.h,
                    }
                }
            })
        }
    })

    const result_list = Object.values(result)
    for (let i = 0; i < result_list.length; i += batch_size) {
        const batch = result_list.slice(i, i + batch_size)
        await Promise.all(batch.map(async (sprite) => (sprite.img = await createImageBitmap(atlas_bitmap, sprite.x, sprite.y, sprite.w, sprite.h))))
    }

    atlas_bitmap.close()
    return result
}
