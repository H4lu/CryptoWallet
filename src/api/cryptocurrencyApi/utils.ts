import {ECPair, networks} from 'bitcoinjs-lib'
// @ts-ignore
import * as satoshi from 'satoshi-bitcoin'

const TX_EMPTY_SIZE = 4 + 1 + 1 + 4
const TX_INPUT_BASE = 32 + 4 + 1 + 4
const TX_INPUT_PUBKEYHASH = 107
const TX_OUTPUT_BASE = 8 + 1
const TX_OUTPUT_PUBKEYHASH = 25

export type Erc20DisplayToken = {
    name: string,
    address: string,
    amount: string
}

export enum FeeTypes {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
}

export type ChainSoTransactionSpent = {
    txid: string,
    input_no: number
}
export type ChainSoTransactionInput = {
    input_no: number,
    address: string,
    received_from?: {
        txid: string,
        output_no: number
    }
}

export type ChainSoTransactionOutput = {
    output_no: number,
    address: string,
    value: string,
    spent: ChainSoTransactionSpent
}

export type ChainSoUnspentTransaction = {
    txid: string,
    output_no: number,
    script_asm: string,
    script_hex: string,
    value: string,
    confirmations: number,
    time: number
}

export type ChainSoTransaction = {
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
export type ChainSoTransactions = {
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

export type BlockcypherUnspentTransaction = {
    tx_hash: string,
    block_height: number,
    tx_input_n: number,
    tx_output_n: number,
    value: number,
    ref_balance: number,
    spent: boolean,
    confirmations: number,
    confirmed?: string,
    double_spend: boolean,
    script: string
}

export type BlockcypherUnspentTransactions = {
    address: string,
    total_receiver: number,
    total_sent: number,
    balance: number,
    unconfirmed_balance: 0,
    final_balance: number,
    n_tx: number,
    unconfirmed_n_tx: number,
    final_nt_tx: number,
    txrefs: Array<BlockcypherUnspentTransaction>
}

export type BlockcypherFullTransactionInput = {
    prev_hash: string,
    output_index: 0,
    script: string,
    output_value: number,
    sequence: number,
    addresses: Array<string>,
    script_type: string,
    age: number
}

export type BlockcypherFullTransactionOutput = {
    value: number,
    script: string,
    addresses: Array<string>,
    script_type: string
}
export type BlockcypherFullTransaction = {
    block_hash: string,
    block_height: number,
    hash: string,
    addresses: Array<string>,
    total: number,
    fees: number,
    size: number,
    preference: string,
    relayed_by: string,
    confirmed: string, // TODO: convert to date in response
    received: string,
    ver: number,
    lock_time: number,
    double_spend: boolean,
    vin_sz: number,
    vout_sz: number,
    confirmations: number,
    confidence: number,
    inputs: Array<BlockcypherFullTransactionInput>,
    outputs: Array<BlockcypherFullTransactionOutput>
}

export type BlockcypherFullTransactions = {
    address: string,
    total_received: number,
    total_sent: number,
    balance: number,
    unconfirmed_balance: number,
    final_balance: number,
    n_tx: number,
    unconfirmed_n_tx: number,
    final_n_tx: number,
    txs: Array<BlockcypherFullTransaction>
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

export type BtcLikeCurrencies = 'BTC' | 'LTC';

export type DisplayTransactionCurrency = BtcLikeCurrencies | 'ETH' | 'XRP' | 'MNR' | 'XCH' | 'DOGE' | 'BCH';

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

export function toDisplayCurrencyName(currency: DisplayTransactionCurrency) {
    switch (currency) {
        case "BTC":
            return "Bitcoin";
        case "LTC":
            return "Litecoin";
        case "ETH":
            return "Ethereum";
        case "XRP":
            return "Ripple";
        case "BCH":
            return "Bitcoincash";
        case "MNR":
            return "Monero";
        case "XCH":
            return "Chia";
        case "DOGE":
            return "Dogecoin"
    }
}

export function toDisplayTransactions(resp: BlockcypherFullTransactions): Array<DisplayTransaction> {
    const address = resp.address
    return resp.txs.map(tx => toDisplayTransaction(tx, address))
}

function toDisplayTransaction(tx: BlockcypherFullTransaction, ownerAddress: string): DisplayTransaction {
    const date = new Date(tx.received)
    const dateUnix = date.getTime()
    const displayDate = date.getHours() + ':' + ((date.getMinutes() >= 10) ? date.getMinutes() : '0' + date.getMinutes()) + ' ' + ' ' + ' ' + date.getDate() + ' ' + (date.getMonth() + 1) + ' ' + date.getFullYear()
    const isOutgoing = findAddressInInput(tx.inputs, ownerAddress).length > 0
    const txAmount = isOutgoing ? tx.outputs[0].value : tx.inputs[0].output_value
    const address = isOutgoing ? tx.outputs[0].addresses[0] : tx.inputs[0].addresses[0]
    const hash = tx.hash
    const type = isOutgoing ? DisplayTransactionType.OUTGOING : DisplayTransactionType.INCOMING
    const status = tx.confirmations === 0 ?
        DisplayTransactionStatus.ACTIVE : DisplayTransactionStatus.FINISHED
    const currency = "BTC"
    const amount = satoshi.toBitcoin(txAmount).toString()
    return {
        dateUnix, displayDate, currency, amount, address, status, type, hash
    }
}

function findAddressInInput(inputs: Array<BlockcypherFullTransactionInput>, address: string) {
    return inputs
        .map(a => a.addresses)
        .flat()
        .filter(a => a == address)
}

export function parseBTCLikeTransactions(
    transactions: ChainSoTransactions,
    currency: BtcLikeCurrencies
): Array<DisplayTransaction> {
    return transactions.data.txs
        .map(tx => btcLikeToDisplayTransaction(tx, currency))
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
            dateUnix, displayDate, currency, amount, address, status, type, hash
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
            dateUnix, displayDate, currency, amount, address, status, type, hash
        }
    }
}

export function getTestnetAddressBTC(pubkey: Buffer): string {
    const keyPair = ECPair.fromPublicKeyBuffer(pubkey, networks.testnet)
    return keyPair.getAddress()
}

export function inputBytes(input: any) {
    return TX_INPUT_BASE + (input.script ? input.script.length : TX_INPUT_PUBKEYHASH)
}

export function outputBytes(output: any) {
    return TX_OUTPUT_BASE + (output.script ? output.script.length : TX_OUTPUT_PUBKEYHASH)
}

export function dustThreshold(output: any, feeRate: any) {
    console.log(output)
    /* ... classify the output for input estimate  */
    return inputBytes({}) * feeRate
}

export function transactionBytes(inputs: Array<any>, outputs: Array<any>) {
    return TX_EMPTY_SIZE +
        Array(inputs).reduce(function (a, x) {
            return a + inputBytes(x)
        }, 0) +
        Array(outputs).reduce(function (a, x) {
            return a + outputBytes(x)
        }, 0)
}

export function uintOrNaN(v: any) {
    if (typeof v !== 'number') return NaN
    if (!isFinite(v)) return NaN
    // if (Math.floor(v) !== v) return NaN
    if (v < 0) return NaN
    return v
}

export function sumForgiving(range: Array<any>) {
    return Array(range).reduce(function (a: any, x: any) {
        return a + (isFinite(x.value) ? x.value : 0)
    }, 0)
}

export function sumOrNaN(range: Array<any>) {
    let t = Array(range)
    console.log(t)
    return Array(range).reduce(function (a, x) {
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

export function finalize(inputs: any, outputs: any, feeRate: any) {
    let bytesAccum = transactionBytes(inputs, outputs)
    let feeAfterExtraOutput = feeRate * (bytesAccum + BLANK_OUTPUT)
    let remainderAfterExtraOutput = sumOfArray(inputs) - (sumOrNaN(outputs) + feeAfterExtraOutput)

    // is it worth a change output?
    if (remainderAfterExtraOutput > dustThreshold({}, feeRate)) {
        outputs = Array(outputs).concat({value: remainderAfterExtraOutput})
    }

    let fee = sumOfArray(inputs) - sumOfArray(outputs)
    if (!isFinite(fee)) return {fee: feeRate * bytesAccum}

    return {
        inputs: inputs,
        outputs: outputs,
        fee: fee
    }
}
