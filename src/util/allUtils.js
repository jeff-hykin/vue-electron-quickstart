const util = require('util')
const exec = util.promisify(require('child_process').exec)

let getMoleculeData = async (stringChemical) => {
    let rubyForm = stringChemical.replace(/(\d+)/g, "\*$1").replace(/(?<=[a-zA-Z0-9])([A-Z])/g,"+$1")
    console.log(`rubyForm is:`,rubyForm)
    const { stdout, stderr } = await exec(`ruby "/Users/jeffhykin/Nextcloud/Programming/ruby-chem/get_data.rb" '${rubyForm}'`)
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
    if (maybeNan != maybeNan) {
        return value
    } else {
        return maybeNan
    }
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
    convertToL(value) {
        let diffValue = `${value}`.match(/(.+?)\s*(ml)/i)
        let actualValue
        let unit
        if (diffValue) {
            actualValue = diffValue[1]-0
            unit = diffValue[2]
            // mL to L
            return toNumber(actualValue) * 0.001
        } else {
            return toNumber(value)
        }
    },
    convertToG(value) {
        let diffValue = `${value}`.match(/(.+?)\s*(mg)/i)
        let actualValue
        let unit
        if (diffValue) {
            actualValue = diffValue[1]-0
            unit = diffValue[2]
            // mg to g
            return toNumber(actualValue) * 0.001
        } else {
            return toNumber(value)
        }
    },
    convertToK(value) {
        let diffValue = `${value}`.match(/(.+?)\s*(C)/i)
        let actualValue
        let unit
        if (diffValue) {
            actualValue = diffValue[1]-0
            unit = diffValue[2]
            // mg to g
            return toNumber(actualValue) + 273.15
        } else {
            return toNumber(value)
        }
    },
    pressureConvert(value) {
        let diffValue = `${value}`.match(/(.+?)\s*(tor|mmhg|p)/i)
        let actualValue
        let unit
        if (diffValue) {
            actualValue = diffValue[1]-0
            unit = diffValue[2]
            // conversion
            // TODO
        }
    },
    getMoleculeData
}