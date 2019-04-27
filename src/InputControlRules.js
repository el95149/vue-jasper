const commonRules = function(inputControl) {
    return {
        trigger: 'blur',
        required: inputControl.mandatory
    }
}

const InputControlRules = {
    singleValueNumber: function(inputControl) {
        return {
            ...commonRules(inputControl),
            type: 'integer'
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
