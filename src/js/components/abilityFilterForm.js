class AbilityFilterForm extends HTMLElement {
    constructor() {
        super()
        setupElement(this, 'party-ability-filter-form-template')

        this.is_primival_checkbox = this.getElementById('is_primival_checkbox')
        this.name_dropdown = this.getElementById('name_dropdown')
        this.desc_input = this.getElementById('desc_input')

        this.name_dropdown.populate(globalGetAbilities().map((kv) => kv[1].Name))
    }

    set onChange(func) {
        this.is_primival_checkbox.onchange = func
        this.name_dropdown.onchange = func
        this.desc_input.oninput = func
    }

    getFilters() {
        const filters = []
        if (this.is_primival_checkbox.checked) {
            filters.push(
                new FilterConfig('Primeval Ability', true).setMonFunc(
                    (gen_key, gen_value, filter_values) =>
                        filter_values.includes(true) && globalGetAbilitiesById(gen_value.Abilities).some((x) => x.IsPrimeval),
                ),
            )
        }

        if (this.name_dropdown.value) {
            filters.push(
                new FilterConfig('Abilty Name', this.name_dropdown.value).setMonFunc((gen_key, gen_value, filter_values) => {
                    const ability_names = globalGetAbilitiesById(gen_value.Abilities).map((a) => a.Name.toLowerCase())
                    return filter_values.some((x) => ability_names.some((a) => a.includes(x.toLowerCase())))
                }),
            )
        }

        if (this.desc_input.value) {
            filters.push(
                new FilterConfig('Ability Description', this.desc_input.value).setMonFunc((gen_key, gen_value, filter_values) => {
                    const ability_descs = globalGetAbilitiesById(gen_value.Abilities).map((a) => a.Description.toLowerCase())
                    return filter_values.some((x) => ability_descs.some((a) => a.includes(x.toLowerCase())))
                }),
            )
        }

        return filters
    }
}
customElements.define('party-ability-filter-form', AbilityFilterForm)
