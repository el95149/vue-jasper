import {DatePicker, InputNumber, Input, Checkbox} from 'element-ui'
import SelectJasper from './SelectJasper.vue'

const InputControlTypes = {
    singleValueNumber(inputControl) {
        return InputNumber
    },
    singleValueText() {
        return Input
    },
    singleSelect() {
        return SelectJasper
    },
    bool() {
        return Checkbox
    }
}
export default InputControlTypes
