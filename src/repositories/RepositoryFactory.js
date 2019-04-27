import JasperRepository from './JasperRepository'
import JasperResourcesRepository from './resourcesRepository'
import JasperReportsRepository from './reportsRepository'

const repositories = {
    jasper: JasperRepository,
    resources: JasperResourcesRepository,
    reports: JasperReportsRepository
}

export const RepositoryFactory = {
    get: name => repositories[name]
}
