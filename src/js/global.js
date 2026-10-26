document.addEventListener('DOMContentLoaded', () => getBuildData())

var compiled_data
var sprite_atlas_img
var cached_data = {}

async function getBuildData() {
    const loadingSplash = document.getElementById('loadingSplash')

    async function handleData() {
        const response = await fetch('data.json')
        compiled_data = await response.json()
        cdBuildCachedData()
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

function cdBuildCachedData() {
    cached_data.generations = [...new Set(Object.values(compiled_data.PBS.Pokemon).map((x) => x.Generation))]
        .filter((x) => x)
        .sort()
}

function cdGetPokemon(filter) {
    const pokemon = Object.entries(compiled_data.PBS.Pokemon)
    return filter ? pokemon.filter((kv) => filter(kv[0], kv[1])) : pokemon
}

function cdIsLegend(pokemon_id) {
    const flags = compiled_data.PBS.Pokemon[pokemon_id].Flags

    if (flags == undefined) return false
    if (!Array.isArray(flags)) return flags == 'Legendary'

    return flags.some((x) => x == 'Legendary')
}
