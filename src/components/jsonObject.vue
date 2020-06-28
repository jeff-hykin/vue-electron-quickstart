<template>
    <div unique-fh3935 class="json-editor-object" :style="{...$attrs.style}" v-on="$listeners">
        <!-- <jsonValue /> -->
        <jsonKeyValue />
    </div>
</template>
<script>
import jsonKeyValue from "./jsonKeyValue";
import jsonValue from "./jsonValue";

export default {
    components: {jsonValue, jsonKeyValue},
    props: {
    },
    computed: {
    },
    methods: {
        addElement(whichElement) {
            console.log(`whichElement is:`,whichElement)
        }
    }
}
</script>
<style lang="scss">
.json-editor-object[unique-fh3935] {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    margin: 1;
}
[unique-fh3935] * {
    flex-wrap: nowrap; /* to disable bootstraps global CSS */
    margin: 0; /* to disable bootstraps global CSS */
}
[unique-fh3935], [unique-fh3935] .json-edit-bubble {
    display: flex;
    box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
    background: white;
    border-radius: 1rem;
}
</style>
