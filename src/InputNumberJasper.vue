<template>
    <el-input-number ref="inputNumber" v-model="inputVal" @change="changeVal"/>
</template>
<script>
    import {InputNumber} from 'element-ui'

    export default {
        name: 'input-number-jasper',
        components: {
            InputNumber
        },
        props: {
            value: Number
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
                this.$emit('change', { name: this.$refs.inputNumber.$parent.$attrs.name, value: val })
            }
        }
    }
</script>
