import Web3 from 'web3'
import {Transaction} from '@ethereumjs/tx'
import {BN} from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import {getSignaturePCSC} from '../hardwareApi/getSignature'
import {getAddressPCSC} from '../hardwareApi/getAddress'
import {Buffer} from 'buffer'
import {keccak256} from "js-sha3";
import axios from 'axios'
import {
    DisplayTransaction,
    DisplayTransactionCurrency,
    DisplayTransactionStatus,
    DisplayTransactionType,
    Erc20DisplayToken
} from './utils'


type EthplorerTransaction = {
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
    ROPSTEN = "ropsten",
    KOVAN = "kovan"
}

enum MainV {
    MAX = 38,
    MIN = 37
}

enum RopstenV {
    MAX = 42,
    MIN = 41
}

enum KovanV {
    MAX = 120,
    MIN = 119
}

type EthplorerErc20TokenInfo = {
    address: string,
    decimals: string,
    name: string,
    owner: string,
    symbol: string,
    totalSupply: string,
    lastUpdated: number,
    issuancesCount: number,
    holdersCount: number,
    price: boolean
}

type EthplorerErc20Token = {
    tokenInfo: EthplorerErc20TokenInfo,
    balance: number,
    rawBalance?: string
    totalIn: number,
    totalOut: number
}

type EthplorerEthInfo = {
    balance: number,
    price: boolean
}

type EthplorerAddressInfo = {
    address: string,
    ETH: EthplorerAddressInfo,
    countTxs: number,
    tokens?: Array<EthplorerErc20Token>
}

const NETWORK = Networks.MAIN
//const ethplorerRoot = NETWORK Networks.KOVAN ? "https://kovan-api.ethplorer.io" : "https://api.ethplorer.io"
const ethplorerRoot = "https://api.ethplorer.io"
const web3 = new Web3(new Web3.providers.HttpProvider(`https://${NETWORK}.infura.io/v3/960cbfb44af74f27ad0e4b070839158a`))

let myAdress = ''
let myPubKey = Buffer.alloc(64)
let balance: number
let price: number

function getVSignatureOffset(network: Networks): number {
    switch (network) {
        case Networks.MAIN:
            return 10
        case Networks.ROPSTEN:
            return 14
        case Networks.KOVAN:
            return 92
    }
}

function getVMin(network: Networks): number {
    switch (network) {
        case Networks.MAIN:
            return MainV.MIN
        case Networks.ROPSTEN:
            return RopstenV.MIN
        case Networks.KOVAN:
            return KovanV.MIN
    }
}

function getVMax(network: Networks): number {
    switch (network) {
        case Networks.MAIN:
            return MainV.MAX
        case Networks.ROPSTEN:
            return RopstenV.MAX
        case Networks.KOVAN:
            return KovanV.MAX
    }
}

export function setETHBalance(bal: number) {
    balance = bal
}

export function setETHPrice(priceToSet: number) {
    price = priceToSet
}

export const initEthereumAddress = async () => {
    let status = false
    while (!status) {
        let answer = await getAddressPCSC(1)
        if (answer.length > 1 && answer[0].includes('ETH')) {
            status = true
            setMyPubKey(answer[1])
        }
    }
}

export function setMyPubKey(pubKey: Buffer) {
    for (let i = 0; i < 64; i++) {
        myPubKey[i] = pubKey[i + 1]
    }
    let address = '0x' + keccak256(myPubKey).substr(24, 40).toLowerCase()
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
    const params = {
        "apiKey": "freekey",
        "limit": 50
    }
    const requestUrl = `${ethplorerRoot}/getAddressTransactions/${myAdress}`
    const response = await axios.get<Array<EthplorerTransaction>>(requestUrl, {params})
    return response.data
        .map(tx => toDisplayTransaction(tx))
}

export async function getAddressErc20Tokens(address: string): Promise<Array<Erc20DisplayToken>> {
    const params = {
        "apiKey": "freekey",
    }
    const requestUrl = `${ethplorerRoot}/getAddressInfo/${address}`
    const response = await axios.get<EthplorerAddressInfo>(requestUrl, {params})
    return toErc20DisplayToken(response.data)
}

function toErc20DisplayToken(addressInfo: EthplorerAddressInfo): Array<Erc20DisplayToken> {
    return addressInfo
        ?.tokens
        ?.map(token => {
            return {
                name: token.tokenInfo.symbol,
                address: token.tokenInfo.address,
                amount: parseTokenBalance(token)
            }
        }) ?? []
}

function parseTokenBalance(token: EthplorerErc20Token): string {
    try {
        if (token.rawBalance != undefined) {
            return web3.utils.fromWei(token.rawBalance, 'ether')
        } else if (token.balance < 1e21) {
            return parseFloat(convertFromWei(token.balance)).toFixed(8)
        } else {
            return token.balance.toString()
        }
    } catch (error) {
        console.error(error)
        return "0"
    }

}

function toDisplayTransaction(tx: EthplorerTransaction): DisplayTransaction {
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
        gasLimit: web3.utils.toHex(100000),
        data: '0x00',
        v: new BN(getVMin(NETWORK)),
        r: new BN(0),
        s: new BN(0)
    }

    const common = new Common({chain: NETWORK})
    let tx = Transaction.fromTxData(rawtx, {common, freeze: false})
    const txHash = tx.getMessageToSign(true)
    const hash = Buffer.concat([Buffer.from([0x20]), txHash])
    const hashArray = [hash]
    const fee = (49103 * gasPrice) / 100000000
    const data = await getSignaturePCSC(
        1, hashArray, paymentAdress, amount, 1, course, fee, balance
    )
    if (data[0] == undefined) {
        return
    }
    if (data[0].length !== 1) {
        // FIXME: remove this kostil after
        // https://github.com/ethereumjs/ethereumjs-monorepo/issues/1278
        // is resolved

        (tx as any).v = new BN(data[0][64] + getVSignatureOffset(NETWORK));
        (tx as any).r = new BN(data[0].slice(0, 32));
        (tx as any).s = new BN(data[0].slice(32, 64));
        (tx as any).chainId = new BN(3);

        // seems like our hw wallet don't calculate v properly
        if (!myPubKey.equals(tx.getSenderPublicKey())) {
            console.log("change v");
            const vMax = getVMax(NETWORK);
            const vMin = getVMin(NETWORK);
            (tx as any).v = tx.v.eq(new BN(vMax)) ? new BN(vMin) : new BN(vMax);
        }

        const serTx = '0x' + tx.serialize().toString('hex');
        return web3.eth.sendSignedTransaction(serTx)
            .on('receipt', console.log)
            .on('transactionHash', (hash) => {
                console.log('Transaction sended: ' + hash)
            })
            .on('error', async error => {
                console.log(error)
                throw error
            });
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
