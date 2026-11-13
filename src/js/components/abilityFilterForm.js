class AbilityFilterForm extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-ability-filter-form-template')

        this.is_primival_checkbox = this.getElementById('is_primival_checkbox')
        this.name_dropdown = this.getElementById('name_dropdown')
        this.desc_input = this.getElementById('desc_input')

        this.name_dropdown.populate(Object.values(pbs_data.abilities).map((x) => x._Data.Name))
    }

    set on_change(func) {
        this.is_primival_checkbox.onchange = func
        this.name_dropdown.onchange = func
        this.desc_input.oninput = func
    }

    get sort_id() {
        return undefined
    }

    set sort_id(id) {}

    getFilters() {
        const filters = []
        if (this.is_primival_checkbox.checked) {
            filters.push(
                new FilterConfig('Primeval Ability', true, (d, fv) => {
                    switch (d.constructor) {
                        case PbsAbility:
                            return fv.includes(true) && d._Data.IsPrimeval
                    }
                    return false
                }),
            )
        }

        if (this.name_dropdown.value) {
            filters.push(
                new FilterConfig('Abilty Name', this.name_dropdown.value, (d, fv) => {
                    switch (d.constructor) {
                        case PbsPokemon:
                            const ability_names = d.abilities.map((a) => a._Data.Name.toLowerCase())
                            return fv.some((x) => ability_names.some((a) => a.includes(x.toLowerCase())))
                    }
                    return false
                }),
            )
        }

        if (this.desc_input.value) {
            filters.push(
                new FilterConfig('Ability Description', this.desc_input.value, (d, fv) => {
                    switch (d.constructor) {
                        case PbsPokemon:
                            const ability_descs = d.abilities.map((a) => a._Data.Description.toLowerCase())
                            return fv.some((x) => ability_descs.some((a) => a.includes(x.toLowerCase())))
                    }
                    return false
                }),
            )
        }

        return filters
    }
}
customElements.define('party-ability-filter-form', AbilityFilterForm)
