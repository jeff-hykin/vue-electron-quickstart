<template>
    <div json-list-fh3935 :style="{...$attrs.style}" v-on="$listeners">
        <!-- List everything -->
        <template v-for="(eachElement, index) in this.value">
            <div list-value-container-282345u44 v-bind:key="index">
                <!-- TODO: use the index to allow tabbing through -->
                <jsonValue @changeValue="elementValueChange(index)" :initValue="eachElement" />
                <!-- TODO: let focus on button show the button -->
                <button delete-button-285hg2u44 @click="deleteElement(index)">
                    X
                </button>
            </div>
        </template>
        <button @click="addElement">
            Add
        </button>
    </div>
</template>
<script>
let count = 0
let counter = ()=>++count // FIXME: this is only for debugging

export default {
    name: "jsonObject",
    components: {
        jsonValue: () => import('./jsonValue.vue')
    },
    data: ()=>({
        value: [],
        count: counter()
    }),
    mounted() {
        console.log(`LIST ${count}: mounted`)
        this.value = this.$attrs.initValue || []
    },
    watch: {
        value: {
            deep: true,
            immediate: true,
            handler() {
                // if (this.$listeners.changeValue instanceof Function) {
                //     this.$listeners.changeValue(this.value)
                // }
            }
        }
    },
    methods: {
        addElement() {
            // append an item
            this.$set(this.value, this.value.length, null)
            // TODO: focus on the name of the newly created element
        },
        elementValueChange(key) {
            return (newElementValue) => {
                this.$set(this.value, key, newElementValue)
                // this.$set(this.value, key, value)
                console.log(`LIST ${this.count}: valueChange`)
                console.log(`    value:`, JSON.stringify(this.value))
            }
        },
        deleteElement(key) {
            this.$delete(this.value, key)
        },
    }
}
</script>
<style lang="scss">
[json-root-fni18943] [json-list-fh3935] {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0.1rem 0.3rem;
    
    & > button {
        margin: 1rem;
    }
}
</style>
