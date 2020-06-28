<template>
    <div unique-285hg2u44 class="json-editor-key-value json-edit-bubble" >
        <!-- TODO: validate key doesn't overlap other key -->
        <input type="text" :value="key" @input="onInput($event)" placeholder="pick a name">
        <jsonValue @valueChange="valueChange" :root="$attrs.root" />
    </div>
</template>

<script>
export default {
    name: "jsonKeyValue",
    components: {
        jsonValue: () => import('./jsonValue.vue')
    },
    data: ()=>({
        key: "",
        value: null,
    }),
    mounted() {
        // TODO: make this a prop instead 
        this.key = this.$attrs.key
    },
    computed: {
        // TODO: make this actually do something
        isValid() {
            if (typeof this.key == 'string') {
                if (this.key.length > 0) {
                    return true
                }
            }
        }
    },
    methods: {
        onInput($event) {
            let oldKey = this.key
            console.log(`keyValueOninput: $event is:`,$event)
            console.log(`keyValueOninput: this.value is:`,this.value)
            console.log(`keyValueOninput: parent is:`, this.$attrs.root)
            this.$listeners.changeValue(oldKey, (this.key = $event.target.value), this.value)
        },
        valueChange(newValue) {
            console.log(`keyValueonNewValue: $event is:`,newValue)
            this.$listeners.changeValue(this.key, this.key, newValue)
            this.value = newValue
        }
    }
}
</script>

<style lang="scss">
[unique-fh3935] [unique-285hg2u44] {
    display: flex;
    flex-direction: row;
    padding: 0.05rem 1.2rem;
    margin-top: 1rem;
    
    & > input {
        margin-top: 1.6rem;
        margin-right: 0.7rem;
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