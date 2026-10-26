class FilterConfig {
    constructor(id, group, value) {
        this.id = id
        this.group = group
        this.value = value
        this.funcs = {} // Filter funcs always indicate the value passes the filter (return true)
    }

    setMonFunc(func) {
        this.funcs[DexPage.FILTER_TARGET_POKEMON] = func
        return this
    }
}
