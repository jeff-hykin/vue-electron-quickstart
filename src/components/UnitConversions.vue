<template>
    <Card>
        <column >
            <pre>Unit Conversion</pre>
            <!-- input -->
            <ui-textbox 
                @input="runCalc"
                v-model="input"
                />
            <!-- outputs -->
            <row max-width=40rem overflow=auto>
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