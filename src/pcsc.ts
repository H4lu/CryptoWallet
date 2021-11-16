process.on('uncaughtException', err => {
    console.log(err.message)
    console.log(err.stack)
})
import pcsclite from "@pokusew/pcsclite";
import { getBitcoinLastTx, getBTCBalance, initBitcoinAddress } from "./api/cryptocurrencyApi/bitcoin";
import { Erc20DisplayToken, getAddressErc20Tokens, getETHBalance, getEthereumAddress, getEthereumLastTx, initEthereumAddress } from "./api/cryptocurrencyApi/ethereum";
import { getLitecoinLastTx, getLTCBalance, initLitecoinAddress } from "./api/cryptocurrencyApi/ltecoin";
import { getRippleLastTx, getXRPBalance, initRippleAddress } from "./api/cryptocurrencyApi/ripple";
import { DisplayTransaction, DisplayTransactionCurrency } from "./api/cryptocurrencyApi/utils";
import { getInfoPCSC } from "./api/hardwareApi/getWalletInfo";
import { setReader } from "./api/hardwareApi/reader";
import { ConnectionStatus, DisplayBalanceStatus, PCSCMessage, PCSCMessageType, TransactionsStatus, WalletStatus } from "./pcsc_helpers";

console.log('SETTING EXc')

const PSCS_MANAGER_NOT_RUGGING_ERROR = "(0x8010001d)";


let pcsc = undefined;
let allowInit = true;

const initCryptoAddresses = async () => {
    try {
        await Promise.all([initBitcoinAddress(), initEthereumAddress(), initLitecoinAddress()])
    } catch(err) {
        console.log(err.message)
    }
}

const getBalances = async () => {
    const balances = await Promise.all([getBTCBalance(), getLTCBalance(),  getETHBalance(), getXRPBalance()])
    process.send({type: PCSCMessageType.BALANCE_CHANGE, data: {currency: 'BTC', balance: balances[0]}})
    process.send({type: PCSCMessageType.BALANCE_CHANGE, data: {currency: 'LTC', balance: balances[1]}})
    process.send({type: PCSCMessageType.BALANCE_CHANGE, data: {currency: 'ETH', balance: balances[2]}})
    process.send({type: PCSCMessageType.BALANCE_CHANGE, data: {currency: 'XRP', balance: balances[3]}})
}

const getTransactions = async () => {
    const transactions = await Promise.all([getBitcoinLastTx(), getLitecoinLastTx(), getEthereumLastTx(), getRippleLastTx()])
    process.send({type: PCSCMessageType.TRANSACTIONS_CHANGE, data: {currency: 'BTC', transactions: transactions[0]}})
    process.send({type: PCSCMessageType.TRANSACTIONS_CHANGE, data: {currency: 'LTC', transactions: transactions[1]}})
    process.send({type: PCSCMessageType.TRANSACTIONS_CHANGE, data: {currency: 'ETH', transactions: transactions[2]}})
    process.send({type: PCSCMessageType.TRANSACTIONS_CHANGE, data: {currency: 'XRP', transactions: transactions[3]}})
}

const updateErc20Tokens = async () => {
    const actualTokens = await getAddressErc20Tokens(getEthereumAddress())
    process.send({type: PCSCMessageType.ERC20_CHANGE, data: actualTokens})
}


const initAll = async () => {
    try {
        if (allowInit) {
            allowInit = false;
            await initCryptoAddresses()
            await Promise.all([getBalances(), getTransactions(), updateErc20Tokens()])
            process.send({type: PCSCMessageType.INITIALIZED})
        }
    } catch(err) {
        console.log(err.message)
        process.send({type: PCSCMessageType.ERROR, data: err})
    }
}

const startWalletInfoPing = async () => {
    let interval = setInterval(async () => {
        try {
            const walletStatus = await getInfoPCSC()
            console.log('Got wallet status: ', walletStatus)
            const message : PCSCMessage = {
                type: PCSCMessageType.WALLET_STATUS_CHANGE,
                data: {walletStatus: walletStatus}
            }
            process.send(message)
            if (walletStatus == 0) {
                clearInterval(interval)
                console.log('SETTING WALLET STATUS 0')
                await initAll()
            }
        } catch (error) {
            console.log('GOT ERROR', error)
            clearInterval(interval)
        }
    }, 500, [])
};

const onReaderCallback = async (reader) => {
    setReader(reader)
    reader.on('status', status => {
        const changes = reader.state ^ status.state
        if ((changes & reader.SCARD_STATE_PRESENT) && (status.state & reader.SCARD_STATE_PRESENT)) {
            reader.connect({
                    share_mode: reader.SCARD_SHARE_SHARED,
                    protocol: reader.SCARD_PROTOCOL_T1
            }, async (err, _) => {
                if (err) {
                    process.send({type: PCSCMessageType.ERROR, data: err})
                    console.error(err)
                } else {
                    console.log("start wallet info")
                    process.send({type: PCSCMessageType.CONNECTION_STATUS_CHANGE, data: {isConnected: true}})
                    startWalletInfoPing()
                }
        })
    }
    })

    reader.on('error', err => {
        console.log('Error', err.message)
        process.send({type: PCSCMessageType.ERROR, data: err})
    })
    reader.on('end', () => {
        console.log('Reader', reader.name, 'removed')
        process.send({type: PCSCMessageType.CONNECTION_STATUS_CHANGE, data: {isConnected: false}})
    })
};

const onErrorCallback = async (err) => {
    console.log('PCSC error', err.message)
  
    const errMessage = String(err.message)
    const errLines = errMessage.split('\n')
    if (errLines.length > 1) {
        const code = errLines[1]
        // just reinit pcsc in case of manager not running error(usually appears during timeout)
        if (code == PSCS_MANAGER_NOT_RUGGING_ERROR) {
            pcsc.removeAllListeners()
            pcsc = pcsclite()
            pcsc.on('reader', onReaderCallback)
            pcsc.on('error', onErrorCallback)
            return
        }
    }
};

const start = async () => {
    pcsc = pcsclite();
    pcsc.on("reader", onReaderCallback);
    pcsc.on("error", onErrorCallback);
};

console.log('START')
start();
console.log("START ENDED")
