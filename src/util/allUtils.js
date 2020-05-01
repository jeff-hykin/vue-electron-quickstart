const util = require('util')
const exec = util.promisify(require('child_process').exec)
let path = require('path')
const execFile = util.promisify(require('child_process').execFile)
let heatData = require("./heatData.json")
let allChemicals = require("./allChemicals.json")

let getMoleculeData = async (stringChemical) => {
    let rubyForm = stringChemical.replace(/(\d+)/g, "\*$1").replace(/(?<=[a-zA-Z0-9])([A-Z\(])/g,"+$1")
    console.log(`rubyForm of chemical formula is:`,rubyForm)
    const { stdout, stderr } = await execFile(`ruby`, [ `${path.normalize("./ruby-chem/get_data.rb")}`, rubyForm])
    return JSON.parse(stdout)
}

let exists = (...values) => {
    for (let each of values) {
        if (each == null || (typeof each == 'string' && each.length == 0)) {
            return false
        }
    }
    return true
}

let toNumber = (value) => {
    if (!exists(value)) {
        return value
    }
    let maybeNan = value-0
    // this is only true if NaN
    if (maybeNan != maybeNan) {
        return value
    } else {
        return maybeNan
    }
}

let convertToAll = (input) => {
    let valueAndUnits = `${input}`.match(/(.*\d)\s*([\D\S].*)$/i)
    if (valueAndUnits) {
        let value = valueAndUnits[1]
        let units = valueAndUnits[2]
        value = toNumber(value)
        // 
        // pressure
        // 
        if (units.match(/atm|torr|mmhg|kpa|pa/i)) {
            let atm
            // get atm first
            if (units.match(/atm/i)) {
                atm = value
            } else if (units.match(/torr/i)) {
                atm = value/760
            } else if (units.match(/mmhg/i)) {
                atm = value/759.99995199606
            } else if (units.match(/kpa/i)) {
                atm = value/101.325
            } else if (units.match(/pa/i)) {
                atm = value/101325
            }
            // calculate the rest
            return [
                {
                    value: atm,
                    unit: "atm",
                },
                {
                    value: atm*760,
                    unit: "torr",
                },
                {
                    value: atm*759.99995199606,
                    unit: "mmHg",
                },
                {
                    value: atm*101.325,
                    unit: "kPa",
                },
                {
                    value: atm*101325,
                    unit: "pa",
                    isSi: true,
                }
            ]
        // 
        // temperature
        // 
        } else if (units.match(/^°?(K|C|F)$/i)) {
            let kelvin
            // get kelvin first
            if (units.match(/K/i)) {
                kelvin = value
            } else if (units.match(/C/i)) {
                kelvin = value + 273.15
            } else if (units.match(/F/i)) {
                kelvin = ((value - 32) / 1.8) + 273.15
            }
            // calculate the rest
            return [
                {
                    value: kelvin,
                    unit: "K",
                    isSi: true,
                },
                {
                    value: kelvin - 273.15,
                    unit: "C",
                },
                {
                    value: ((9 * kelvin)/5) - (45967/100),
                    unit: "F",
                },
            ]
        // 
        // mass
        // 
        } else if (units.match(/^(mg|g|kg)$/i)) {
            let grams
            // get grams first
            if (units.match(/^g$/i)) {
                grams = value
            } else if (units.match(/kg/i)) {
                grams = value * 1000
            } else if (units.match(/mg/i)) {
                grams = value / 1000
            }
            // calculate the rest
            return [
                {
                    value: grams,
                    unit: "g",
                },
                {
                    value: grams / 1000,
                    unit: "kg",
                    isSi: true,
                },
                {
                    value: grams * 1000,
                    unit: "mg",
                },
            ]
        // 
        // volume
        // 
        } else if (units.match(/^(L|mL)$/i)) {
            let liters
            // get grams first
            if (units.match(/^L$/i)) {
                liters = value
            } else if (units.match(/mL/i)) {
                liters = value / 1000
            }
            // calculate the rest
            return [
                {
                    value: liters,
                    unit: "L",
                    isSi: true,
                },
                {
                    value: liters * 1000,
                    unit: "mL",
                },
            ]
        }
    }
    return input
}

let convertToSi = (input) => {
    let outputs = convertToAll(input)
    if (outputs instanceof Array) {
        let siUnits = outputs.filter(each=>each.isSi)
        if (siUnits.length == 1) {
            return siUnits[0].value
        }
    }
    return outputs
}

let convertTo = (input, unit) => {
    let outputs = convertToAll(input)
    if (outputs instanceof Array) {
        let valuedUnit = outputs.find(each=>each.unit == unit)
        if (valuedUnit != undefined) {
            return valuedUnit.value
        }
    }
    return input
}

export default {
    toNumber,
    exists,
    findMissing: (that, ...keysArray)=> {
        let missingValues = []
        for (const key of keysArray) {
            if (exists(value)) {
                missingValues.push(key)
            }
        }
        return missingValues
    },
    // returns status 
    calcHandle: (that, objectOfFuncs) => {
        let missingValues = []
        for (const key in objectOfFuncs) {
            if (that[key] == null || (typeof that[key] == 'string' && that[key].length == 0)) {
                missingValues.push(key)
            }
        }
        if (missingValues.length == 0) {
            return "no missing value to solve for"
        } else if (missingValues.length > 1) {
            return `still missing: ${missingValues}`
        } else {
            let missingValue = missingValues[0]
            let output = objectOfFuncs[missingValue]()
            return `solved for ${missingValue} ${output}`
        }
    },
    convertToAll,
    getMoleculeData,
    convertToSi,
    convertTo,
    R: 0.0821, // liter·atm/mol·K
    Avagadro: 6.0221415 * (10 ** 23),
    heatData,
    allChemicals,
}