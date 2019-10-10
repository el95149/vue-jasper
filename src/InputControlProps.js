const InputControlProps = {
    singleValueNumber(inputControl) {
        return {}
    },
    singleValueText() {
        return {}
    },
    singleSelect(inputControl) {
        return {
            options: inputControl.state.options
        }
    },
    bool() {
        return {}
    }
}
export default InputControlProps
