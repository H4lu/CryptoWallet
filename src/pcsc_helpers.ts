import {DisplayTransaction, DisplayTransactionCurrency, Erc20DisplayToken} from "./api/cryptocurrencyApi/utils";

export type WalletStatus = {
    walletStatus: number
}

export type ConnectionStatus = {
    isConnected: boolean
}

// Balance in BTC, ETH and etc.
export type DisplayBalanceStatus = {
    currency: DisplayTransactionCurrency,
    balance: number
}

export type TransactionsStatus = {
    currency: DisplayTransactionCurrency,
    transactions: Array<DisplayTransaction>
}

export type ChartData = {
    date: string,
    pv: number
}

export type TransactionRequest = {
    currency: DisplayTransactionCurrency,
    paymentAddress: string,
    amount: number,
    fee: number,
    course: number,
    cryptoBalance: number
}

export type HwBalance = number

export type AddressChange = {
    currency: DisplayTransactionCurrency,
    address: string
}

export type ErrorMessage = {
    errorMessage: string
}

// Do not change this values, they are hardcoded in app.tsx for some reason
export enum PCSCMessageType {
    WALLET_STATUS_CHANGE = 0 ,
    CONNECTION_STATUS_CHANGE = 1,
    ERROR = 2,
    BALANCE_CHANGE = 3,
    TRANSACTIONS_CHANGE = 4,
    ERC20_CHANGE = 5,
    INITIALIZED = 6,
    CHART_DATA_CHANGE = 7,
    UPDATE_HW_BALANCES = 8,
    UPDATE_HW_TRANSACTIONS = 9,
    UPDATE = 10,
    UPDATED = 11,
    TRANSACTION_REQUEST = 12,
    ADDRESS_CHANGE = 13
}

export type PCSCMessageData = WalletStatus | ConnectionStatus | ErrorMessage | DisplayBalanceStatus | TransactionsStatus | Array<Erc20DisplayToken> | Array<ChartData> | Array<HwBalance> | Array<Array<DisplayTransaction>> | TransactionRequest | AddressChange

export type PCSCMessage = {
    type: PCSCMessageType
    data: PCSCMessageData
}
