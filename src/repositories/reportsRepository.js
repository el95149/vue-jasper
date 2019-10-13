import JasperRepository from './JasperRepository'

const resource = 'reports'
export default {
    getInputControls(reportUri) {
        return JasperRepository.get(
            `${resource}` + reportUri + '/inputControls'
        )
    },
    updateInputControlValue(reportUri, inputControlValue) {
        let body = {}
        body[inputControlValue.name] = [`${inputControlValue.value}`]
        return JasperRepository.post(
            `${resource}` + reportUri + '/inputControls/values?freshData=true',
            body
        )
    },
    updateInputControlsValues(reportUri, inputControls, updatedValue) {
        let body = {}
        for(let inputControlId in inputControls){
            let inputControl = inputControls[inputControlId]
            body[inputControl.id] = [`${inputControl.state.value}`]
        }
        // override the changed value in the request
        body[updatedValue.name] = [`${updatedValue.value}`]
        return JasperRepository.post(
            `${resource}` + reportUri + '/inputControls/values?freshData=true',
            body
        )
    },
    generateReport(reportUri, type, params) {
        let paramsString = params.reduce(
            (str, param) => `${str}&${param.name}=${param.value}`,
            ''
        )
        return JasperRepository.get(
            `${resource}${reportUri}.${type}?${paramsString}`,
            {
                headers: {},
                responseType: type == 'html' ? 'text/html' : 'blob'
            }
        )
    }
}
