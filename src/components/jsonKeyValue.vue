<template>
    <div key-value-container-285hg2u44 >
        <!-- TODO: use the index to allow tabbing through -->
        <div key-value-bubble-285hg2u44 >
            <!-- TODO: validate key doesn't overlap other key -->
            <input
                type="text"
                :value="$attrs.pair.key"
                @input="onInput($event)"
                >
                <!-- @focus="$event.target.select()" -->
            
            <jsonValue :value="$attrs.pair.value" @changeValue="changeValue" :root="$attrs.root" />
        </div>
        <!-- TODO: let focus on element show the button -->
        <button delete-button-285hg2u44 @click="deleteSelf">
            X
        </button>
    </div>
</template>

<script>
export default {
    name: "jsonKeyValue",
    components: {
        jsonValue: () => import('./jsonValue.vue')
    },
    mounted() {
        // TODO: make pair a prop instead
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
        key() {
            return this.$attrs.pair.key
        },
        value() {
            return this.$attrs.pair.value
        },
        onInput($event) {
            console.log(`KEY: changeKey`)
            console.log(`    $event is is:`, $event)
            console.log(`    this.value is:`,this.value())
            console.log(`    parent is:`, this.$attrs.root)
            let newKey = $event.target.value
            this.$listeners.changeValue(this.key(), newKey, this.value())
        },
        changeValue(newValue) {
            this.$listeners.changeValue(this.key(), this.key(), newValue)
        },
        deleteSelf() {
            // TODO: either make a prompt or an undo button
            if (this.value() instanceof Object) {
                if (confirm("Are you sure you want to delete this?")) {
                    this.$listeners.delete(this.key())
                }
            } else {
                this.$listeners.delete(this.key())
            }
        },
    }
}
</script>

<style lang="scss">
[key-value-container-285hg2u44] {
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
[json-root-fni18943] [key-value-bubble-285hg2u44] {
    display: flex;
    flex-direction: row;
    padding: 0.05rem 1.2rem;
    margin-top: 0.5rem;
    position: relative;
    box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
    background: white;
    border-radius: 1rem;
    
    // the key
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