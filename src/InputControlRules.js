const commonRules = function(inputControl) {
    return {
        trigger: 'blur',
        required: inputControl.id.toLowerCase().includes('year')
            ? true
            : inputControl.mandatory
    }
}

const InputControlRules = {
    singleValueNumber: function(inputControl) {
        return {
            ...commonRules(inputControl),
            type: inputControl.id.toLowerCase().includes('year')
                ? 'object'
                : 'integer'
        }
    },
    singleValueText: function(inputControl) {
        return {
            ...commonRules(inputControl),
            type: 'string'
        }
    }
}

export default InputControlRules
