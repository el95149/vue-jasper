<template>
    <el-select ref="select" v-model="inputVal" placeholder="Select" :clearable="true" @change="changeVal">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
    </el-select>
</template>
<script>
    import {Select} from 'element-ui'

    export default {
        name: 'select-jasper',
        components: {
            Select
        },
        props: {
            options: {
                type: Array,
                required: true
            },
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
                this.$emit('change', { name: this.$refs.select.$parent.$attrs.name, value: val })
            }
        }
    }
</script>
