const commonRules = function (inputControl) {
    return {
        fullField: ' ', // ugly hack to remove field name from displayed error
        trigger: 'change',
        required: inputControl.mandatory
    }
}
const InputControlRules = {
    singleValueNumber(inputControl) {
        return {
            ...commonRules(inputControl),
            type: 'integer'
        }
    },
    singleValueText(inputControl) {
        return {
            ...commonRules(inputControl),
            type: 'string'
        }
    },
    singleSelect(inputControl) {
        return {
            ...commonRules(inputControl),
            type: 'string'
        }
    },
    bool(inputControl) {
        return {
            ...commonRules(inputControl),
            type: 'boolean'
        }
    }
}
export default InputControlRules
