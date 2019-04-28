# Vue Jasper

A Vue.js based component, used to consume reports deployed on a JasperReports server.
Using Jasper's REST API, it allows the user to select reports available on the server, select values for the report's input controls, if any,
and, last but not least, generate and download the report to the user's machine.   

## Getting Started

You'll want to use this component in an application of your own, since it's not meant to function fully standalone (i.e it's not a full-fledged Jasper client). 

### Prerequisites

Your app should have the following packages/dependencies installed, since the component relies on them:

- Vue (Duh!)
- element-ui
- axios

Your JasperSoft Reports server's REST API should be configured to support basic HTTP auth (and preferably SSL as well...)

### Installing

```
npm install --save vue-jasper
```

Use it in your own view/component:

```
<template>
    <vue-jasper  :url="jasperUrl" :username="jasperUsername" :password="jasperPassword"/>
</template>

<script>
import VueJasper from 'vue-jasper'

export default {
    components: {
        VueJasper
    },
    data() {
        return {
            jasperUrl: 'http://localhost:8081/jasperserver/rest_v2/',
            jasperUsername: 'user',
            jasperPassword: 'bitnami'
        }
    }
}
</script>
```

## Deployment

Add additional notes about how to deploy this on a live system

## TODO

- Add more input control types
- Add JSON report rendering (e.g. in data-tables, charts)

## Built With

* [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework 
* [Element-UI](https://element.eleme.io/) - A Desktop UI Library
* [Axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Angelos Anagnostopoulos** - *Initial work* - [el95149](https://github.com/el95149)

See also the list of [contributors](https://github.com/el95149/vue-jasper/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Many thanks to the Element-UI & Axios creators for a great widget library
* Even more thanks to Vue.js creators!

