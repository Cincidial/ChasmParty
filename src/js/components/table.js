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

        this.table = this.getElementById('table')
        this.thead = this.getElementById('thead')
        this.tbody = this.getElementById('tbody')

        this.table_column_list = []
        this.table_row_list = null
        this.sort_descending = false
        this.sort_col = null
        this.cached_table_rows = {} // The table uses on the website are read-only, so we can assume the row generated for an input ID is always going to look the same
    }

    setData(data, id_func) {
        this.table_row_list = data.map((d) => {
            if (!Object.hasOwn(this.cached_table_rows, id_func(d))) {
                const tr = this.tbody.insertRow()
                tr.classList.add('dataRow')
                tr.replaceChildren(
                    ...this.table_column_list.map((col) => {
                        const cell = tr.insertCell()
                        cell.replaceChildren(col.element_func(d))

                        return cell
                    }),
                )

                this.cached_table_rows[id_func(d)] = new TableRow(d, tr)
            }

            this.cached_table_rows[id_func(d)].data = d
            return this.cached_table_rows[id_func(d)]
        })
        this.updateBody()

        return this
    }

    setup(table_column_list) {
        this.table_column_list = table_column_list
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
                        this.updateBody()
                    }
                }

                col.th = th
                return th
            }),
        )

        return this
    }

    updateBody() {
        this.tbody.replaceChildren(
            ...this.table_row_list
                .sort((a, b) => {
                    const value_a = this.sort_col.sort_value_func(a.data)
                    const value_b = this.sort_col.sort_value_func(b.data)

                    return (value_a === value_b ? 0 : value_a > value_b ? 1 : -1) * (this.sort_descending ? -1 : 1)
                })
                .map((x) => x.tr),
        )
    }
}
customElements.define('party-table', Table)
