<template>
    <!-- just a wrapper aroung the first value -->
    <div json-root-fni18943 override-fni18943>
        <jsonValue :initValue="$attrs.initValue" @changeValue="changeHandler" isRoot=true />
    </div>
</template>

<script>
import jsonValue from "./jsonValue"

export default {
    name: "jsonRoot",
    components: {
        jsonValue
    },
    mounted() {
        console.log(`ROOT: mounted`)
    },
    methods: {
        changeHandler(...args) {
            if (this.$listeners.changeValue instanceof Function) {
                this.$listeners.changeValue(...args)
            }
        }
    }
}
</script>

<style lang="scss">
// by default disable things caused by bootstrap
// FIXME
* {
    flex-wrap: nowrap; /* to disable bootstraps global CSS */
    margin: 0; /* to disable bootstraps global CSS */
}
[json-root-fni18943] {
    --old-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
    --shadow: 3.5px 7.5px 18px -13px rgba(71, 71, 71, 0.82);
}
[json-root-fni18943][override-fni18943] {
    margin: 1rem;
    margin-top: 2rem;
}
</style>