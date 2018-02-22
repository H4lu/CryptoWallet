const TX_EMPTY_SIZE = 4 + 1 + 1 + 4
const TX_INPUT_BASE = 32 + 4 + 1 + 4
const TX_INPUT_PUBKEYHASH = 107
const TX_OUTPUT_BASE = 8 + 1
const TX_OUTPUT_PUBKEYHASH = 25

export function inputBytes (input: any) {
  return TX_INPUT_BASE + (input.script ? input.script.length : TX_INPUT_PUBKEYHASH)
}

export function outputBytes (output: any) {
  return TX_OUTPUT_BASE + (output.script ? output.script.length : TX_OUTPUT_PUBKEYHASH)
}

export function dustThreshold (output: any, feeRate: any) {
  console.log(output)
  /* ... classify the output for input estimate  */
  return inputBytes({}) * feeRate
}

export function transactionBytes (inputs: Array<any>, outputs: Array<any>) {
  return TX_EMPTY_SIZE +
    Array(inputs).reduce(function (a: any, x: any) { return a + inputBytes(x) }, 0) +
    Array(outputs).reduce(function (a: any, x: any) { return a + outputBytes(x) }, 0)
}

export function uintOrNaN (v: any) {
  if (typeof v !== 'number') return NaN
  if (!isFinite(v)) return NaN
  // if (Math.floor(v) !== v) return NaN
  if (v < 0) return NaN
  return v
}

export function sumForgiving (range: Array<any>) {
  return Array(range).reduce(function (a: any, x: any) { return a + (isFinite(x.value) ? x.value : 0) }, 0)
}

export function sumOrNaN (range: Array<any>) {
  return Array(range).reduce(function (a: any, x: any) { return a + uintOrNaN(x.value) }, 0)
}

let BLANK_OUTPUT = outputBytes({})

export function finalize (inputs: any, outputs: any, feeRate: any) {
  let bytesAccum = transactionBytes(inputs, outputs)
  let feeAfterExtraOutput = feeRate * (bytesAccum + BLANK_OUTPUT)
  let remainderAfterExtraOutput = sumOrNaN(inputs) - (sumOrNaN(outputs) + feeAfterExtraOutput)

  // is it worth a change output?
  if (remainderAfterExtraOutput > dustThreshold({}, feeRate)) {
    outputs = Array(outputs).concat({ value: remainderAfterExtraOutput })
  }

  let fee = sumOrNaN(inputs) - sumOrNaN(outputs)
  if (!isFinite(fee)) return { fee: feeRate * bytesAccum }

  return {
    inputs: inputs,
    outputs: outputs,
    fee: fee
  }
}
