class FilterConfig {
    constructor(id, value, filter_func, in_prog_reset_func) {
        this.id = id
        this.value = value
        this.in_progress = true
        this.filter_func = filter_func // Filter funcs always indicate the value passes the filter (return true)
        this.in_prog_reset_func = in_prog_reset_func
    }
}
