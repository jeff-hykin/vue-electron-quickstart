<template>
    <div json-root-fni18943 override-fni18943>
        <!-- TODO: allow a restrictions argument -->
        
        <!-- Select type -->
        <div json-root-fni18943-type-picker>
            <button @click="nextType" >←</button>
                <span>{{type}}</span>
            <button @click="prevType" >→</button>
        </div>
        <!-- Edit Value -->
        <div json-root-value-fni18943>
            <template v-if="type == 'List'">
                <div>FIXME</div>
            </template>
            <template v-if="type == 'Object'">
                <jsonObject @changeValue="informParent" :root="$attrs.root" />
            </template>
        </div>
    </div>
</template>

<script>
const typeOptions = [
    "Object",
    "List",
]
export default {
    name: "jsonRoot",
    components: {
        jsonObject: () => import('./jsonObject.vue')
    },
    data: ()=>({
        currentTypeIndex: 0,
        listValue: [],
        objectValue: {},
    }),
    computed: {
        type() {
            // stay in bounds
            if (this.currentTypeIndex == typeOptions.length) {
                this.currentTypeIndex = 0
            } else if (this.currentTypeIndex == -1) {
                this.currentTypeIndex = typeOptions.length - 1
            }
            // in just a moment tell the parent the value just changed
            setTimeout(()=>this.informParent(this.value), 0)
            return typeOptions[this.currentTypeIndex]
        },
        value() {
            // actually change the value
            switch (this.type) {
                case "List"    : return this.listValue
                case "Object"  : return this.objectValue
            }
        },
    },
    watch: {
    },
    methods: {
        informParent(newValue) {
            if (this.$listeners.changeValue instanceof Function) {
                this.$listeners.changeValue(newValue)
            }
        },
        nextType() {
            this.currentTypeIndex++
        },
        prevType() {
            this.currentTypeIndex--
        },
    },
}
</script>

<style lang="scss">
// by default disable things caused by bootstrap
* {
    flex-wrap: nowrap; /* to disable bootstraps global CSS */
    margin: 0; /* to disable bootstraps global CSS */
}
[json-root-fni18943][override-fni18943] {
    margin: 1rem;
    
}
[delete-button-285hg2u44] {
    // positioning
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transform: translate(-30%, -30%) scale(0.7);
    // transform: translate(0, 120%);
    // left: 2.65rem;
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
    border-radius: 0.3rem;
    padding: 0.3rem 0.5rem;
    // border-top-left-radius: var(--border-radius);
    // border-top-right-radius: var(--border-radius);
    // border-bottom-left-radius: 0;
    // border-bottom-right-radius: 0;
    
    // animate it
    transition: opacity 0.1s ease-in 0s, transform 0.1s ease-in 0s;
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
</style>