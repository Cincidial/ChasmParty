document.addEventListener('DOMContentLoaded', () => getServerData())

var sprite_atlas_img
var sprite_atlas_data = {}
var rx_data = {}
var pbs_data = {}

async function getServerData() {
    const loadingSplash = document.getElementById('loadingSplash')

    function convertPbsDataListToHash(data) {
        return Object.fromEntries(data.map((x) => [x._ID, x]))
    }

    async function handleData() {
        const response = await fetch('data.json')
        const server_data = await response.json()

        sprite_atlas_data = server_data.Atlas.SpriteAtlas
        rx_data = server_data.RxData

        // Build all the PBS data classes
        pbs_data.generations = [...new Set(Object.values(server_data.PBS.Pokemon).map((x) => x.Generation))].filter((x) => x).sort()
        pbs_data.pokemon = convertPbsDataListToHash(Object.entries(server_data.PBS.Pokemon).map(([k, v], i) => new PbsPokemon(k, v, i)))
        pbs_data.abilities = convertPbsDataListToHash(Object.entries(server_data.PBS.Abilities).map(([k, v]) => new PbsAbility(k, v)))

        // Post-Processing
        const evolutions_to_process = Object.values(pbs_data.pokemon).filter((x) => x.root_evolution)
        while (evolutions_to_process.length > 0) {
            const mon = evolutions_to_process.pop()
            if (mon._Data.Evolutions) {
                mon._Data.Evolutions.forEach((evo) => {
                    pbs_data.pokemon[evo.Pokemon].root_evolution = mon.root_evolution
                    evolutions_to_process.push(pbs_data.pokemon[evo.Pokemon])
                })
            }
        }

        const starters = new Set(
            Object.values(server_data.PBS.Encounters)
                .filter((x) => x.Name.includes('Starter'))
                .flatMap((x) => x.Tables[0].Encounters.map((y) => y.Pokemon)),
        )
        Object.values(pbs_data.pokemon)
            .filter((x) => starters.has(x.root_evolution._ID))
            .forEach((x) => (x.is_starter = true))
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

function setPbsBaseMembers(self, k, v) {
    // No a base class cannot be used because the build script might not put the base class first in src.js
    // Yes, this is very janky, but so is writing this website in pure JS
    self._ID = k
    self._Data = v
}
