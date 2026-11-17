class PbsPokemon {
    constructor(k, v, i) {
        setPbsBaseMembers(this, k, v)

        this.dex_num = i + 1
        this.root_evolution = this._Data.Prevo == undefined ? this : undefined
        this.is_starter = false
        this.type1 = pbs_data.types[this._Data.Type1]
        this.type2 = this._Data.Type2 ? pbs_data.types[this._Data.Type2] : undefined
        this.bst = Object.values(this._Data.BaseStats).reduce((a, cv) => a + cv, 0)
    }

    get is_legend() {
        return this._Data.Flags?.some((x) => x == 'Legendary') ?? false
    }

    get abilities() {
        return this._Data.Abilities.map((x) => pbs_data.abilities[x])
    }

    get is_first_stage() {
        return this._Data.Prevo == undefined && this._Data.Evolutions
    }

    get is_final_stage() {
        return this._Data.Prevo && this._Data.Evolutions == undefined
    }

    get has_no_evo_line() {
        return this._Data.Prevo == undefined && this._Data.Evolutions == undefined
    }

    get img_icon() {
        return getPokemonIconImg(this._ID)
    }
}
