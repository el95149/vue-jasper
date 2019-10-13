<template>
    <el-input ref="input" v-model="inputVal" @change="changeVal"/>
</template>
<script>
    import {Input} from 'element-ui'

    export default {
        name: 'input-jasper',
        components: {
            Input
        },
        props: {
            value: [Number, String]
        },
        data() {
            return {
                inputVal: this.value
            }
        },
        watch: {
            inputVal(val) {
                this.$emit('input', val)
            }
        },
        methods: {
            changeVal(val) {
                this.$emit('change', { name: this.$refs.input.$parent.$attrs.name, value: val })
            }
        }
    }
</script>
