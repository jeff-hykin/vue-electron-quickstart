<template>
    <Card>
        <column >
            <button @click="clearValues">
                Clear
            </button>
            <row >
                <p>molecule</p>
                 <input  type="text" v-model="molecule">
            </row>
            
            <column height=2rem />
            
            <row >
                <p>moles</p>
                 <input  type="text" v-model="moles">
            </row>
            
            <column height=2rem />
            
            <row >
                <p>grams</p>
                 <input  type="text" v-model="grams">
            </row>
            
            <column height=2rem />
            
            <row >
                <p>P (atm)</p>
                 <input  type="text" v-model="P">
            </row>
            <row >
                <p>V (liters)</p>
                 <input  type="text" v-model="V">
            </row>
            <row >
                <p>T (kelvin)</p>
                 <input  type="text" v-model="T">
            </row>
            
            <column height=2rem />
            
            <row >
                <p>Molarity</p>
                 <input  type="text" v-model="molarity">
            </row>
            
            
            <column height=2rem />
            
            <pre>{{moleculeData}}</pre>
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
        moleculeData: null,
        molecule: "",
        molarity: "",
        grams: "",
        V: "", // liters
        moles: "", // moles
        R: 0.0821, // liter·atm/mol·K
        T: "", // kelvin
        P: "", // kelvin
    }),
    watch: {
        async molecule(value) {
            this.moleculeData = await allUtils.getMoleculeData(value)
        },
        molarity(value) {
            if (allUtils.exists(this.V)) {
                this.moles = this.V * this.molarity
            }
        },
        moles(value) {
            if (this.moleculeData && this.moleculeData.weight) {
                this.grams = this.moleculeData.weight * value
            }
        },
        grams(value) {
            value = allUtils.convertToG(value)
            if (this.moleculeData && this.moleculeData.weight) {
                this.moles = value / this.moleculeData.weight
            }
            if (this.grams != value) {
                this.grams = value
            }
        },
        P(value) {
            if (allUtils.exists(this.P, this.V, this.T)) {
                this.moles = (this.P * this.V)/(this.R * this.T)
            }
        },
        V(value) {
            value = allUtils.convertToL(value)
            if (allUtils.exists(this.P, value, this.T)) {
                this.moles = (this.P * value)/(this.R * this.T)
            }
            if (allUtils.exists(this.molarity)) {
                this.moles = value * this.molarity
            }
            if (this.V != value) {
                this.V = value
            }
        },
        T(value) {
            value = allUtils.convertToK(value)
            if (allUtils.exists(this.P, this.V, value)) {
                this.moles = (this.P * this.V)/(this.R * value)
            }
            if (this.T != value) {
                this.T = value
            }
        },
    },
    methods: {
        clearValues() {
            this.moleculeData = null 
            this.molecule = "" 
            this.molarity = "" 
            this.grams = "" 
            this.V = ""  // liters
            this.moles = ""  // moles
            this.R = 0.0821  // liter·atm/mol·K
            this.T = ""  // kelvin
            this.P = ""  // kelvin
        }
    },
}
</script>

<style>

</style>