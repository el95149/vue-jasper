import {DatePicker, InputNumber, Input} from 'element-ui'

const InputControlTypes = {
    singleValueNumber: function(inputControl) {
        return inputControl.id.toLowerCase().includes('year')
            ? DatePicker
            : InputNumber
    },
    singleValueText: function() {
        return Input
    }
}

export default InputControlTypes
