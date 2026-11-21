class PbsAbility {
    constructor(k, v) {
        setPbsBaseMembers(this, k, v)
    }

    get capsule_element() {
        return new Capsule().setup(new TextWithTooltip(this._Data.Name, this._Data.Description), this)
    }
}
