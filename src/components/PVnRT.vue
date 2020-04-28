<template>
    <Card>
        <column >
            <pre>{{status}}</pre>
            <row >
                <input @input="runCalc" type="text" placeholder="P (atm)" v-model="P">
                <input @input="runCalc" type="text" placeholder="V (liters)" v-model="V">
                =
                <input @input="runCalc" type="text" placeholder="n (moles)" v-model="n">
                R
                <input @input="runCalc" type="text" placeholder="T (kelvin)" v-model="T">
            </row>
            <button @click="clearValues">
                Clear
            </button>
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
        P: "", // atm
        V: "", // liters
        n: "", // moles
        R: 0.0821, // liter·atm/mol·K
        T: "", // kelvin
    }),
    methods: {
        runCalc() {
            this.P = allUtils.toNumber(this.P)
            this.V = allUtils.convertToL(this.V)
            this.n = allUtils.toNumber(this.n)
            this.T = allUtils.convertToK(this.T)
            
            this.status = allUtils.calcHandle(this, {
                P: ()=>(this.P = (this.n * this.R * this.T)/this.V),
                V: ()=>(this.V = (this.n * this.R * this.T)/this.P),
                n: ()=>(this.n = (this.P * this.V)/(this.R * this.T)),
                T: ()=>(this.T = (this.P * this.V)/(this.n * this.R)),
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