import {shallowMount, createLocalVue} from '@vue/test-utils'
import ElementUI from 'element-ui'
import InputJasper from '../src/InputJasper.vue'

const localVue = createLocalVue()
localVue.use(ElementUI)
describe('InputJasper', () => {
    test('sanity test', () => {
        expect(true).toBe(true)
    })
    test("it renders props.value when passed", () => {
        const value = 'valuezzzz'
        const wrapper = shallowMount(InputJasper, {
            localVue: localVue,
            propsData: { value }
        })
        // wrapper.setData({value: value})
        expect(wrapper.vm.inputVal).toBe(value)
    })
})

