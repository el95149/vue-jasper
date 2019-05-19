const InputControlProps = {
    singleValueNumber: function(inputControl) {
        return {}
    },
    singleValueText: function() {
        return {}
    },
    singleSelect: function(inputControl){
        return {
            options: inputControl.state.options
        }
    }
}

export default InputControlProps
