const commonRules = function(inputControl) {
    return {
        fullField: ' ', // ugly hack to remove field name from displayed error
        trigger: 'change',
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
    },
    singleSelect: function (inputControl) {
        return {
            ...commonRules(inputControl),
            type: 'string'
        }
    }
}

export default InputControlRules
