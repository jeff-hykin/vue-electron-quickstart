<template>
    <div unique-fh3935 class="json-editor-object" :style="{...$attrs.style}" v-on="$listeners">
        <!-- <jsonValue /> -->
        <template v-for="(each, index) in this.valueKeys">
            <jsonKeyValue :key=each @changeValue="updateKeyValue" :root=value v-bind:key="each" />
        </template>
        <button @click="addKeyValue">
            Add
        </button>
    </div>
</template>
<script>
import jsonKeyValue from "./jsonKeyValue"
import jsonValue from "./jsonValue"

export default {
    name: "jsonObject",
    components: {jsonValue, jsonKeyValue},
    data: ()=>({
        value: {},
        valueKeys: []
    }),
    props: {
    },
    computed: {
    },
    methods: {
        addKeyValue() {
            let keys = Object.keys(this.value)
            if (keys.length == 0) {
                this.value.ReNameMe1 = null
            } else {
                let prevName = keys[0]
                this.value[prevName+"-copy"] = null
            }
            // TODO: focus on the name of the newly created element
            this.valueKeys = Object.keys(this.value)
        },
        updateKeyValue(oldKey, key, value) {
            if (oldKey != key) {
                delete this.value[oldKey]
            }
            this.value[key] = value
            console.log(`jsonObjectUpdateKeyValue: this.value`, JSON.stringify(this.value))
            console.log(`jsonObjectUpdateKeyValue: root:`,this.$attrs.root)
            // tell any parents the value has update
            if (this.$listeners.valueChange instanceof Function) {
                this.$listeners.valueChange||this.$listeners.valueChange(this.value)
            }
        },
        deleteKey(key) {
            if (key in this.value) {
                delete this.value[key]
            }
        },
    }
}
</script>
<style lang="scss">
[unique-fh3935] {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0.1rem 0.3rem;
    
    & > button {
        margin: 1rem;
    }
}
[unique-fh3935] * {
    flex-wrap: nowrap; /* to disable bootstraps global CSS */
    margin: 0; /* to disable bootstraps global CSS */
}
[unique-fh3935] .json-edit-bubble {
    display: flex;
    box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
    background: white;
    border-radius: 1rem;
}
</style>
