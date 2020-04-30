<template>
    <column >
        <Card>
            <column height=10rem width=30rem align-v=top overflow=scroll>
                <span>Heat Data</span>
                <div class=grid>
                    <pre></pre>
                    <pre style=align-self:center>    H</pre>
                    <pre style=align-self:center>    G</pre>
                    <pre style=align-self:center>    S</pre>
                    <template v-for="(value, eachPossibleMolecule) in possibleHeatData" >
                        <pre v-bind:key="eachPossibleMolecule+1">{{eachPossibleMolecule}}: </pre>
                        <pre v-bind:key="eachPossibleMolecule+2" style=margin-left:1rem>{{value.H}}</pre>
                        <pre v-bind:key="eachPossibleMolecule+3" style=margin-left:1rem>{{value.G}}</pre>
                        <pre v-bind:key="eachPossibleMolecule+4" style=margin-left:1rem>{{value.S}}</pre>
                    </template>
                </div>
            </column>
        </Card>
        <Card>
            <column >
                <ui-button @click="clearValues">
                    Clear
                </ui-button>
                <column height=20px />
                <row class='input-label' align-h=space-between >
                    <p>molecule search</p>
                    <ui-autocomplete
                        label="Molecule Name"
                        placeholder="Start Typing Molecule Name"

                        :suggestions="moleculeNames"

                        v-model="moleculeName"
                    />
                </row>
                
                <row class='input-label' align-h=space-between >
                    <p>molecule</p>
                    <input  type="text" v-model="molecule">
                </row>
                
                
                <column height=2rem />
                
                <row class='input-label' align-h=space-between >
                    <p>moles</p>
                    <input  type="text" v-model="moles">
                </row>
                
                <column height=2rem />
                
                <row class='input-label' align-h=space-between >
                    <p>grams</p>
                    <input  type="text" v-model="grams">
                </row>
                <row class='input-label' align-h=space-between >
                    <p>molecules</p>
                    <input  type="text" v-model="molecules">
                </row>
                
                <column height=2rem />
                
                <row class='input-label' align-h=space-between >
                    <p>P (atm)</p>
                    <input  type="text" v-model="P">
                </row>
                <row class='input-label' align-h=space-between >
                    <p>V (liters)</p>
                    <input  type="text" v-model="V">
                </row>
                <row class='input-label' align-h=space-between >
                    <p>T (kelvin)</p>
                    <input  type="text" v-model="T">
                </row>
                
                <column height=2rem />
                
                <row class='input-label' align-h=space-between >
                    <p>Molarity</p>
                    <input  type="text" v-model="molarity">
                </row>
                
                
                <column height=2rem />
                
                <pre>{{moleculeDataFormatted}}</pre>
            </column>
        </Card>
    </column>
</template>

<script>
import Card from '@/components/Card'
import allUtils from '../util/allUtils'
import yaml from "js-yaml"
import Fuse from "fuse.js"

const chemicalByName = new Fuse(allUtils.allChemicals, {
    keys: ["name"],
    threshold: 0.1,
})

export default {
    components: {
        Card,
    },
    data: ()=>({
        status,
        moleculeData: null,
        molecule: "",
        moleculeName: "",
        molarity: "",
        grams: "",
        molecules: "",
        V: "", // liters
        moles: "", // moles
        R: allUtils.R, // liter·atm/mol·K
        T: "", // kelvin
        P: "", // kelvin
        possibleHeatData: [],
    }),
    mounted() {
        console.log(`this.$attrs is:`,this.$attrs)
    },
    watch: {
        async molecule(value) {
            this.moleculeData = await allUtils.getMoleculeData(value)
            
            // 
            // get heat data
            // 
            let possibleMolecules = Object.keys(allUtils.heatData)
            let simpleSearch = new RegExp(`${this.molecule}`,"gi")
            possibleMolecules = possibleMolecules.filter(each=>each.replace(/[^a-zA-Z0-9]/g,"").match(simpleSearch))
            possibleMolecules = possibleMolecules.sort((a,b)=>a.length-b.length)
            let results = {}
            for (let each of possibleMolecules) {
                results[each] = allUtils.heatData[each]
            }
            this.possibleHeatData = results
            
            //
            // get name
            //
            // chemicalByName.search("silver")
        },
        async moleculeName() {
            let result = allUtils.allChemicals.find(each=>each.name == this.moleculeName)
            if (result instanceof Object && result.formula) {
                this.molecule = result.formula
            } else {
                this.molecule = ""
            }
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
            // generate atoms/molecule
            if (allUtils.exists(value)) {
                this.molecules = this.moles * allUtils.Avagadro
            }
        },
        grams(value) {
            // unit convert
            value = allUtils.convertTo(value, "g")
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
            value = allUtils.convertTo(value,"L")
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
    computed: {
        moleculeDataFormatted() {
            return yaml.safeDump(this.moleculeData, {
                sortKeys: true
            })
        },
        moleculeNames() {
            return allUtils.allChemicals.map(each=>each.name)
        }
    },
    methods: {
        clearValues() {
            this.moleculeData = null 
            this.molecule = "" 
            this.molarity = "" 
            this.grams = "" 
            this.V = ""  // liters
            this.moles = ""  // moles
            this.T = ""  // kelvin
            this.P = ""  // kelvin
        }
    },
}
</script>

<style scoped lang="scss">
.input-label {
    width: 15rem;
}
.grid {
    width: 25rem;
    display: grid;
    grid-template-columns: auto auto auto auto;
}
</style>