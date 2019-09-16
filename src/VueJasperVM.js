import Vue from 'vue'
import {RepositoryFactory} from './repositories/RepositoryFactory'
import InputControlRules from './InputControlRules'
import InputControlTypes from './InputControlTypes'
import InputControlProps from './InputControlProps'

const jasper = RepositoryFactory.get('jasper')
const resourcesRepository = RepositoryFactory.get('resources')
const reportsRepository = RepositoryFactory.get('reports')
const folderUri = '/DimPorts'

export default {
    name: 'vue-jasper',
    components: {},
    props: {
        url: {
            type: String,
            required: false,
            default: undefined
        },
        username: {
            type: String,
            required: false,
            default: undefined
        },
        password: {
            type: String,
            required: false,
            default: undefined
        },
        token: {
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
            },
            html: null
        }
    },
    created() {
        if (this.url) {
            console.log('setting URL')
            jasper.defaults.baseURL = this.url
        }
        if (this.token) {
            console.log('setting token')
            delete jasper.defaults.auth
            let headers = jasper.defaults.headers
            headers['Authorization'] = 'Bearer ' + this.token
            jasper.defaults.headers = headers
        } else if (this.username && this.password) {
            console.log('setting username and password')
            jasper.defaults.auth = {
                username: this.username,
                password: this.password
            }
        }
        this.init()
        this.getReports()
    },
    computed: {
        isGenerateReportEnabled() {
            return this.report != null
        },
        isPreview() {
            return this.html != null
        }
    },
    methods: {
        init() {
            this.reports = []
            this.criteria.report = null
            this.criteria.inputControls = {}
            this.html = null
        },
        async getReports() {
            let { data } = await resourcesRepository.geByTypeAndFolderUri(
                'reportUnit',
                folderUri
            )
            this.reports = data.resourceLookup
        },
        async getReportControls() {
            this.criteria.inputControls = {}
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
                // create reactive properties for input controls
                // ensure input control bears a target reactive value property
                if (!inputControl.state.value) {
                    inputControl.state.value = null
                }
                // For some reason I can't fathom, Vue.set doesn't work, making added properties non-reactive.
                // Total cost: 5-6 hours....
                _self.$set(
                    _self.criteria.inputControls,
                    inputControl.id,
                    inputControl
                )
                // build validation rules
                let rule = {
                    state: {
                        value: InputControlRules[inputControl.type](
                            inputControl
                        )
                    }
                }
                Vue.set(_self.rules.inputControls, `${inputControl.id}`, rule)
            })
        },
        clearReport() {
            this.init()
            this.getReports()
        },
        getControlType(inputControl) {
            return InputControlTypes[inputControl.type](inputControl)
        },
        getControlProps(inputControl) {
            return InputControlProps[inputControl.type](inputControl)
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
                .catch(error => {
                    this.loading = false
                    throw error
                })
        },
        async previewReport() {
            try {
                await this.$refs['reportsForm'].validate()
            } catch (e) {
                return
            }
            let params = this.buildReportParams()
            this.loading = true
            reportsRepository
                .generateReport(this.criteria.report.uri, 'html', params)
                .then(response => {
                    console.log(response.data)
                    this.html = response.data
                    this.loading = false
                })
                .catch(error => {
                    this.loading = false
                    throw error
                })
        },
        clearPreview() {
            this.html = null
        },
        buildReportParams: function () {
            return this.criteria.inputControls
                ? Object.values(this.criteria.inputControls).map(
                    inputControl => {
                        return {
                            name: inputControl.id,
                            value: inputControl.state.value
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
                        preview: 'Preview',
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
                        preview: 'Προεπισκόπηση',
                        generate: 'Παραγωγή',
                        clear: 'Καθαρισμός'
                    }
                }
            }
        }
    }
}
