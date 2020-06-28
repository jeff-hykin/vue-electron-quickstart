<template>
    <div unique-fh3935 class="json-editor-object" :style="{...$attrs.style}" v-on="$listeners">
        <!-- <jsonValue /> -->
        <template v-for="(each, index) in this.valueKeys">
            <jsonKeyValue :key=each @changeValue="updateKeyValue" @delete="deleteKey" :root=value v-bind:key="each" />
        </template>
        <button @click="addKeyValue">
            Add
        </button>
    </div>
</template>
<script>
import jsonKeyValue from "./jsonKeyValue"
import jsonValue from "./jsonValue"

let count = 0
let counter = ()=>++count

export default {
    name: "jsonObject",
    components: {jsonValue, jsonKeyValue},
    data: ()=>({
        value: {},
        valueKeys: [],
        count: counter()
    }),
    props: {
    },
    computed: {
    },
    mounted() {
        this.this = this
    },
    watch: {
        // anytime the value changes
        value: {
            deep: true,
            handler(newValue) {
                // update the valueKeys
                // "shouldn't this be a computed method?" 
                // yeah go ahead and try that and see how it works out
                this.valueKeys = Object.keys(newValue)
            }
        }
    },
    methods: {
        addKeyValue() {
            let keys = Object.keys(this.value)
            if (keys.length == 0) {
                this.$set(this.value, "ReNameMe1", null)
            } else {
                let prevName = keys[0]
                this.$set(this.value, prevName+"-copy", null)
            }
            // TODO: focus on the name of the newly created element
        },
        updateKeyValue(oldKey, key, value) {
            if (oldKey != key) {
                delete this.value[oldKey]
            }
            this.value[key] = value
            console.log(`OBJECT ${this.count}: updateKeyValue`)
            console.log(`    value:`, JSON.stringify(this.value))
            console.log(`    root:`,this.$attrs.root)
            // tell any parents the value has updated
            if (this.$listeners.changeValue instanceof Function) {
                this.$listeners.changeValue(this.value)
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
