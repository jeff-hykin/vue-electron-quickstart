<template>
    <Card>
        <column >
            <pre>{{status}}</pre>
            <row >
                <column margin-left=0.2rem margin-right=0.2rem >
                    <ui-textbox @input="runCalc" label="Pressure" v-model="P" />
                    <row >{{this.outputP}} </row>
                </column>
                <column margin-left=0.2rem margin-right=0.2rem >
                    <ui-textbox @input="runCalc" label="Volume" v-model="V" />
                    <row >{{this.outputV}} </row>
                </column>
                =
                <column margin-left=0.2rem margin-right=0.2rem >
                    <ui-textbox @input="runCalc" label="Moles" v-model="n" />
                    <row >{{this.outputn}} </row>
                </column>
                R
                <column margin-left=0.2rem margin-right=0.2rem >
                    <ui-textbox @input="runCalc" label="Temperature" v-model="T" />
                    <row >{{this.outputT}} </row>
                </column>
            </row>
            <ui-button @click="clearValues">
                Clear
            </ui-button>
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
        status,
        // constants
        R: allUtils.R, // liter·atm/mol·K
        // inputs
        P: "", // atm
        V: "", // liters
        n: "", // moles
        T: "", // kelvin
        // outputs
        outputP: "", // atm
        outputV: "", // liters
        outputn: "", // moles
        outputT: "", // kelvin
    }),
    methods: {
        runCalc() {
            this.P = allUtils.convertTo(this.P, "atm")
            this.V = allUtils.convertTo(this.V,"L")
            this.n = allUtils.toNumber(this.n)
            this.T = allUtils.convertTo(this.T,"K")
            
            // figure out which is missing and respond accordingly
            this.status = allUtils.calcHandle(this, {
                P: ()=>(this.outputP = (this.n * this.R * this.T)/this.V),
                V: ()=>(this.outputV = (this.n * this.R * this.T)/this.P),
                n: ()=>(this.outputn = (this.P * this.V)/(this.R * this.T)),
                T: ()=>(this.outputT = (this.P * this.V)/(this.n * this.R)),
            })
        },
        clearValues() {
            this.P = ""
            this.V = ""
            this.n = ""
            this.T = ""
        }
    },
}
</script>

<style>

</style>