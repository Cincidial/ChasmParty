class PbsMove {
    constructor(k, v) {
        setPbsBaseMembers(this, k, v)

        this.type = pbs_data.types[this._Data.Type]
        this.display_flags = this._Data.Flags?.filter((x) => !local_data.ignored_move_flags.includes(x))?.join(', ') ?? ''
    }

    get category_icon() {
        return getCategoryIcon(this._Data.Category)
    }
}
