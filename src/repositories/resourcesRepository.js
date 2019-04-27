import JasperRepository from './JasperRepository'

const resource = 'resources'
export default {
    get() {
        return JasperRepository.get(`${resource}`)
    },
    geByTypeAndFolderUri(type, folderUri) {
        return JasperRepository.get(
            `${resource}?type=` + type + '&folderUri=' + folderUri
        )
    }
}
