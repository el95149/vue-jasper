import {DatePicker, InputNumber, Input} from 'element-ui'
import SelectJasper from './SelectJasper.vue'

const InputControlTypes = {
    singleValueNumber: function(inputControl) {
        return InputNumber
    },
    singleValueText: function() {
        return Input
    },
    singleSelect: function(){
        return SelectJasper
    }
}

export default InputControlTypes
