class PbsType {
    static type_chart = {} // This is setup as `type_chart[user_type][target_type] = multiplier`
    static init(pbs_types) {
        pbs_types.forEach((x) => (this.type_chart[x._ID] = {}))
        pbs_types.filter((x) => x._Data.Resistances).forEach((x) => x._Data.Resistances.forEach((y) => (this.type_chart[y][x._ID] = 0.5)))
        pbs_types.filter((x) => x._Data.Immunities).forEach((x) => x._Data.Immunities.forEach((y) => (this.type_chart[y][x._ID] = 0)))
        pbs_types.filter((x) => x._Data.Weaknesses).forEach((x) => x._Data.Weaknesses.forEach((y) => (this.type_chart[y][x._ID] = 2)))
    }

    constructor(k, v) {
        setPbsBaseMembers(this, v.InternalName, v)
    }

    get img_icon() {
        return getTypeIcon(this._ID)
    }
}
