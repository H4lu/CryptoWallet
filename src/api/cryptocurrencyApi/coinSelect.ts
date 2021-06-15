import { 
    ChainSoUnspentTransaction, 
    dustThreshold, 
    finalize, 
    inputBytes, 
    sumOrNaN, 
    transactionBytes, 
    uintOrNaN 
} from "./utils"


function accumulative(
    utxos: Array<ChainSoUnspentTransaction>, 
    outputs: any, 
    feeRate: any
    ) {
        if (!isFinite(uintOrNaN(feeRate))) return {}
        let bytesAccum = transactionBytes([], outputs)
    
        let inAccum = 0
        let inputs = []
        let outAccum = sumOrNaN(outputs)
    
        for (let i = 0; i < utxos.length; ++i) {
            let utxo = utxos[i]
            let utxoBytes = inputBytes(utxo)
            let utxoFee = feeRate * utxoBytes
            let utxoValue = uintOrNaN(Number(utxo.value))
    
            // skip detrimental input
            if (utxoFee > uintOrNaN(Number(utxo.value))) {
                if (i === utxos.length - 1) return {fee: feeRate * (bytesAccum + utxoBytes)}
                continue
            }
    
            bytesAccum += utxoBytes
            inAccum += utxoValue
            inputs.push(utxo)
    
            let fee = feeRate * bytesAccum
    
            // go again?
            if (inAccum < outAccum + fee) continue
    
            return finalize(inputs, outputs, feeRate)
        }
    
        return {fee: feeRate * bytesAccum}
}

function blackjack(
    utxos: Array<ChainSoUnspentTransaction>, 
    outputs: any, 
    feeRate: any
    ) {
        if (!isFinite(uintOrNaN(feeRate))) return {}
    
        let bytesAccum = transactionBytes([], outputs)
    
        let inAccum = 0
        let inputs = []
        let outAccum = sumOrNaN(outputs)
        let threshold = dustThreshold({}, feeRate)
    
        for (let i = 0; i < utxos.length; ++i) {
            let input = utxos[i]
            let inputInBytes = inputBytes(input)
            let fee = feeRate * (bytesAccum + inputInBytes)
            let inputValue = uintOrNaN(Number(input.value))
    
            // would it waste value?
            if ((inAccum + inputValue) > (outAccum + fee + threshold)) continue
    
            bytesAccum += inputInBytes
            inAccum += inputValue
            inputs.push(input)
    
            // go again?
            if (inAccum < outAccum + fee) continue
    
            return finalize(inputs, outputs, feeRate)
        }
    
        return {fee: feeRate * bytesAccum}
}

export function coinSelect(
    utxos: Array<ChainSoUnspentTransaction>, 
    outputs: any, 
    feeRate: any
    ) {
        // attempt to use the blackjack strategy first (no change output)
        let base = blackjack(utxos, outputs, feeRate)
        if (Object(base).inputs) return base
    
        // else, try the accumulative strategy
        return Object(accumulative(utxos, outputs, feeRate))
}
