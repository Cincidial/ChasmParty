class PbsPokemon {
    constructor(k, v, i) {
        setPbsBaseMembers(this, k, v)

        this.dex_num = i + 1
        this.root_evolution = this._Data.Prevo == undefined ? this : undefined
        this.is_starter = false // Note - this is setup later in data post-processing
        this.type1 = pbs_data.types[this._Data.Type1]
        this.type2 = this._Data.Type2 ? pbs_data.types[this._Data.Type2] : undefined
        this.abilities = this._Data.Abilities.map((x) => pbs_data.abilities[x])
        this.tribes = this._Data.Tribes.map((x) => pbs_data.tribes[x])
        this.bst = Object.values(this._Data.BaseStats).reduce((a, cv) => a + cv, 0)
        this.is_legend = this._Data.Flags?.some((x) => x == 'Legendary') ?? false
        this.is_first_stage = this._Data.Prevo == undefined && this._Data.Evolutions
        this.is_final_stage = this._Data.Prevo && this._Data.Evolutions == undefined
        this.has_no_evo_line = this._Data.Prevo == undefined && this._Data.Evolutions == undefined
    }

    get img_icon() {
        return getPokemonIconImg(this._ID)
    }
}
