<template>
    <el-checkbox ref="checkbox" v-model="inputVal" @change="changeVal"/>
</template>
<script>
    import {Checkbox} from 'element-ui'

    export default {
        name: 'checkbox-jasper',
        components: {
            Checkbox
        },
        props: {
            value: Boolean
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
                this.$emit('change', { name: this.$refs.checkbox.$parent.$attrs.name, value: val })
            }
        }
    }
</script>
