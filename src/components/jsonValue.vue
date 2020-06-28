<template>
    <div json-value-container-fni18943>
        <!-- TODO: allow a restrictions argument -->
        
        <!-- Select type -->
        <div json-value-container-fni18943-type-picker>
            <button @click="nextType" >←</button>
                <span>{{type}}</span>
            <button @click="prevType" >→</button>
        </div>
        <!-- Edit Value -->
        <div json-value-container-fni18943-value>
            <template v-if="type == 'Null'">
                <span style="font-weight: bold" >NULL</span>
            </template>
            <template v-if="type == 'Number'">
                <input
                    number
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
    "Null",
    "Number",
    "String",
    "List",
    "Object",
]
export default {
    name: "jsonValue",
    components: {
        jsonObject: () => import('./jsonObject.vue')
    },
    data: ()=>({
        currentTypeIndex: 0,
        numberValue: 0,
        stringValue: "",
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
                case "Null"    : return null
                case "Number"  : return this.numberValue-0
                case "String"  : return this.stringValue
                case "List"    : return this.listValue
                case "Object"  : return this.objectValue
            }
        },
    },
    watch: {
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
[json-root-fni18943] [json-value-container-fni18943] {
    margin: 0.4rem;
}
[json-value-container-fni18943] {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.2rem 0.3rem 0.5rem;
    box-shadow: inset 2px 3px 8px #55555573; // sunken-down effect
    border-radius: 1rem;
    background: #3130304a;
    align-items: flex-start;

    & > [json-value-container-fni18943-type-picker] {
        margin: 0 0.1rem;
        padding: 0 0.5rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        color: gray;
        
        & > span {
            min-width: 5.7rem; // width of the largest option (e.g. "Number")
            text-align: center;
        }
        
        & > button {
            background-color: transparent;
            box-shadow: none;
            outline: none;
            border: none;
            margin: 0.2rem;
            font-weight: 100;
            transform: scale(0.9);
            color: inherit;
        }
    }
    
    & > [json-value-container-fni18943-value] {
        min-height: 2.12rem;
        display: flex;
        align-items: center;
        align-self: center;
        
        & > input {
            padding: 0.3rem 0.7rem;
            border-radius: 1rem;
            box-sizing: content-box;
            background: white;
            height: 1.3em;
            box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
            
            &[number] {
                text-align: right;
                width: 6.5rem;
                padding: 0.3rem 1.2rem;
            }
        }
    }
}
</style>