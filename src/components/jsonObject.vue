<template>
    <div json-object-fh3935 object-fh3935 class="json-editor-object" :style="{...$attrs.style}" v-on="$listeners">
        <!-- TODO: stop using the this.valueKeys (optimize it out) -->
        <template v-for="(value, key) in this.masterValue">
            <jsonKeyValue :pair="value" v-bind:key="key" :value="value" @changeValue="updateKeyValue" @delete="deleteKey" :root=value />
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
let counter = ()=>++count // FIXME: this is only for debugging

export default {
    name: "jsonObject",
    components: {jsonValue, jsonKeyValue},
    data: ()=>({
        masterValue: [],
        count: counter()
    }),
    props: {
    },
    computed: {
        value() {
            let object = {}
            for (const each of this.masterValue) {
                object[each.key] = each.value
            }
            return object
        }
    },
    watch: {
        masterValue: {
            deep: true,
            immediate: true,
            handler() {
                if (this.$listeners.changeValue instanceof Function) {
                    this.$listeners.changeValue(this.value)
                }
            }
        }
    },
    methods: {
        addKeyValue() {
            if (this.masterValue.length == 0) {
                this.$set(this.masterValue, 0, { key: "untitled-1", value: null })
            } else {
                let lastElement = this.masterValue[this.masterValue.length-1]
                this.masterValue = [...this.masterValue, {key: lastElement.key+"-copy", value: null } ]
            }
            // TODO: focus on the name of the newly created element
        },
        updateKeyValue(oldKey, key, value) {
            console.log(`OBJECT ${this.count}: updateKeyValue`)
            console.log(`    value:`, JSON.stringify(this.value))
            console.log(`    root:`,this.$attrs.root)
            for (const eachIndex in this.masterValue) {
                let eachPair = this.masterValue[eachIndex]
                // TODO: raise an error when two pairs have the same key
                if (eachPair.key == oldKey) {
                    this.$set(this.masterValue, eachIndex, { key: key, value: value })
                }
            }
        },
        deleteKey(key) {
            for (const eachIndex in this.masterValue) {
                let eachPair = this.masterValue[eachIndex]
                if (eachPair.key == key) {
                    this.$delete(this.masterValue, eachIndex)
                }
            }
        },
    }
}
</script>
<style lang="scss">
[json-root-fni18943] [json-object-fh3935] {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0.1rem 0.3rem;
    
    & > button {
        margin: 1rem;
    }
}
</style>
