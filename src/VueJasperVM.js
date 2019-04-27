import Vue from 'vue'
import {RepositoryFactory} from './repositories/RepositoryFactory'
import InputControlRules from './InputControlRules'
import InputControlTypes from './InputControlTypes'

const jasper = RepositoryFactory.get('jasper')
const resourcesRepository = RepositoryFactory.get('resources')
const reportsRepository = RepositoryFactory.get('reports')
const folderUri = '/DimPorts'

export default {
    name: 'vue-jasper',
    components: {},
    props: {
        baseURL: {
            type: String,
            required: false,
            default: undefined
        },
        types: {
            type: Array,
            required: false,
            default: function () {
                return [
                    { label: 'CSV', value: 'csv' },
                    { label: 'PDF', value: 'pdf' },
                    { label: 'XLS', value: 'xls' },
                    { label: 'DOCX', value: 'docx' }
                ]
            }
        }
    },
    data() {
        return {
            test: null,
            loading: false,
            reports: [],
            criteria: {
                report: null,
                inputControls: {}
            },
            rules: {
                report: {
                    type: 'object',
                    fullField: 'report',
                    required: true,
                    trigger: 'blur'
                },
                inputControls: {}
            }
        }
    },
    created() {
        if (this.baseURL) {
            jasper.defaults.baseURL = this.baseURL
        }
        this.init()
        this.getReports()
    },
    computed: {
        isGenerateReportEnabled() {
            return this.report != null
        }
    },
    methods: {
        init() {
            this.reports = []
            this.criteria.report = null
            this.criteria.inputControls = {}
        },
        async getReports() {
            let { data } = await resourcesRepository.geByTypeAndFolderUri(
                'reportUnit',
                folderUri
            )
            this.reports = data.resourceLookup
        },
        async getReportControls() {
            let inputControls = []
            if (this.criteria.report) {
                this.loading = true
                let { data } = await reportsRepository.getInputControls(
                    this.criteria.report.uri
                )
                if (data.inputControl) {
                    inputControls = data.inputControl
                }
                this.loading = false
            }
            let _self = this
            inputControls.forEach(inputControl => {
                let rule = {
                    state: {
                        value: InputControlRules[inputControl.type](
                            inputControl
                        )
                    }
                }
                _self.$set(
                    _self.criteria.inputControls,
                    inputControl.id,
                    inputControl
                )
                Vue.set(_self.rules.inputControls, `${inputControl.id}`, rule)
            })
            console.log(this.rules.inputControls)
        },
        clearReport() {
            this.init()
            this.getReports()
        },
        getControlType(inputControl) {
            return InputControlTypes[inputControl.type](inputControl)
        },
        getControlProps(inputControl) {
            let props = {}
            if (inputControl.id.toLowerCase().includes('year')) {
                props.type = 'year'
            }
            return props
        },
        getPropName(inputControl) {
            return `inputControls.${inputControl.id}.state.value`
        },
        async generateReport(type) {
            try {
                await this.$refs['reportsForm'].validate()
            } catch (e) {
                return
            }
            let params = this.buildReportParams()
            this.loading = true
            reportsRepository
                .generateReport(this.criteria.report.uri, type, params)
                .then(response => {
                    // create a 'pseudo' HTML link, to trigger an automated download (and remove it right away)
                    const url = window.URL.createObjectURL(response.data)
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute(
                        'download',
                        `${this.criteria.report.label}.${type}`
                    )
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    this.loading = false
                })
        },
        buildReportParams: function () {
            return this.criteria.inputControls
                ? Object.values(this.criteria.inputControls).map(
                    inputControl => {
                        let value = inputControl.state.value
                        // TODO replace ugly 'hack' with generic solution
                        if (
                            inputControl.state.value instanceof Date &&
                            inputControl.id.toLowerCase().includes('year')
                        ) {
                            value = value.getFullYear()
                        }
                        return {
                            name: inputControl.id,
                            value: value
                        }
                    }
                )
                : []
        }
    },
    i18n: {
        messages: {
            en: {
                jasper: {
                    report: {
                        self: 'Report',
                        placeholder: 'Choose one of the available reports',
                        generate: 'Generate',
                        clear: 'Clear'
                    }
                }
            },
            el: {
                jasper: {
                    report: {
                        self: 'Αναφορά',
                        placeholder: 'Επιλεξτε μία από τις διαθέσιμες αναφορές',
                        generate: 'Παραγωγή',
                        clear: 'Καθαρισμός'
                    }
                }
            }
        }
    },
}
