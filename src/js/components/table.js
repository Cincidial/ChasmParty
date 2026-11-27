class TableColumn {
    constructor(header_name, element_func, sort_value_func = null) {
        this.header_name = header_name
        this.element_func = element_func
        this.sort_value_func = sort_value_func
        this.th = null
    }
}

class TableRow {
    constructor(data, tr) {
        this.data = data
        this.tr = tr
    }
}

class Table extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-table-template')

        this.table_scroll = this.getElementById('table_scroll')
        this.table_space = this.getElementById('table_space')
        this.table = this.getElementById('table')
        this.thead = this.getElementById('thead')
        this.tbody = this.getElementById('tbody')

        this.data = undefined
        this.table_column_list = []
        this.row_height = 0
        this.row_onclick_func = undefined
        this.sort_descending = false
        this.sort_col = null

        this.table_scroll.addEventListener('scroll', () => this.render())
        this.handle_resize = () => this.updateScrollContainerHeight()
    }

    connectedCallback() {
        this.updateScrollContainerHeight()
        window.addEventListener('resize', this.handle_resize)
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.handle_resize)
    }

    updateScrollContainerHeight() {
        const topPosition = this.table_scroll.getBoundingClientRect().top + this.row_height / 3
        this.table_scroll.style = `height: ${window.innerHeight - topPosition}px`

        this.render()
    }

    setup(table_column_list, row_height, row_onclick_func) {
        this.table_column_list = table_column_list
        this.row_height = row_height
        this.row_onclick_func = row_onclick_func
        this.sort_descending = false

        const header_row = this.thead.insertRow()
        header_row.replaceChildren(
            ...table_column_list.map((col) => {
                const th = document.createElement('th')
                th.textContent = col.header_name

                if (col.sort_value_func) {
                    if (!this.sort_col) {
                        this.sort_col = col
                        th.textContent = `↑ ${col.header_name}`
                    }

                    th.classList.add('sortable')
                    th.onclick = () => {
                        const old_col = this.sort_col
                        const new_col = col

                        if (this.sort_col == col) {
                            this.sort_descending = !this.sort_descending
                        } else {
                            this.sort_col = col
                            this.sort_descending = false
                        }

                        old_col.th.textContent = old_col.header_name
                        new_col.th.textContent = `${this.sort_descending ? '↓' : '↑'} ${col.header_name}`
                        this.updateData()
                    }
                }

                col.th = th
                return th
            }),
        )

        return this
    }

    setData(data) {
        this.data = data
        this.updateData()

        return this
    }

    updateData() {
        this.data = this.data.sort((a, b) => {
            const value_a = this.sort_col.sort_value_func(a)
            const value_b = this.sort_col.sort_value_func(b)

            return (value_a === value_b ? 0 : value_a > value_b ? 1 : -1) * (this.sort_descending ? -1 : 1)
        })

        this.table_scroll.scrollTo({ top: 0, behavior: 'smooth' })
        this.render()
    }

    render() {
        const header_height = this.thead ? this.thead.getBoundingClientRect().height : 0
        const scroll_top = Math.max(0, this.table_scroll.scrollTop - header_height)
        const viewport_height = this.table_scroll.getBoundingClientRect().height - header_height

        const start = Math.max(Math.floor(scroll_top / this.row_height) - 1, 0)
        const end = Math.min(start + Math.ceil(viewport_height / this.row_height) + 1, this.data.length)

        if (this.data && this.row_height && this.table_space) {
            const spacing_height = `${this.data.length * this.row_height + header_height + 15}px`
            if (this.table_space.style.height != spacing_height) this.table_space.style.height = spacing_height
        }

        this.tbody.replaceChildren()
        const row_count = end - start + 1
        Array.from({ length: row_count }).forEach((_, i) => {
            const data_index = start + i
            if (data_index >= this.data.length) return

            const data = this.data[data_index]
            const tr = this.tbody.insertRow()

            tr.classList.add(data_index % 2 == 0 ? 'tr_even' : 'tr_odd')
            tr.style.height = `${this.row_height}px`
            tr.style.transform = `translateY(${start * this.row_height}px)`

            if (this.row_onclick_func) {
                tr.onclick = () => this.row_onclick_func(data)
                tr.setAttribute('has-onclick', '')
            }

            this.table_column_list.forEach((col) => {
                const cell = tr.insertCell()
                cell.replaceChildren(col.element_func(data))
            })
        })

        const remaining_height = Math.max(0, (this.data.length - row_count) * this.row_height)
        if (remaining_height > 0) {
            const filler = this.tbody.insertRow()
            filler.style.height = `${remaining_height}px`
        }
    }
}
customElements.define('party-table', Table)
