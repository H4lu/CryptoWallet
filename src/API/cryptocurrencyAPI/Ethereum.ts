import Web3 from 'web3'
import {Transaction} from '@ethereumjs/tx'
import {BN} from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import {getSignaturePCSC} from '../hardwareApi/getSignature'
import {remote} from "electron"
import {getAddressPCSC} from '../hardwareApi/getAddress'
import {Buffer} from 'buffer'
import {keccak256} from "js-sha3";
import axios from 'axios'
import { DisplayTransaction, DisplayTransactionCurrency, DisplayTransactionStatus, DisplayTransactionType } from './utils'

interface EthplorerTransaction {
    timestamp: number,
    from: string,
    to: string,
    hash: string,
    value: number,
    input: string,
    success: boolean
}

enum Networks {
    MAIN = "mainnet",
    TEST = "ropsten"
}

const NETWORK = Networks.TEST

const web3 = new Web3(new Web3.providers.HttpProvider(`https://${NETWORK}.infura.io/v3/960cbfb44af74f27ad0e4b070839158a`))

let myAdress = ''
let myPubKey = Buffer.alloc(64)
let balance: number
let price: number

export function setETHBalance(bal: number) {
    balance = bal
}

export function setETHPrice(priceToSet: number) {
    price = priceToSet
}

export async function initEthereumAddress() {
    return new Promise(async (resolve) => {
        let status = false
        while (!status) {
            console.log('Status', status)
            let answer = await getAddressPCSC(1)
            console.log('GOT MYADDR ANSWER', answer)
            if (answer.length > 1 && answer[0].includes('ETH')) {
                status = true
                console.log('status after reset', status)
                setMyPubKey(answer[1])
                resolve(0)
            }
        }
    })
}

export function setMyPubKey(pubKey: Buffer) {
    for (let i = 0; i < 64; i++) {
        myPubKey[i] = pubKey[i + 1]
    }
    console.log('PUB_KEY_ETHEREUM', myPubKey.toString('hex'))
    let address = '0x' + keccak256(myPubKey).substr(24, 40).toLowerCase()
    console.log('PUB_KEY_ETHEREUM', address)
    setAddress(address)
}

export function getEthereumPubKey() {
    return myPubKey
}

function setAddress(address: string) {
    myAdress = web3.utils.toChecksumAddress(address)
}

export function getEthereumAddress() {
    return myAdress
}

export async function getEthereumLastTx(): Promise<Array<DisplayTransaction>> {
    const requestURL = `https://api.ethplorer.io/getAddressTransactions/${myAdress}?apiKey=freekey&limit=50`
    const response = await axios.get(requestURL)
    return (response.data as Array<EthplorerTransaction>)
        .map(tx => ethplorerToDisplayTransaction(tx))
}

function ethplorerToDisplayTransaction(tx: EthplorerTransaction): DisplayTransaction {
    const date = new Date(tx.timestamp * 1000)
    const dateUnix = date.getTime()
    const displayDate = date.getHours() + ':' + ((date.getMinutes() >= 10) ? date.getMinutes() : '0' + date.getMinutes()) + ' ' + ' ' + ' ' + date.getDate() + ' ' + (date.getMonth() + 1) + ' ' + date.getFullYear()
    const amount = tx.value.toString()
    const hash = tx.hash
    const type = tx.from === myAdress.toLowerCase() ? 
        DisplayTransactionType.OUTGOING : DisplayTransactionType.INCOMING
    const status = tx.success ?
        DisplayTransactionStatus.FINISHED : DisplayTransactionStatus.ACTIVE    
    const address = type === DisplayTransactionType.OUTGOING ? tx.to : tx.from
    const currency: DisplayTransactionCurrency = "ETH"
    return {
        dateUnix, displayDate, currency, amount, address, status, type, hash
    }
}

export async function getETHBalanceTrans(address: string): Promise<Array<any>> {
    let respB = await web3.eth.getBalance(address)

    let ethValue = convertFromWei(Number(respB))
    console.log('1', ethValue)
    let arr = []
    arr.push(Number(Number(ethValue).toFixed(8)))

    let respT = await web3.eth.getTransactionCount(address)

    arr.push(Number(respT))
    console.log('2', respT)
    return arr
}

export async function getETHBalance(): Promise<number> {
    const response = await web3.eth.getBalance(myAdress)
    const ethValue = convertFromWei(Number(response))
    return Number(Number(ethValue).toFixed(8)) 
}

export function convertFromWei(amount: number) {
    return web3.utils.fromWei(String(amount), 'ether')
}

async function createTransaction(
    paymentAdress: string, 
    amount: number, 
    gasPrice: number, 
    gasLimit: number, 
    course: number, 
    balance: number
    ) {
        const txCount = await web3.eth.getTransactionCount(myAdress)
        // Получаем порядковый номер транзакции, т.н nonce
        const gas = (8 * gasPrice).toString()
        const rawtx = {
            value: new BN(web3.utils.toWei(amount.toString(), 'ether')),
            nonce: new BN(txCount),
            to: paymentAdress,
            gasPrice: web3.utils.toHex(web3.utils.toWei(gas, 'shannon')),
            gasLimit: web3.utils.toHex(31000),
            data: '0x00',
            v: new BN(41),
            r: new BN(0),
            s: new BN(0)
        }
            
        const common = new Common({chain: NETWORK})
        let tx = Transaction.fromTxData(rawtx, {common, freeze: false})
        const txHash = tx.getMessageToSign(true)
        const hash =  Buffer.concat([Buffer.from([0x20]), txHash])
        const hashArray = [hash]
        const fee = (49103 * gasPrice) / 100000000
        const data = await getSignaturePCSC(1, hashArray, paymentAdress, amount, 1, course, fee, balance)
        if (data[0] == undefined) {
            throw new Error("Error from hw wallet")
        }
        if (data[0].length !== 1) {
            // FIXME: remove this kostil after 
            // https://github.com/ethereumjs/ethereumjs-monorepo/issues/1278
            // is resolved
            (tx as any).v = new BN(data[0][64] + 14);
            (tx as any).r = new BN(data[0].slice(0, 32));
            (tx as any).s = new BN(data[0].slice(32, 64));
            (tx as any).chainId = new BN(3);
           
            // seems like our hw wallet don't calculate v properly
            if (!myPubKey.equals(tx.getSenderPublicKey())) {
                console.log("change v");
                (tx as any).v = tx.v.eq(new BN(42)) ? new BN(41) : new BN(42)
            }
           
            const serTx = '0x' + tx.serialize().toString('hex');
            return web3.eth.sendSignedTransaction(serTx)
                // .on('receipt', console.log)
                // .on('transactionHash', (hash) => {
                //     console.log('Transaction sended: ' + hash)
                // })
                // .on('error', async error => {
                //     console.log(error)
                //     remote.dialog.showErrorBox("Error",error.message)
                // });
        }
}

export function handleEthereum(
    paymentAdress: string, 
    amount: number, 
    gasPrice: number, 
    gasLimit: number, 
    course: number, 
    balance: number
    ) {
        return createTransaction(
            paymentAdress, amount, gasPrice, gasLimit, course, balance
            )
}