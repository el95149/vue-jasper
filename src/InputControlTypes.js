import {DatePicker, InputNumber, Input, Checkbox} from 'element-ui'
import SelectJasper from './SelectJasper.vue'
import InputJasper from './InputJasper.vue'
import InputNumberJasper from "./InputNumberJasper.vue"
import CheckboxJasper from "./CheckboxJasper.vue"

const InputControlTypes = {
    singleValueNumber(inputControl) {
        return InputNumberJasper
    },
    singleValueText() {
        return InputJasper
    },
    singleSelect() {
        return SelectJasper
    },
    bool() {
        return CheckboxJasper
    }
}
export default InputControlTypes
