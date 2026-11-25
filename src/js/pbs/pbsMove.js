class PbsMove {
    constructor(k, v) {
        setPbsBaseMembers(this, k, v)

        this.type = pbs_data.types[this._Data.Type]
    }

    get category_icon() {
        return getCategoryIcon(this._Data.Category)
    }
}
