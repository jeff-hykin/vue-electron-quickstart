<template>
    <jsonValue :initValue="value" @changeValue="changeValue" @delete="deleteSelf" >
        <!-- TODO: use the index to allow tabbing through -->
        <!-- TODO: validate key doesn't overlap other key -->
        <input
            type="text"
            :value="key"
            @input="onInput($event)"
            @focus="$event.target.select()"
            >
    </jsonValue>
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
        console.log(`KEY: mounted`)
        // TODO: make this a prop instead 
        this.key = this.$attrs.initKey
        this.value = this.$attrs.initValue
        console.log(`this.$attrs is:`,this.$attrs)
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
            this.key = $event.target.value
            console.log(`KEY: changeKey`)
            console.log(`    $event is is:`, $event)
            console.log(`    $event.target.value is:`,$event.target.value)
            console.log(`    this.value is:`,this.value)
            console.log(`    this.key is:`,this.key)
            this.$listeners.changeValue(oldKey, this.key, this.value)
        },
        changeValue(newValue) {
            console.log(`KEY: changeValue:`)
            console.log(`    newValue is:`,newValue)
            // change the local value
            this.value = newValue
            // tell the rest of the tree to update their values
            this.$listeners.changeValue(this.key, this.key, newValue)
        },
        deleteSelf() {
            // TODO: either make a prompt or an undo button
            if (this.value instanceof Object) {
                if (confirm("Are you sure you want to delete this?")) {
                    this.$listeners.delete(this.key)
                }
            } else {
                this.$listeners.delete(this.key)
            }
        },
    }
}
</script>

<style lang="scss">
</style>