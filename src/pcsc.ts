process.on('uncaughtException', err => {
    console.log("Uncaught exception: ")
    console.log(err.message)
    console.log(err.stack)
})

import {sendTransaction} from "./core/sendTransaction";
import {UpdateHWStatusPCSC, updateTransactionsPCSC} from "./api/hardwareApi/updateHwStatus";
import pcsclite from "@pokusew/pcsclite";
import {
    getBitcoinAddress,
    getBitcoinLastTx,
    getBTCBalance,
    getChartBTC,
    initBitcoinAddress
} from "./api/cryptocurrencyApi/bitcoin";
import {
    getAddressErc20Tokens,
    getETHBalance,
    getEthereumAddress,
    getEthereumLastTx,
    initEthereumAddress
} from "./api/cryptocurrencyApi/ethereum";
import {
    getLitecoinAddress,
    getLitecoinLastTx,
    getLTCBalance,
    initLitecoinAddress
} from "./api/cryptocurrencyApi/ltecoin";
import {getRippleLastTx, getXRPBalance} from "./api/cryptocurrencyApi/ripple";
import {getInfoPCSC} from "./api/hardwareApi/getWalletInfo";
import {setReader} from "./api/hardwareApi/reader";
import {ChartData, PCSCMessage, PCSCMessageType, TransactionRequest} from "./pcsc_helpers";

const PSCS_MANAGER_NOT_RUGGING_ERROR = "(0x8010001d)";

process.on('message', async (msg: PCSCMessage, _) => {
    switch (msg.type) {
        case PCSCMessageType.UPDATE_HW_BALANCES: {
            const data = msg.data
            UpdateHWStatusPCSC(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8])
            break
        }
        case PCSCMessageType.UPDATE_HW_TRANSACTIONS: {
            const data = msg.data
            await updateTransactionsPCSC(data[0], data[1], data[2], data[3])
            break
        }
        case PCSCMessageType.UPDATE: {
            await updateAll()
            break
        }
        case PCSCMessageType.TRANSACTION_REQUEST: {
            const data = msg.data as TransactionRequest
            try {
                await sendTransaction(data.currency, data.paymentAddress, data.amount, data.fee, data.course, data.cryptoBalance);
                process.send({type: PCSCMessageType.TRANSACTION_SUCCESS})
            } catch (err) {
                if (err.response) { // axios error
                    process.send({type: PCSCMessageType.ERROR, data: {errorMessage: JSON.stringify(err.response.data)}})
                    return
                }
                process.send({type: PCSCMessageType.ERROR, data: {errorMessage: err.message}})
            }
            break
        }
        default:
            return
    }
})

let pcsc = undefined;
let allowInit = true;

const initCryptoAddresses = async () => {
    await Promise.all([initBitcoinAddress(), initEthereumAddress(), initLitecoinAddress()])
    process.send({type: PCSCMessageType.ADDRESS_CHANGE, data: {currency: "BTC", address: getBitcoinAddress()}})
    process.send({type: PCSCMessageType.ADDRESS_CHANGE, data: {currency: "ETH", address: getEthereumAddress()}})
    process.send({type: PCSCMessageType.ADDRESS_CHANGE, data: {currency: "LTC", address: getLitecoinAddress()}})
}

const getBalances = async () => {
    const balances = await Promise.all([getBTCBalance(), getLTCBalance(), getETHBalance(), getXRPBalance()])
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


const sendBtcChartData = async () => {
    const currentDate = new Date()
    const month = currentDate.getMonth() + 1
    const monthStr = month < 10 ? `0${month.toString()}` : month.toString()
    const day = currentDate.getDate()
    const dayStr = day < 10 ? `0${day.toString()}` : day.toString()
    const dateEnd = `${currentDate.getFullYear().toString()}-${monthStr}-${dayStr}`
    const dateStart = `${(currentDate.getFullYear() - 1).toString()}-${monthStr}-${dayStr}`

    const arrData = await getChartBTC(dateEnd, dateStart);
    const arr = Array<ChartData>(365)
    for (let index = 0; index < 365; index++) {
        const dateN = new Date(Date.now() - 86400000 * (364 - index))
        let mon: string
        switch (dateN.getMonth() + 1) {
            case 1: {
                mon = 'jan'
                break
            }
            case 2: {
                mon = 'feb'
                break
            }
            case 3: {
                mon = 'mar'
                break
            }
            case 4: {
                mon = 'apr'
                break
            }
            case 5: {
                mon = 'may'
                break
            }
            case 6: {
                mon = 'jun'
                break
            }
            case 7: {
                mon = 'jul'
                break
            }
            case 8: {
                mon = 'aug'
                break
            }
            case 9: {
                mon = 'sep'
                break
            }
            case 10: {
                mon = 'oct'
                break
            }
            case 11: {
                mon = 'nov'
                break
            }
            case 12: {
                mon = 'dec'
                break
            }
        }
        const chartDate = `${dateN.getDate().toString()}.${mon}`
        arr[index] = {date: chartDate, pv: arrData[index]}
    }
    process.send({type: PCSCMessageType.CHART_DATA_CHANGE, data: arr})
}

const updateAll = async () => {
    try {
        await Promise.all([getBalances(), getTransactions(), updateErc20Tokens(), sendBtcChartData()])
        process.send({type: PCSCMessageType.UPDATED})
    } catch (err) {
        console.log(err.message)
        process.send({type: PCSCMessageType.ERROR, data: {errorMessage: err.message}})
    }
}

const initAll = async () => {
    try {
        if (allowInit) {
            allowInit = false;
            await initCryptoAddresses()
            await Promise.all([getBalances(), getTransactions(), updateErc20Tokens(), sendBtcChartData()])
            process.send({type: PCSCMessageType.INITIALIZED})
        }
    } catch (err) {
        process.send({type: PCSCMessageType.ERROR, data: {errorMessage: err.message}})
    }
}

const startWalletInfoPing = async () => {
    let interval = setInterval(async () => {
        try {
            const walletStatus = await getInfoPCSC()
            const message: PCSCMessage = {
                type: PCSCMessageType.WALLET_STATUS_CHANGE,
                data: {walletStatus: walletStatus}
            }
            process.send(message)
            if (walletStatus == 0) {
                clearInterval(interval)
                await initAll()
            }
        } catch (error) {
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
    console.log("Starting pcsc")
    pcsc = pcsclite();
    pcsc.on("reader", onReaderCallback);
    pcsc.on("error", onErrorCallback);
};

start();
