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
