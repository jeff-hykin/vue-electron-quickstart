<template>
    <Card>
        <column >
            <pre>Unit Conversion</pre>
            <!-- input -->
            <column >
                <input @input="runCalc" type="text" placeholder="anything" v-model="input">
            </column>
            <!-- outputs -->
            <row >
                <column v-bind:key="outputUnits.unit" v-for="outputUnits of outputs" padding=1rem >
                    <pre>{{outputUnits.value}}</pre>
                    <pre>{{outputUnits.unit}}</pre>
                </column>
            </row>
        </column>
    </Card>
</template>

<script>
import Card from '@/components/Card'
import allUtils from '../util/allUtils'
export default {
    components: {
        Card,
    },
    data: ()=>({
        input: "",
        outputs: [],
    }),
    methods: {
        runCalc() {
            this.outputs = allUtils.convertToAll(this.input)
        },
    },
}
</script>

<style>

</style>