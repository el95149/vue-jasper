import Vue from 'vue'
import {RepositoryFactory} from './repositories/RepositoryFactory'
import InputControlRules from './InputControlRules'
import InputControlTypes from './InputControlTypes'
import InputControlProps from './InputControlProps'
import InputControlProcessors from "./InputControlProcessors"
import csv from 'csvtojson'
import BarChart from './chart/BarChart.vue'

const jasper = RepositoryFactory.get('jasper')
const resourcesRepository = RepositoryFactory.get('resources')
const reportsRepository = RepositoryFactory.get('reports')
const folderUri = '/DimPorts'
const reader = new FileReader()
export default {
    name: 'vue-jasper',
    components: {
        BarChart
    },
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
            html: null,
            chartData: null,
            chartDataCollection: null
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
        },
        isChartEnabled() {
            return this.chartDataCollection != null
        }
    },
    methods: {
        init() {
            this.reports = []
            this.criteria.report = null
            this.criteria.inputControls = {}
            this.html = null
            this.chartData = null
            this.chartDataCollection = null
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
                // initialize input control values
                inputControl.state = InputControlProcessors[inputControl.type](inputControl.state)
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
        async inputControlValueChanged(event) {
            let inputControlState = []
            this.loading = true
            let { data } = await reportsRepository.updateInputControlsValues(
                this.criteria.report.uri,
                this.criteria.inputControls,
                event
            )
            if (data.inputControlState) {
                inputControlState = data.inputControlState
            }
            this.loading = false
            let _self = this
            inputControlState.forEach(inputControlStateEntry => {
                // get matching input control
                let inputControl = _self.criteria.inputControls[inputControlStateEntry.id]
                inputControl.state = Object.assign(inputControl.state, inputControlStateEntry)
                // initialize input control values
                inputControl.state = InputControlProcessors[inputControl.type](inputControl.state)
            })
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
        clearChart() {
            this.chartData = null
            this.chartDataCollection = null
        },
        async getChartableData() {
            try {
                await this.$refs['reportsForm'].validate()
            } catch (e) {
                return
            }
            let _self = this
            // This fires after the blob has been read/loaded.
            reader.onload = function () {
                const text = reader.result
                csv()
                    .preRawData(csvString => {
                        // break the textblock into an array of lines and remove redundant header info
                        var lines = csvString.split('\n')
                        lines.splice(0, 2)
                        return lines.join('\n')
                    })
                    .fromString(text)
                    .then((data) => {
                        _self.chartData = data
                        let chartDataCollection = {
                            labels: [],
                            datasets: [{
                                label: '//TODO',
                                backgroundColor: [],
                                data: []
                            }]
                        }
                        _self.chartData.forEach(value => {
                            // TODO dynamically select data
                            chartDataCollection.labels.push(value['ΤΙΤΛΟΣ'])
                            chartDataCollection.datasets[0].data.push(_self.toFloat(value['ΤΕΛΙΚΟ ΠΟΣΟ']))
                            chartDataCollection.datasets[0].backgroundColor.push(_self.getRandomColorHex())
                        })
                        _self.chartDataCollection = chartDataCollection
                    })
            }
            let params = this.buildReportParams()
            this.loading = true
            reportsRepository
                .generateReport(this.criteria.report.uri, 'csv', params)
                .then(response => {
                    reader.readAsText(response.data)
                    this.loading = false
                })
                .catch(error => {
                    this.loading = false
                    throw error
                })
        },
        toFloat(num) {
            let dotPos = num.indexOf('.')
            let commaPos = num.indexOf(',')
            if (dotPos < 0)
                dotPos = 0
            if (commaPos < 0)
                commaPos = 0
            let sep = null
            if ((dotPos > commaPos) && dotPos)
                sep = dotPos
            else {
                if ((commaPos > dotPos) && commaPos)
                    sep = commaPos
                else
                    sep = false
            }
            if (sep == false)
                return parseFloat(num.replace(/[^\d]/g, ""))
            return parseFloat(
                num.substr(0, sep).replace(/[^\d]/g, "") + '.' +
                num.substr(sep + 1, num.length).replace(/[^0-9]/, "")
            )
        },
        /**
         * function to generate random color in hex form
         */
        getRandomColorHex() {
            var hex = "0123456789ABCDEF",
                color = "#"
            for (var i = 1; i <= 6; i++) {
                color += hex[Math.floor(Math.random() * 16)]
            }
            return color
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
                        clear: 'Clear',
                        chart: {
                            prompt: 'Γράφημα',
                            title: 'Γράφημα Αναφοράς'
                        }
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
                        clear: 'Καθαρισμός',
                        chart: {
                            prompt: 'Chart',
                            title: 'Report Chart'
                        }
                    }
                }
            }
        }
    }
}
