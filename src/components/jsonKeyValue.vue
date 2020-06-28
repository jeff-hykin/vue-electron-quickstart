<template>
    <div unique-285hg2u44 class="json-editor-key-value json-edit-bubble" >
        <!-- TODO: validate key doesn't overlap other key -->
        <input type="text" v-bind="key" placeholder="pick a name">
        <jsonValue @valueChange="valueChange" />
    </div>
</template>

<script>
import jsonValue from "./jsonValue";
export default {
    components: {jsonValue},
    data: ()=>({
        key: "",
        value: null,
    }),
    computed: {
        isValid() {
            if (typeof this.key == 'string') {
                if (this.key.length > 0) {
                    return true
                }
            }
        }
    },
    methods: {
        valueChange(newValue) {
            console.log(`newValue is:`,newValue)
        }
    }
}
</script>

<style lang="scss">
[unique-285hg2u44] {
    display: flex;
    flex-direction: row;
    padding: 0.05rem 1.2rem;
    
    & > input {
        margin-top: 2rem;
        margin-right: 1.2rem;
        border-top: none;
        border-left: none;
        border-right: none;
        padding: 1rem 0rem;
        padding-right: 0.2rem;
        height: 1rem;
        width: 8rem;
    }
}
</style>