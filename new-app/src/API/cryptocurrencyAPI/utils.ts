import {ECPair, networks} from 'bitcoinjs-lib'

const TX_EMPTY_SIZE = 4 + 1 + 1 + 4
const TX_INPUT_BASE = 32 + 4 + 1 + 4
const TX_INPUT_PUBKEYHASH = 107
const TX_OUTPUT_BASE = 8 + 1
const TX_OUTPUT_PUBKEYHASH = 25
export interface ChainSoTransactionSpent {
    txid: string,
    input_no: number
}
export interface ChainSoTransactionInput {
    input_no: number,
    address: string,
    received_from?: {
        txid: string,
        output_no: number
    }
}

export interface ChainSoTransactionOutput {
    output_no: number,
    address: string,
    value: string,
    spent: ChainSoTransactionSpent
}

export interface ChainSoUnspentTransaction {
  txid: string,
  output_no: number,
  script_asm: string,
  script_hex: string,
  value: string,
  confirmations: number,
  time: number
}

export interface ChainSoTransaction {
    txid: string,
    block_no: number,
    confirmations: number,
    time: number,
    incoming?: {
        inputs: Array<ChainSoTransactionInput>,
        value: string,
        output_no: number,
        req_sigs: number,
        script_asm: string,
        script_hex: string,
        spent?: ChainSoTransactionSpent
    },
    outgoing?: {
        value: string,
        outputs: Array<ChainSoTransactionOutput>
    }
}

export interface ChainSoTransactions {
    status: string,
    data: {
        network: string,
        address: string,
        balance: string,
        received_value: string,
        pending_value: string,
        total_txs: number,
        txs: Array<ChainSoTransaction>
    }
}

export interface ChainSoUnspentTransactions {
    status: string,
    data: {
        network: string,
        address: string,
        txs: Array<ChainSoUnspentTransaction>
    }
}

export enum DisplayTransactionType {
    OUTGOING = "outgoing",
    INCOMING = "incoming"
}

export enum DisplayTransactionStatus {
    ACTIVE = "Active",
    FINISHED = "Finished"
}

export type BtcLikeCurrencies = 'BTC' | 'LTC'

export type DisplayTransactionCurrency = BtcLikeCurrencies | 'ETH' | 'XRP'
export interface DisplayTransaction {
    dateUnix: number,
    displayDate: string,
    currency: DisplayTransactionCurrency,
    amount: string,
    address: string,
    status: DisplayTransactionStatus,
    type: DisplayTransactionType,
    hash: string
}

export function parseBTCLikeTransactions(
    transactions: ChainSoTransactions,
    currency: BtcLikeCurrencies
    ): Array<DisplayTransaction> {
        return transactions.data.txs
           .map((tx) => btcLikeToDisplayTransaction(tx, currency))
}

export function btcLikeToDisplayTransaction(
    transaction: ChainSoTransaction, 
    currency: BtcLikeCurrencies
    ): DisplayTransaction {
        if (transaction.outgoing !== undefined) {
            const date = new Date(transaction.time * 1000)
            const dateUnix = date.getTime()
            const displayDate = date.getHours() + ':' + ((date.getMinutes() >= 10) ? date.getMinutes() : '0' + date.getMinutes()) + ' ' + ' ' + ' ' + date.getDate() + ' ' + (date.getMonth() + 1) + ' ' + date.getFullYear()
            const amount = transaction.outgoing.outputs[0].value
            const address = transaction.outgoing.outputs[0].address
            const type = DisplayTransactionType.OUTGOING
            const status = (transaction.confirmations === 0) ? 
                DisplayTransactionStatus.ACTIVE : DisplayTransactionStatus.FINISHED
            const hash = transaction.txid
            return {
              dateUnix, displayDate, currency, amount, address, status,type, hash
            }
         } else {
            const date = new Date(transaction.time * 1000)
            const dateUnix = date.getTime()
            const displayDate = date.getHours() + ':' + ((date.getMinutes() >= 10) ? date.getMinutes() : '0' + date.getMinutes()) + ' ' + ' ' + ' ' + date.getDate() + ' ' + (date.getMonth() + 1) + ' ' + date.getFullYear()
            const amount = transaction.incoming.value
            const address = transaction.incoming.inputs[0].address
            const type = DisplayTransactionType.INCOMING
            const status = (transaction.confirmations === 0) ? 
                DisplayTransactionStatus.ACTIVE : DisplayTransactionStatus.FINISHED
            const hash = transaction.txid
            return {
              dateUnix, displayDate, currency, amount, address, status,type, hash
            }
  }
}


export function getTestnetAddressBTC(pubkey: Buffer): string {
    const keyPair = ECPair.fromPublicKeyBuffer(pubkey, networks.testnet)
    return keyPair.getAddress()
}

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
  return Array(range).reduce(function (a: any, x: any) {
    return a + uintOrNaN(Object(x).value)
  }, 0)
}

let BLANK_OUTPUT = outputBytes({})

export function sumOfArray(array: Array<any>) {
  let sum = 0
  for (let input in array) {
    sum += uintOrNaN(Number(array[input].value))
    console.log(sum)
  }
  return sum
}
export function finalize (inputs: any, outputs: any, feeRate: any) {
  let bytesAccum = transactionBytes(inputs, outputs)
  let feeAfterExtraOutput = feeRate * (bytesAccum + BLANK_OUTPUT)
  let remainderAfterExtraOutput = sumOfArray(inputs) - (sumOrNaN(outputs) + feeAfterExtraOutput)

  // is it worth a change output?
  if (remainderAfterExtraOutput > dustThreshold({}, feeRate)) {
    outputs = Array(outputs).concat({ value: remainderAfterExtraOutput })
  }

  let fee = sumOfArray(inputs) - sumOfArray(outputs)
  if (!isFinite(fee)) return { fee: feeRate * bytesAccum }

  return {
    inputs: inputs,
    outputs: outputs,
    fee: fee
  }
}
