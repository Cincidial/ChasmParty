document.addEventListener('DOMContentLoaded', () => getServerData())

let sprite_atlas_img
let sprite_atlas_data = {}
let rx_data = {}
let pbs_data = {}
let local_data = {
    ignored_move_flags: [
        'CanProtect',
        'ForceSignature',
        'Uninvocable',
        'Staple',
        'HalfDamageToAllies',
        'AvatarSignature',
        'Empowered',
        'CanSnatch',
        'CanRandomCrit',
        'DoubleCritChance',
        'CanMagicCoat',
        'FakeRandomEffect',
    ],
    move_target_text_map: {
        NearOther: 'Near',
        User: '',
        None: '',
        AllNearOthers: 'All Near',
        AllNearFoes: 'All Near',
        UserAndAllies: 'User & Allies',
        NearAlly: 'Near',
        NearFoe: 'Near',
        Ally: '',
        ClosestNearFoe: '',
        AllBattlers: 'All',
        UserSide: '',
        BothSides: '',
        FoeSide: '',
        UserOrNearOther: '',
    },
}

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
        pbs_data.types = convertPbsDataListToHash(Object.entries(server_data.PBS.Types).map(([k, v]) => new PbsType(k, v)))
        pbs_data.abilities = convertPbsDataListToHash(Object.entries(server_data.PBS.Abilities).map(([k, v]) => new PbsAbility(k, v)))
        pbs_data.tribes = convertPbsDataListToHash(Object.entries(server_data.PBS.Tribes).map(([k, v]) => new PbsTribe(k, v)))
        pbs_data.moves = convertPbsDataListToHash(Object.entries(server_data.PBS.Moves).map(([k, v]) => new PbsMove(k, v)))
        pbs_data.pokemon = convertPbsDataListToHash(Object.entries(server_data.PBS.Pokemon).map(([k, v], i) => new PbsPokemon(k, v, i)))

        // Post-Processing
        PbsType.init(Object.values(pbs_data.types))

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

function isPrimevalTextDisplay(value) {
    return value ? '✓' : ''
}

function setPbsBaseMembers(self, k, v) {
    // No a base class cannot be used because the build script might not put the base class first in src.js
    // Yes, this is very janky, but so is writing this website in pure JS
    self._ID = k
    self._Data = v
}
