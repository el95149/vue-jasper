const InputControlProcessors = {
    singleValueNumber(state) {
        if (state.value != null) {
            state.value = Number(state.value)
        }
        return state
    },
    singleValueText(state) {
        return state
    },
    singleSelect(state) {
        let selectedOption = state.options
            .find(function (option) {
                return option.selected === true
            })
        if (selectedOption) {
            state.value = selectedOption.value
        }
        return state
    },
    bool(state) {
        state.value = state.value === 'true'
        return state
    }
}
export default InputControlProcessors
