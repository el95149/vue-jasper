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
    test("it emits the value when changed", () => {
        const value = 'valuezzzz'
        const wrapper = shallowMount(InputJasper, {
            localVue: localVue,
            propsData: { value }
        })
        wrapper.vm.changeVal(value)
        expect(wrapper.emitted().change).toBeTruthy()
        expect(wrapper.emitted().change.length).toBe(1)
        expect(wrapper.emitted().change[0]).toEqual([{ name: undefined, value: value }])
    })
    test("it emits the value when typed", () => {
        const value = 'valuezzzz'
        const wrapper = shallowMount(InputJasper, {
            localVue: localVue,
            propsData: { value }
        })
        wrapper.vm.$options.watch.inputVal.call(wrapper.vm, value)
        expect(wrapper.emitted("input")[0][0]).toBe(value)
    })
})

