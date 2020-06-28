<template>
    <div unique-285hg2u44-key-value-container >
        <!-- TODO: use the index to allow tabbing through -->
        <!-- TODO: let focus on button show the button -->
        <button unhover-hide-285hg2u44 @click="deleteSelf">
            delete
        </button>
        <div unique-285hg2u44 class="json-editor-key-value json-edit-bubble" >
            <!-- TODO: validate key doesn't overlap other key -->
            <input type="text" :value="key" @input="onInput($event)" placeholder="pick a name">
            
            <jsonValue @changeValue="changeValue" :root="$attrs.root" />
        </div>
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
            console.log(`KEY: changeKey`)
            console.log(`    $event is is:`, $event)
            console.log(`    this.value is:`,this.value)
            console.log(`    parent is:`, this.$attrs.root)
            this.$listeners.changeValue(oldKey, (this.key = $event.target.value), this.value)
        },
        changeValue(newValue) {
            console.log(`KEY: changeValue:`)
            console.log(`    newValue is:`,newValue)
            this.$listeners.changeValue(this.key, this.key, newValue)
            this.value = newValue
        },
        deleteSelf() {
            // TODO: either make a prompt or an undo button
            this.$listeners.delete(this.key)
        },
    }
}
</script>

<style lang="scss">
[unique-285hg2u44-key-value-container] {
    position: relative;
    
    // hovered
    &:hover [unhover-hide-285hg2u44] {
        transform: translate(0, 90%);
    }
    
    // non-hovered button
    [unhover-hide-285hg2u44] {
        // positioning
        position: absolute;
        bottom: 0;
        transform: translate(0, -120%);
        left: 3rem;
        background: rgb(229, 115, 115);
        color:rgb(255, 255, 255);
        
        // size
        height: fit-content;
        width: fit-content;
        
        // color
        box-shadow:rgba(0, 0, 0, 0.22) 0px 3px 5px -1px;
        box-sizing:border-box;
        color: white;
        
        // padding+border
        padding: 0.6em 1.2em;
        --border-radius: 1rem;
        border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        
        // animate it
        transition-delay:0s;
        transition-duration:0.3s;
        transition-property:all;
        transition-timing-function:ease-out;
        // all the normal button properties
        // (just making sure they're not default overridden)
        // border
        border: rgb(190, 190, 190) solid 1.32812px;
        // margin
        margin: 0;
        // outline
        outline-color:rgb(255, 255, 255);
        outline-style:none;
        outline-width:0px;
        // font/text
        font-family:sans-serif;
        font-size:16px;
        font-stretch:100%;
        font-weight:400;
        font-style:normal;
        font-variant-caps:normal;
        font-variant-east-asian:normal;
        font-variant-ligatures:normal;
        font-variant-numeric:normal;
        letter-spacing:normal;
        line-height:normal;
        text-indent:0px;
        text-rendering:auto;
        text-shadow:none;
        text-size-adjust:100%;
        text-transform:none;
        word-spacing:0px;
        writing-mode:horizontal-tb;
        // alignment/positioning
        cursor:pointer;
        align-items:flex-start;
        display:block;
        flex-wrap:nowrap;
        overflow-x: auto;
        overflow-y: auto;
    }
}
[unique-fh3935] [unique-285hg2u44] {
    display: flex;
    flex-direction: row;
    padding: 0.05rem 1.2rem;
    margin-top: 1rem;
    position: relative;
    
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