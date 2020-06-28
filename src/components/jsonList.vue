<template>
    <div json-object-fh3935 :style="{...$attrs.style}" v-on="$listeners">
        <!-- List everything -->
        <template v-for="(eachElement, index) in this.value">
            <div list-value-container-282345u44 v-bind:key="index">
                <!-- TODO: use the index to allow tabbing through -->
                <jsonValue @changeValue="elementValueChange(index)" :value=each :root="$attrs.root" />
                <!-- TODO: let focus on button show the button -->
                <button delete-button-285hg2u44 @click="deleteElement(index)">
                    X
                </button>
            </div>
        </template>
        <button @click="addKeyValue">
            Add
        </button>
    </div>
</template>
<script>
import jsonValue from "./jsonValue"

let count = 0
let counter = ()=>++count // FIXME: this is only for debugging

export default {
    name: "jsonObject",
    components: {jsonValue},
    data: ()=>({
        value: [],
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
        updateValue(index, value) {
            this.$set(this.value, index, value)
            console.log(`LIST ${this.count}: updateValue`)
            console.log(`    value:`, JSON.stringify(this.value))
            console.log(`    root:`,this.$attrs.root)
        },
        deleteElement(key) {
            if (key in this.value) {
                this.$delete(this.value, key)
            }
        },
    }
}
</script>
<style lang="scss">
[list-value-container-282345u44] {
    position: relative;
    width: fit-content;
    
    // hovered
    &:hover {
        & > [delete-button-285hg2u44] {
            opacity: 1;
            transform: translate(-45%, -45%) scale(1);
        }
    }
}
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
