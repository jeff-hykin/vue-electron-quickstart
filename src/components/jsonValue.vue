<template>
    <div invisible-wrapper-285hg2u44>
        <!-- Select type -->
        <div type-picker-wrapper-fni18943>
            <div type-picker-fni18943>
                <button @click="nextType" >←</button>
                    <span>{{type}}</span>
                <button @click="prevType" >→</button>
            </div>
        </div>
        
        <!-- Display Value -->
        <div value-bubble-285hg2u44 :type="type">
            <!-- for keys -->
            <slot />
            
            <!-- TODO: allow a restrictions argument -->
            <!-- Edit Value -->
            <div json-value-container-fni18943 :type="type">
                <template v-if="type == 'Null'">
                    <span style="font-weight: bold" >NULL</span>
                </template>
                <template v-if="type == 'Number'">
                    <input
                        @input="validateNumber($event)"
                        @keydown="incrementListener($event)"
                        @focus="$event.target.select()"
                        :value="numberValue"
                        >
                </template>
                <template v-if="type == 'String'">
                    <input type="text" v-model="stringValue" placeholder="enter text">
                </template>
                <template v-if="type == 'List'">
                    <jsonList :initValue="listValue" @changeValue="updateListValue" />
                </template>
                <template v-if="type == 'Object'">
                    <jsonObject :initValue="objectValue" @changeValue="updateObjectValue" />
                </template>
            </div>
        </div>
        
        <!-- Delete Button -->
        <!-- TODO: let focus on element show the button -->
        <button v-if="!$attrs.isRoot" delete-button-285hg2u44 @click="onDelete">
            X
        </button>
    </div>
</template>

<script>
export default {
    name: "jsonValue",
    components: {
        jsonObject: () => import('./jsonObject.vue'),
        jsonList: () => import('./jsonList.vue'),
    },
    data: ()=>({
        currentTypeIndex: 0,
        // why have separate values?
        // so that if the type is accidentally toggled
        // it can be toggled back and the old value will be preserved
        numberValue: 0,
        stringValue: "",
        listValue: [],
        objectValue: {},
        typeOptions: [
            "Null",
            "Number",
            "String",
            "List",
            "Object",
        ]
    }),
    mounted() {
        if (this.$attrs.isRoot) {
            this.typeOptions = [ "Object", "List" ]
        }
        console.log(`VALUE: mounted`)
        let initValue = this.$attrs.initValue
        if (typeof initValue == "number" || initValue instanceof Number) {
            this.currentTypeIndex = this.typeOptions.indexOf("Number")
            this.numberValue = initValue || 0 // gets rid of NaN
        } else if (typeof initValue == "string" || initValue instanceof String) {
            this.currentTypeIndex = this.typeOptions.indexOf("String")
            this.stringValue = initValue 
        } else if (initValue instanceof Array) {
            this.currentTypeIndex = this.typeOptions.indexOf("List")
            this.listValue = initValue
        } else if (initValue instanceof Object) {
            this.currentTypeIndex = this.typeOptions.indexOf("Object")
            this.objectValue = initValue
        } else {
            this.currentTypeIndex = this.typeOptions.indexOf("Null")
        }
        // TODO: throw error if this is the root value and its not an Object/Array
    },
    computed: {
        type() {
            // stay in bounds
            if (this.currentTypeIndex == this.typeOptions.length) {
                this.currentTypeIndex = 0
            } else if (this.currentTypeIndex == -1) {
                this.currentTypeIndex = this.typeOptions.length - 1
            }
            // in just a moment tell the parent the value just changed
            setTimeout(()=>this.informParent(this.value), 0)
            return this.typeOptions[this.currentTypeIndex]
        },
        value() {
            // actually change the value
            switch (this.type) {
                case "Null"    : return null
                case "Number"  : return this.numberValue-0
                case "String"  : return this.stringValue
                case "List"    : return this.listValue
                case "Object"  : return this.objectValue
            }
        },
    },
    watch: {
        // only number and string have to be watched because
        // they have direct input boxes
        // the object/list ones have their own callbacks
        numberValue(newValue) {
            // in just a moment tell the parent the value just changed
            setTimeout(()=>this.informParent(this.value), 0)
        },
        stringValue(newValue) {
            // in just a moment tell the parent the value just changed
            setTimeout(()=>this.informParent(this.value), 0)
        },
    },
    methods: {
        informParent(newValue) {
            if (this.$listeners.changeValue instanceof Function) {
                this.$listeners.changeValue(newValue)
            }
        },
        updateObjectValue(newValue) {
            this.objectValue = newValue
            this.informParent(this.value)
        },
        updateListValue(newValue) {
            this.listValue = newValue
            this.informParent(this.value)
        },
        onDelete() {
            if (this.$listeners.delete instanceof Function) {
                this.$listeners.delete()
            }
        },
        validateNumber($event) {
            let value = $event.target.value
            // enforce the input to always be a number
            value = value.replace(/[^\d-]*(-?(\d+\.\d*|\d*\.\d+|\d+)).*/,"$1")
            if (value-0 == value) {
                this.numberValue = $event.target.value = value
            } else {
                this.numberValue = $event.target.value = 0
            }
        },
        incrementListener($event) {
            if ($event.key == "ArrowUp") {
                this.numberValue = ++$event.target.value
            } else if ($event.key == "ArrowDown") {
                this.numberValue = --$event.target.value
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
[json-root-fni18943] {
    [invisible-wrapper-285hg2u44] {
        --light-gray: #e6e6e6; // rgb(194,193,193);
        position: relative;
        width: fit-content;
        
        
        --type-picker-height: 2.2rem;
        --type-picker-animation: all 0.15s ease-in-out 0.2s;
        &:hover > [type-picker-wrapper-fni18943] > [type-picker-fni18943] {
            transform: translate(0, 0);
        }
        [type-picker-wrapper-fni18943] {
            position: absolute;
            top: 0;
            left: 1.5rem;
            height: fit-content;
            width: fit-content;
            transform: translate(0, -100%);
            pointer-events: none;
            overflow: hidden;
            // move thing to bottom
            align-items: flex-end;
            display: flex;
            
            & > [type-picker-fni18943] {
                pointer-events: all; // override the disabling of pointer events from the wrapper
                box-shadow: var(--shadow);
                box-shadow: 3.5px 7.5px 18px -6px rgba(71, 71, 71, 0.82);
                position: relative;
                top: 0;
                left: 0; // get out of the way of the delete button
                transform: translate(0, 100%);
                transition: var(--type-picker-animation);
                padding: 0.4rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                background: gray;
                color: whitesmoke;
                --border-radius: 1rem;
                border-top-left-radius: var(--border-radius);
                border-top-right-radius: var(--border-radius);
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                border-bottom: none;
                
                
                & > span {
                    min-width: 4rem; // width of the largest option (e.g. "Number")
                    text-align: center;
                }
                
                & > button {
                    background-color: transparent;
                    box-shadow: none;
                    outline: none;
                    border: none;
                    margin: 0rem;
                    font-weight: 100;
                    transform: scale(0.9);
                    color: inherit;
                    padding: 0;
                }
            }
        }
        
        --min-bubble-width: 11rem; // due to the size of the type picker
        --min-bubble-height: 1.9rem; // due to min size of text boxes
        --item-spacing: 1rem;
        --min-input-width: 8rem;
        [value-bubble-285hg2u44] {
            display: flex;
            flex-direction: row;
            // padding: 0.05rem 1.2rem;
            // margin-top: 0.5rem;
            position: relative;
            box-shadow: var(--shadow);
            background: white;
            border-radius: 1rem;
            margin-top: 1rem;
            min-width: var(--min-bubble-width);
            min-height: var(--min-bubble-height);
            justify-content: center; /* vertical */ 
            align-items: center;
            
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
            
            [json-value-container-fni18943]  {
                &[type="Object"], &[type="List"] {
                    // fill the area
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: calc(var(--type-picker-height) - var(--item-spacing)); // bigger than the type-selector popup
                    padding-right: 0.3rem; // fix pixel bug
                    padding-left: 0.3rem;
                    padding-bottom: 0.5rem;
                    box-shadow: inset 3.5px 7.5px 18px -13px rgba(71, 71, 71, 0.82);
                    background: #e8e6e6;
                    // box-shadow: inset 8.5px 12.5px 18px -13px rgba(71,71,71,0.72);
                    // background: #f5f5f5;
                    border-radius: 1rem;
                    // background: var(--light-gray);
                    align-items: flex-start;
                    margin: 0.4rem;
                    margin-right: calc(0.4rem + 0.4px); // fix pixel bug
                }
                
                &[type="String"] {
                    justify-content: center; /* vertical */ 
                    align-items: center;
                }
                
                &[type="Number"] {
                    justify-content: center; /* vertical */ 
                    align-items: center;
                    & > input {
                        text-align: right;
                        width: var(--min-input-width); // prefer to stay small
                    }
                }
                
                &[type="Null"] {
                    color: gray;
                }
                
                & > input {
                    min-height: var(--min-bubble-height);
                    padding: 0 1.5rem; // because of the delete button overlap
                    min-width: var(--min-input-width);
                    flex-grow: 1;
                    margin: 0;
                    border-radius: 1rem;
                    background: white;
                    box-shadow: var(--shadow);
                    box-sizing: content-box;
                }
            }
        }
        
        // hovered
        &:hover {
            & > [delete-button-285hg2u44] {
                opacity: 1;
                transform: translate(-45%, -45%) scale(1);
            }
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
            box-shadow: var(--shadow);
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
            transition: opacity 0.1s ease-in 0.1s, transform 0.1s ease-in 0.1s;
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
}
</style>