import {DatePicker, InputNumber, Input} from 'element-ui'

const InputControlTypes = {
    singleValueNumber: function(inputControl) {
        return InputNumber
    },
    singleValueText: function() {
        return Input
    }
}

export default InputControlTypes
