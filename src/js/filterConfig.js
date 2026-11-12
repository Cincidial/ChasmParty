class FilterConfig {
    constructor(id, value, filter_func) {
        this.id = id
        this.value = value
        this.in_progress = false
        this.filter_func = filter_func // Filter funcs always indicate the value passes the filter (return true)
    }
}
