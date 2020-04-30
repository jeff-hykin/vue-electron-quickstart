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
            // generate moles
            if (allUtils.exists(this.V, this.molarity)) {
                this.moles = this.V * this.molarity
            // generate volume
            } else if (allUtils.exists(this.molarity, this.moles)) {
                this.V = this.moles / this.molarity
            }
        },
        moles(value) {
            if (this.moleculeData && this.moleculeData.weight) {
                this.grams = this.moleculeData.weight * value
            }
            // generate molarity
            if (allUtils.exists(this.moles, this.V)) {
                this.molarity = this.moles / this.volume
            // generate volume
            } else if (allUtils.exists(this.molarity, this.moles)) {
                this.V = this.moles / this.molarity
            }
        },
        grams(value) {
            // unit convert
            value = allUtils.convertToG(value)
            if (this.grams != value) {
                this.grams = value
                return
            }
            // generate moles (and therefore molarity if possible)
            if (this.moleculeData && this.moleculeData.weight) {
                this.moles = value / this.moleculeData.weight
            }
        },
        P(value) {
            if (allUtils.exists(this.P, this.V, this.T)) {
                this.moles = (this.P * this.V)/(this.R * this.T)
            }
        },
        V(value) {
            // unit conversion
            value = allUtils.convertToL(value)
            if (this.V != value) {
                this.V = value
                return
            }
            // generate moles from PVnRT if avalible
            if (allUtils.exists(this.P, value, this.T)) {
                this.moles = (this.P * value)/(this.R * this.T)
            // else try generate from molarity
            } else if (allUtils.exists(this.molarity)) {
                this.moles = value * this.molarity
            }
        },
        T(value) {
            // unit convert
            value = allUtils.convertToK(value)
            if (this.T != value) {
                this.T = value
                return
            }
            
            if (allUtils.exists(this.P, this.V, value)) {
                this.moles = (this.P * this.V)/(this.R * value)
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