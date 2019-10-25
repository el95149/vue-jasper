import {shallowMount, createLocalVue} from '@vue/test-utils'
import ElementUI from 'element-ui'
// import VueI18n from 'vue-i18n'
import VueJasper from '../src/VueJasper.vue'

const localVue = createLocalVue()
localVue.use(ElementUI)
// localVue.use(VueI18n)
// const i18n = new VueI18n({})
describe('VueJasper', () => {
    test('sanity test', () => {
        expect(true).toBe(true)
    })
    test("it calls the initializations methods when created", () => {
        const initSpy = jest.spyOn(VueJasper.methods, 'init');
        const getReportsSpy = jest.spyOn(VueJasper.methods, 'getReports');
        const wrapper = shallowMount(VueJasper, {
            localVue: localVue,
            mocks: {
                $t: () => {
                }
            }
        })
        expect(initSpy).toHaveBeenCalled()
        expect(getReportsSpy).toHaveBeenCalled()
    })
})

