<template>
    <column >
        <Card padding="1rem 0.2rem">
            <column height=10rem width=27rem align-v=top overflow=scroll>
                <span>Heat Data (kJ per mole) </span>
                <div class=grid>
                    <pre></pre>
                    <pre style=align-self:center>    ΔH°</pre>
                    <pre style=align-self:center>    ΔG°</pre>
                    <pre style=align-self:center>    S°</pre>
                    <pre style=align-self:center>    Csp(J)</pre>
                    <template v-for="(value, eachPossibleMolecule) in possibleHeatData" >
                        <pre v-bind:key="eachPossibleMolecule+1">{{eachPossibleMolecule.replace(/\s+/,"")}}</pre>
                        <pre v-bind:key="eachPossibleMolecule+2" style=margin-left:1rem>{{value.H}}</pre>
                        <pre v-bind:key="eachPossibleMolecule+3" style=margin-left:1rem>{{value.G}}</pre>
                        <pre v-bind:key="eachPossibleMolecule+4" style=margin-left:1rem>{{value.S}}</pre>
                        <pre v-bind:key="eachPossibleMolecule+5" style=margin-left:1rem>{{value.Csp}}</pre>
                    </template>
                </div>
            </column>
        </Card>
        <Card>
            <column width=15rem >
                <ui-button @click="clearValues">
                    Clear
                </ui-button>
                <column height=20px />
                
                
                <!-- Search -->
                <!-- positive favors b -->
                <ui-autocomplete
                    label="Molecule Name"
                    placeholder="Enter Molecule Name"
                    :limit=100
                    :sort="sortNames"
                    :suggestions="moleculeNames"

                    v-model="moleculeName"
                />
                
                <!-- Formula -->
                <ui-textbox
                    label="Molecule Formula"
                    type="text"
                    v-model="molecule"
                    />
                <column height=2rem />
                
                <!-- Moles -->
                <ui-textbox
                    label="moles"
                    v-model="moles"
                    />
                <ui-textbox
                    label="multiplier"
                    v-model="multiplier"
                    />
                <ui-textbox
                    label="comparable moles"
                    v-model="comparableMoles"
                    />
                <column height=2rem />
                
                <!-- Grams -->
                <ui-textbox
                    label="grams"
                    v-model="grams"
                    />
                <!-- Molecules -->
                <ui-textbox
                    label="molecules"
                    v-model="molecules"
                    />
                <column height=2rem />
                
                <!-- P (atm) -->
                <ui-textbox
                    label="P (atm)"
                    v-model="P"
                    />
                <!-- V (liters) -->
                <ui-textbox
                    label="V (liters)"
                    v-model="V"
                    />
                <!-- T (kelvin) -->
                <ui-textbox
                    label="T (kelvin)"
                    v-model="T"
                    />
                <column height=2rem />
                
                <!-- Molarity -->
                <ui-textbox
                    label="Molarity"
                    v-model="molarity"
                    />
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
    threshold: 0.2,
    includeScore: true,
})
let moleculeNames = allUtils.allChemicals.map(each=>each.name)

export default {
    components: {
        Card,
    },
    data: ()=>({
        status,
        searchRank: {},
        moleculeNames,
        moleculeData: null,
        molecule: "",
        moleculeName: "",
        molarity: "",
        grams: "",
        molecules: "",
        V: "", // liters
        moles: "", // moles
        multiplier: "", // moles
        comparableMoles: "", // moles
        R: allUtils.R, // liter·atm/mol·K
        T: "", // kelvin
        P: "", // kelvin
        possibleHeatData: [],
    }),
    mounted() {
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
            
            // generate moles
            if (allUtils.exists(this.grams) && this.moleculeData && this.moleculeData.weight) {
                this.moles = this.grams / this.moleculeData.weight
            }
            // generate grams
            if (allUtils.exists(this.moles) && this.moleculeData && this.moleculeData.weight) {
                this.grams = this.moleculeData.weight * this.moles
            }
        },
        comparableMoles() {
            // generate moles
            if (allUtils.exists(this.multiplier, this.comparableMoles)) {
                this.moles = this.comparableMoles * this.multiplier
            }
        },
        multiplier() {
            // generate comparableMoles or moles
            if (allUtils.exists(this.multiplier)) {
                if (allUtils.exists(this.moles)) {
                    this.comparableMoles = this.moles / this.multiplier
                } else if (allUtils.exists(this.comparableMoles)) {
                    this.moles = this.comparableMoles * this.multiplier
                }
            }
        },
        async moleculeName() {
            let result = allUtils.allChemicals.find(each=>each.name == this.moleculeName)
            if (result instanceof Object && result.formula) {
                this.molecule = result.formula
            } else {
                this.molecule = ""
            }
            
            // 
            // update search rank
            // 
            let results = chemicalByName.search(this.moleculeName)
            let resultHash = {}
            for (let each of results) {
                let score = 0
                
                if (each.item.name.startsWith(this.moleculeName)) {
                    score+= 100
                }
                // prefer shorter items
                score -= each.item.name.length
                // prefer low-scoring fuzzyness
                score -= each.score
                
                resultHash[each.item.name] = -score
            }
            for (let each of moleculeNames) {
                if (each == this.moleculeName) {
                    resultHash[each] = -Infinity
                } else if (each.startsWith(this.moleculeName)) {
                    let score = 0
                    score+= 100
                    // prefer shorter items
                    score -= each.length
                    // 
                    resultHash[each] = -score
                } else {
                    resultHash[each] = resultHash[each] == null ? Infinity : resultHash[each]
                }
            }
            moleculeNames.sort((a,b)=>resultHash[a]-resultHash[b])
            this.searchRank = resultHash
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
            // generate grams
            if (allUtils.exists(this.moles) && this.moleculeData && this.moleculeData.weight) {
                this.grams = this.moleculeData.weight * this.moles
            }
            // generate molarity
            if (allUtils.exists(this.moles, this.V)) {
                this.molarity = this.moles / this.V
            // generate volume
            } else if (allUtils.exists(this.molarity, this.moles)) {
                this.V = this.moles / this.molarity
            } 
            // generate atoms/molecule
            if (allUtils.exists(value)) {
                this.molecules = this.moles * allUtils.Avagadro
            }
            
            // geneate comparableMoles
            if (allUtils.exists(this.multiplier, this.multiplier)) {
                // generate comparable moles
                this.comparableMoles = this.moles / this.multiplier
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
    },
    methods: {
        clearValues() {
            this.moleculeData = null 
            this.molecule = "" 
            this.moleculeName = ""
            this.comparableMoles = ""
            this.molecules = ""
            this.multiplier = "" 
            this.molarity = "" 
            this.grams = "" 
            this.V = ""  // liters
            this.moles = ""  // moles
            this.T = ""  // kelvin
            this.P = ""  // kelvin
        },
        sortNames(a,b) {
            return this.searchRank[a]-this.searchRank[b]
        }
    },
}
</script>

<style scoped lang="scss">
.grid {
    width: 95%;
    display: grid;
    grid-template-columns: auto auto auto auto auto;
}

</style>