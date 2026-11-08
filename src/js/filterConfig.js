class FilterConfig {
    constructor(id, value) {
        this.id = id
        this.value = value
        this.in_progress = false
        this.funcs = {} // Filter funcs always indicate the value passes the filter (return true)
    }

    setMonFunc(func) {
        this.funcs[DexPage.FILTER_FUNC_POKEMON] = func
        return this
    }
}
