class FilterConfig {
    constructor(id, value, in_prog_reset_func, filter_func) {
        this.id = id
        this.value = value
        this.in_progress = in_prog_reset_func ? true : false
        this.in_prog_reset_func = in_prog_reset_func
        this.filter_func = filter_func // Filter funcs always indicate the value passes the filter (return true)
    }

    static {
        // Only get filter funcs, doesn't matter what value is passed as we won't be calling them here
        this.static_filter_functions_lookup = Object.fromEntries(
            Object.getOwnPropertyNames(FilterConfig)
                .filter((prop) => typeof FilterConfig[prop] === 'function' && FilterConfig[prop](0)?.id)
                .map((prop) => [FilterConfig[prop](0).id, FilterConfig[prop]]),
        )
    }

    static allToUrlQuery(filters) {}

    static fromUrlQuery(query) {}

    static PokemonGenerationFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Generation', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    return fv.includes(`${d._Data.Generation ?? -1}`)
            }

            return false
        })
    }

    static PokemonEvolutionFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Evolution', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    if (fv.includes('First') && d.is_first_stage) return true
                    if (fv.includes('Final') && d.is_final_stage) return true
                    if (fv.includes('Single') && d.has_no_evo_line) return true
                    break
            }

            return false
        })
    }

    static PokemonOnlyLegendsFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Only Legends', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    return fv.includes(true) && d.is_legend
            }

            return false
        })
    }

    static PokemonHideLegendsFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Hide Legends', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    return fv.includes(true) && !d.is_legend
            }

            return false
        })
    }

    static PokemonStartersOnlyFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Starters Only', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    return fv.includes(true) && d.is_starter
            }

            return false
        })
    }

    static PokemonSearchFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Pokemon Search', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    return fv.some((x) => d._Data.Name.toLowerCase().includes(x.toLowerCase()))
            }

            return false
        })
    }

    static AbilityPrimevalFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Primeval Ability', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsAbility:
                    return fv.includes(true) && d._Data.IsPrimeval
            }

            return false
        })
    }

    static AbilityNameFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Ability Name', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    const ability_names = d.abilities.map((a) => a._Data.Name.toLowerCase())
                    return fv.some((x) => ability_names.some((a) => a.includes(x.toLowerCase())))
                case PbsAbility:
                    return fv.some((x) => d._Data.Name.toLowerCase().includes(x.toLowerCase()))
            }

            return false
        })
    }

    static AbilityDescFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Ability Description', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    const ability_descs = d.abilities.map((a) => a._Data.Description.toLowerCase())
                    return fv.some((x) => ability_descs.some((a) => a.includes(x.toLowerCase())))
                case PbsAbility:
                    return fv.some((x) => d._Data.Description.toLowerCase().includes(x.toLowerCase()))
            }

            return false
        })
    }

    static MovePrimevalFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Primeval Move', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsMove:
                    return fv.includes(true) && d._Data.IsPrimeval
            }

            return false
        })
    }

    static MoveNameFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Move Name', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    const names = d.all_moves.map((x) => x._Data.Name.toLowerCase())
                    return fv.some((x) => names.some((y) => y.includes(x.toLowerCase())))
                case PbsMove:
                    return fv.some((x) => d._Data.Name.toLowerCase().includes(x.toLowerCase()))
            }

            return false
        })
    }

    static MoveDescFilter(value, in_prog_reset_func = null) {
        return new FilterConfig('Move Description', value, in_prog_reset_func, (d, fv) => {
            switch (d.constructor) {
                case PbsPokemon:
                    const names = d.all_moves.map((x) => x._Data.Description.toLowerCase())
                    return fv.some((x) => names.some((y) => y.includes(x.toLowerCase())))
                case PbsMove:
                    return fv.some((x) => d._Data.Description.toLowerCase().includes(x.toLowerCase()))
            }

            return false
        })
    }
}
