import JasperRepository from './JasperRepository'

const resource = 'reports'
export default {
    getInputControls(reportUri) {
        return JasperRepository.get(
            `${resource}` + reportUri + '/inputControls'
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
                responseType: 'blob'
            }
        )
    }
}
