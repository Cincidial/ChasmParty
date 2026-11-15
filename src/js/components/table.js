class TableColumn {
    constructor(header_name, element_func, sort_value_func = null) {
        this.header_name = header_name
        this.element_func = element_func
        this.sort_value_func = sort_value_func
        this.th = null
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
        this.data = null
        this.sort_descending = false
        this.sort_col = null
    }

    setData(data) {
        this.data = data
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
        const sort_value_func = this.sort_col.sort_value_func
        this.tbody.replaceChildren(
            ...this.data
                .sort((a, b) => {
                    const value_a = sort_value_func(a)
                    const value_b = sort_value_func(b)

                    return (value_a === value_b ? 0 : value_a > value_b ? 1 : -1) * (this.sort_descending ? -1 : 1)
                })
                .flatMap((d) => {
                    const row = this.tbody.insertRow()
                    row.className = 'dataRow'
                    row.replaceChildren(
                        ...this.table_column_list.map((col) => {
                            const cell = row.insertCell()
                            cell.replaceChildren(col.element_func(d))

                            return cell
                        }),
                    )

                    return row
                }),
        )
    }
}
customElements.define('party-table', Table)
