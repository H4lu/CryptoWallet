import {info, log} from 'electron-log'
import * as React from 'react'
import {Header} from '../components/Header'
import {Route, Redirect} from 'react-router'
import {SidebarContent} from '../components/SidebarContent'

import {BTCWindow} from '../components/BTCWindow'
import {ETHWIndow} from '../components/ETHWindow'
import {LTCWindow} from '../components/LTCWindow'

import '../components/style.css'
import MainContent from '../components/MainContent'
import {CarouselHOC} from '../components/CarouselHOC'
import {
    getBitcoinLastTx,
    initBitcoinAddress,
    getBTCBalance,
    setBTCBalance,
    setBTCPrice, getChartBTC
} from '../API/cryptocurrencyAPI/BitCoin'
import {
    getLTCBalance,
    initLitecoinAddress,
    getLitecoinLastTx,
    setLTCBalance,
    setLTCPrice
} from '../API/cryptocurrencyAPI/Litecoin'
import {
    getETHBalance,
    initEthereumAddress,
    getEthereumLastTx,
    setETHBalance,
    setETHPrice
} from '../API/cryptocurrencyAPI/Ethereum'
import {getCurrencyRate} from '../core/getCurrencyRate'
import {MainWindow} from '../components/MainWindow'
import {TransactionSuccess} from '../components/TransactionSuccess'
import pcsclite from '@pokusew/pcsclite'
import {setReader} from '../API/hardwareAPI/Reader'

const pcsc = pcsclite()

import {getInfoPCSC} from '../API/hardwareAPI/GetWalletInfo'
import {UpdateHWStatusPCSC, updateTransactionsPCSC} from '../API/hardwareAPI/UpdateHWStatus'
import {SidebarLeft} from "../components/SidebarLeft";
import {BtcRecieveWindow} from "../components/BtcRecieveWindow";
import {BtcSendWindow} from "../components/BtcSendWindow";
import {SidebarLeftBlur} from "../components/SidebarLeftBlur";
import {LtcSendWindow} from "../components/LtcSendWindow";
import {LtcRecieveWindow} from "../components/LtcRecieveWindow";
import {EthRecieveWindow} from "../components/EthReceiveWindow";
import {EthSendWindow} from "../components/EthSendWindow";
import {XrpRecieveWindow} from "../components/XrpRecieveWindow";
import {XrpSendWindow} from "../components/XrpSendWindow";
import {CarouselHistory} from "../components/CarouselHistory";
import {
    getRippleLastTx,
    getXRPBalance,
    initRippleAddress,
    setXRPBalance,
    setXRPPrice
} from "../API/cryptocurrencyAPI/Ripple";
import {ModeWindow} from "../components/ModeWindow";
import {DisplayTransaction} from '../API/cryptocurrencyAPI/utils'
import {remote} from "electron"
import { ERC20Window } from '../components/Erc20Window'
import { Erc20DisplayToken } from '../API/cryptocurrencyAPI/erc20'


interface AppState {
    BTCBalance: number,
    ETHBalance: number,
    LTCBalance: number,
    XRPBalance: number,
    BTCPrice: number,
    ETHPrice: number,
    LTCPrice: number,
    XRPPrice: number,
    totalBalance: number,
    BTCHourChange: number,
    ETHHourChange: number,
    LTCHourChange: number,
    XRPHourChange: number,
    BTCLastTx: Array<DisplayTransaction>,
    LTCLastTx: Array<DisplayTransaction>,
    ETHLastTx: Array<DisplayTransaction>,
    XRPLastTx: Array<DisplayTransaction>,
    connection: boolean,
    status: boolean,
    redirect: boolean,
    allowInit: boolean,
    redirectToTransactionSuccess: boolean,
    totalPercentage: number,
    isInitialized: boolean,
    walletStatus: number,
    redirectToMain: boolean,
    stateTransaction: string,
    activeCurrency: number,
    BTCCourse: number,
    LTCCourse: number,
    ETHCourse: number,
    XRPCourse: number,
    SR: boolean,
    SideBarLeftState: number,
    numTransactions: number,
    transactionFee: number,
    chartBTC: Array<any>,
    chartLen: number
}


export default class App extends React.Component<{}, AppState> {
    
    erc20mock: Array<Erc20DisplayToken> = [{
        address: "0x1233131313131231231313141",
        name: "afafafafaf",
        amount: 11010
    },{
        address: "0xv3414214324324321311vfdvdvd",
        name: "iurwhgiwuhrgiwhrg",
        amount: 20202002
    }]

    routes = [
        {
            path: '/main',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeft/>,
            main: () => <MainContent btcBalance={this.state.BTCBalance} ltcBalance={this.state.LTCBalance}
                                     ethBalance={this.state.ETHBalance} xrpBalance={this.state.XRPBalance}
                                     total={this.state.totalBalance} numTr={this.state.numTransactions}
                                     btcPrice={this.state.BTCPrice} ltcPrice={this.state.LTCPrice}
                                     ethPrice={this.state.ETHPrice} xrpPrice={this.state.XRPPrice}
                                     btcHourChange={this.state.BTCHourChange}
                                     ltcHourChange={this.state.LTCHourChange}
                                     ethHourChange={this.state.ETHHourChange}
                                     xrpHourChange={this.state.XRPHourChange}
                                     updateStateBTC={this.setStateTransBTC}
                                     updateStateETH={this.setStateTransETH}
                                     updateStateLTC={this.setStateTransLTC}
                                     updateStateXRP={this.setStateTransXRP}
                                     setActiveCurrency={this.setActiveCurrency}
                                     getActiveCurrency={this.getActiveCurrency}

                                     lastTx={
                                         this.state.BTCLastTx
                                            .concat(this.state.ETHLastTx, this.state.LTCLastTx, this.state.XRPLastTx)
                                            .sort((a: DisplayTransaction, b: DisplayTransaction) => {
                                                return b.dateUnix - a.dateUnix
                                            })
                                        } 
                                     transactions={this.getTransactions}
                                     refresh={this.updateData} stateSR={this.setStateSR}
                                     chartBTC={this.state.chartBTC} setChartLen={this.setChartLen}
                                     chartLen={this.state.chartLen} />
        },
        {
            path: '/mode-window',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeft/>,
            main: () => <ModeWindow setFee={this.setTransactionFee} trFee={this.state.transactionFee}/>
        },
        {
            path: '/currency-carousel',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeft/>,
            main: () => <CarouselHOC setActiveCurrency={this.setActiveCurrency}
                                     getActiveCurrency={this.getActiveCurrency}
                                     activeCurrency={this.state.activeCurrency}
                                     btcBalance={this.state.BTCBalance} ltcBalance={this.state.LTCBalance}
                                     ethBalance={this.state.ETHBalance} xrpBalance={this.state.XRPBalance}
                                     btcPrice={this.state.BTCPrice} ltcPrice={this.state.LTCPrice}
                                     ethPrice={this.state.ETHPrice} xrpPrice={this.state.XRPPrice}
                                     stateSR={this.setStateSR}
            />
        },
        {
            path: '/btc-window-send',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeftBlur/>,
            main: () => <BtcSendWindow stateSR={this.setStateSR} course={this.state.BTCCourse}
                                       btcBalance={this.state.BTCBalance} trFee={this.state.transactionFee}
                                       setFee={this.setTransactionFee}/>
        },
        {
            path: '/btc-window-recieve',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeftBlur/>,
            main: () => <BtcRecieveWindow stateSR={this.setStateSR}/>
        },
        {
            path: '/ltc-window-send',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeftBlur/>,
            main: () => <LtcSendWindow stateSR={this.setStateSR} course={this.state.LTCCourse}
                                       btcBalance={this.state.LTCBalance} trFee={this.state.transactionFee}
                                       setFee={this.setTransactionFee}/>
        },
        {
            path: '/ltc-window-recieve',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeftBlur/>,
            main: () => <LtcRecieveWindow stateSR={this.setStateSR}/>
        },
        {
            path: '/eth-window-send',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeftBlur/>,
            main: () => <EthSendWindow stateSR={this.setStateSR} course={this.state.ETHCourse}
                                       btcBalance={this.state.ETHBalance} trFee={this.state.transactionFee}
                                       setFee={this.setTransactionFee}/>
        },
        {
            path: '/eth-window-recieve',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeftBlur/>,
            main: () => <EthRecieveWindow stateSR={this.setStateSR}/>
        },
        {
            path: '/xrp-window-send',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeftBlur/>,
            main: () => <XrpSendWindow stateSR={this.setStateSR} course={this.state.XRPCourse}
                                       btcBalance={this.state.XRPBalance} trFee={this.state.transactionFee}
                                       setFee={this.setTransactionFee}/>
        },
        {
            path: '/xrp-window-recieve',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeftBlur/>,
            main: () => <XrpRecieveWindow stateSR={this.setStateSR}/>
        },

        {
            path: '/history-carousel',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeft/>,
            main: () => <CarouselHistory setActiveCurrency={this.setActiveCurrency}
                                         getActiveCurrency={this.getActiveCurrency}
                                         activeCurrency={this.state.activeCurrency}
                                         stateSR={this.setStateSR}
                                         refresh={this.updateData}
                                         lastTxBTC={this.state.BTCLastTx.sort((a: any, b: any) => {
                                             let c = new Date(a.Date).getTime()
                                             let d = new Date(b.Date).getTime()
                                             return d - c
                                         })}
                                         lastTxETH={this.state.ETHLastTx.sort((a: any, b: any) => {
                                             let c = new Date(a.Date).getTime()
                                             let d = new Date(b.Date).getTime()
                                             return d - c
                                         })}
                                         lastTxLTC={this.state.LTCLastTx.sort((a: any, b: any) => {
                                             let c = new Date(a.Date).getTime()
                                             let d = new Date(b.Date).getTime()
                                             return d - c
                                         })}
                                         lastTxXRP={this.state.XRPLastTx.sort((a: any, b: any) => {
                                             let c = new Date(a.Date).getTime()
                                             let d = new Date(b.Date).getTime()
                                             return d - c
                                         })}
            />
        },

        {
            path: '/btc-window',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeft/>,
            main: () => <BTCWindow balance={this.state.BTCBalance} price={this.state.BTCPrice}
                                   course={this.state.BTCCourse}
                                   hourChange={this.state.BTCHourChange} pathState={this.state.stateTransaction}
                                   lastTx={this.state.BTCLastTx.sort((a: any, b: any) => {
                                       let c = new Date(a.Date).getTime()
                                       let d = new Date(b.Date).getTime()
                                       return d - c
                                   })} transactions={this.getTransactions} redirect={this.redirectToTransactionsuccess}
                                   reset={this.resetRedirect}/>
        },
        {
            path: '/eth-window',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeft/>,
            main: () => <ETHWIndow balance={this.state.ETHBalance} price={this.state.ETHPrice}
                                   course={this.state.BTCCourse}
                                   hourChange={this.state.ETHHourChange}
                                   lastTx={this.state.ETHLastTx.sort((a: any, b: any) => {
                                       let c = new Date(a.Date).getTime()
                                       let d = new Date(b.Date).getTime()
                                       return d - c
                                   })} redirect={this.redirectToTransactionsuccess} reset={this.resetRedirect}/>
        },
        {
            path: '/ltc-window',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeft/>,
            main: () => <LTCWindow balance={this.state.LTCBalance} price={this.state.LTCPrice}
                                   course={this.state.BTCCourse}
                                   hourChange={this.state.LTCHourChange}
                                   lastTx={this.state.LTCLastTx.sort((a: any, b: any) => {
                                       let c = new Date(a.Date).getTime()
                                       let d = new Date(b.Date).getTime()
                                       return d - c
                                   })} transactions={this.getTransactions} redirect={this.redirectToTransactionsuccess}
                                   reset={this.resetRedirect}/>
        }, 
        {
            path: '/erc20-window',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeft/>,
            main: () => <ERC20Window data={this.erc20mock}/>
        }
    ]

    constructor(props: any) {
        super(props)

        this.state = {
            BTCBalance: 0.00,
            ETHBalance: 0.00,
            LTCBalance: 0.00,
            XRPBalance: 0.00,
            BTCPrice: 0.00,
            ETHPrice: 0.00,
            LTCPrice: 0.00,
            XRPPrice: 0.00,
            totalBalance: 0.00,
            BTCHourChange: 0,
            LTCHourChange: 0,
            ETHHourChange: 0,
            XRPHourChange: 0,
            LTCLastTx: [],
            BTCLastTx: [],
            ETHLastTx: [],
            XRPLastTx: [],
            connection: false,
            status: false,
            redirect: false,
            allowInit: true,
            redirectToTransactionSuccess: false,
            totalPercentage: 0,
            isInitialized: false,
            walletStatus: 3,
            redirectToMain: false,
            stateTransaction: '/btc-window',
            activeCurrency: 1,
            BTCCourse: 0,
            LTCCourse: 0,
            ETHCourse: 0,
            XRPCourse: 0,
            SR: false,
            SideBarLeftState: 1,
            numTransactions: 0,
            transactionFee: 2,
            chartBTC: [],
            chartLen: 360
        }

        this.resetRedirect = this.resetRedirect.bind(this)
        this.redirectToTransactionsuccess = this.redirectToTransactionsuccess.bind(this)
        this.initAll = this.initAll.bind(this)
        this.getBalances = this.getBalances.bind(this)
        this.getTransactions = this.getTransactions.bind(this)
        this.updateData = this.updateData.bind(this)
        this.connectionERROR = this.connectionERROR.bind(this)
        this.connectionOK = this.connectionOK.bind(this)
        this.changeBalance = this.changeBalance.bind(this)
        this.startWalletInfoPing = this.startWalletInfoPing.bind(this)
        this.setRedirectToMain = this.setRedirectToMain.bind(this)
        this.getRates = this.getRates.bind(this)
        this.setValues = this.setValues.bind(this)
        this.setStateTransBTC = this.setStateTransBTC.bind(this)
        this.setStateTransETH = this.setStateTransETH.bind(this)
        this.setStateTransLTC = this.setStateTransLTC.bind(this)
        this.setStateTransXRP = this.setStateTransXRP.bind(this)
        this.getActiveCurrency = this.getActiveCurrency.bind(this)
        this.setActiveCurrency = this.setActiveCurrency.bind(this)
        this.setStateSR = this.setStateSR.bind(this)
        this.setNumTransactions = this.setNumTransactions.bind(this)
        this.setTransactionFee = this.setTransactionFee.bind(this)
        this.setChartBTC = this.setChartBTC.bind(this)
        this.setChartLen = this.setChartLen.bind(this)
    }

    setChartLen(len: number) {
        this.setState({chartLen: len})
    }

    async setChartBTC() {
        const currentDate = new Date()
        const month = currentDate.getMonth() + 1
        const monthStr = month < 10 ? `0${month.toString()}` : month.toString()
        const day = currentDate.getDate()
        const dayStr = day < 10 ? `0${day.toString()}` : day.toString()
        const dateEnd = `${currentDate.getFullYear().toString()}-${monthStr}-${dayStr}`
        const dateStart = `${(currentDate.getFullYear() - 1).toString()}-${monthStr}-${dayStr}`

        const arrData = await getChartBTC(dateEnd, dateStart);
        const arr = Array(365)
        for (let index = 0; index < 365; index++) {
            const dateN = new Date(Date.now() - 86400000 * (364 - index))
            let mon: string
            switch (dateN.getMonth() + 1) {
                case 1:{
                    mon = 'jan'
                    break
                }
                case 2:{
                    mon = 'feb'
                    break
                }
                case 3:{
                    mon = 'mar'
                    break
                }
                case 4:{
                    mon = 'apr'
                    break
                }
                case 5:{
                    mon = 'may'
                    break
                }
                case 6:{
                    mon = 'jun'
                    break
                }
                case 7:{
                    mon = 'jul'
                    break
                }
                case 8:{
                    mon = 'aug'
                    break
                }
                case 9:{
                    mon = 'sep'
                    break
                }
                case 10:{
                    mon = 'oct'
                    break
                }
                case 11:{
                    mon = 'nov'
                    break
                }
                case 12:{
                    mon = 'dec'
                    break
                }
            }
            const chartDate = `${dateN.getDate().toString()}.${mon}`
            arr[index] = {date: chartDate, pv: arrData[index]}
        }
        this.setState({chartBTC: arr})
    }

    setTransactionFee(num: number) {
        this.setState({transactionFee: num})
    }

    setNumTransactions(num: number) {
        let old = this.state.numTransactions
        this.setState({numTransactions: old + num})
    }

    getActiveCurrency(): string {
        log("GET ACTIVE CURRENCY")
        switch (this.state.activeCurrency) {
            case 1: {
                return "BTC"
            }
            case 2: {
                return "ETH"
            }
            case 3: {
                return "LTC"
            }
            case 4: {
                return "XRP"
            }
        }
    }

    setActiveCurrency(currency: string) {
        log("Setting active currency + " + currency)
        switch (currency) {
            case 'BTC': {
                log("Setting active currency BTC ")
                this.setState({activeCurrency: 1})
                break
            }
            case 'ETH': {
                log("Setting active currency ETH ")
                this.setState({activeCurrency: 2})
                break
            }
            case 'LTC': {
                log("Setting active currency LTC ")
                this.setState({activeCurrency: 3})
                break
            }
            case 'XRP': {
                log("Setting active currency XRP ")
                this.setState({activeCurrency: 4})
                break
            }
        }
    }

    setStateSR(sr: boolean) {
        this.setState({SR: sr})
    }

    setStateTransBTC() {
        this.setState({stateTransaction: '/btc-window'})
        console.log(this.state.stateTransaction)
    }

    setStateTransETH() {
        this.setState({stateTransaction: '/eth-window'})
        console.log(this.state.stateTransaction)
    }

    setStateTransLTC() {
        this.setState({stateTransaction: '/ltc-window'})
        console.log(this.state.stateTransaction)
    }

    setStateTransXRP() {
        this.setState({stateTransaction: '/btc-window'})
        console.log(this.state.stateTransaction)
    }

    redirectToTransactionsuccess() {
        let self = this
        self.resetRedirect()
        self.setState({redirectToTransactionSuccess: true})
    }

    resetRedirect() {
        this.setState({redirectToTransactionSuccess: false})
    }

    connectionOK() {
        this.setState({connection: true})
    }

    connectionERROR() {
        this.setState({connection: false})
    }

    startWalletInfoPing() {
        let interval = setInterval(async () => {
            try {
                info('START GETWALLET INFO')
                const data = await getInfoPCSC()
                info('GOT THIS DATA', data)
                switch (data) {
                    case 0: {
                        clearInterval(interval)
                        info('SETTING WALLET STATUS 0')

                        await this.initAll()

                        this.setState({walletStatus: 0})
                        break
                    }
                    case 1: {
                        this.setState({walletStatus: 1})
                        break
                    }
                    case 2: {
                        this.setState({walletStatus: 2})
                        break
                    }
                    case 3: {
                        this.setState({walletStatus: 3})
                        break
                    }
                    case 4: {
                        this.setState({walletStatus: 4})
                        break
                    }
                }
            } catch (error) {
                info('GOT ERROR', error)
                clearInterval(interval)
            }
        }, 500, [])
    }


    async componentDidMount() {
        pcsc.on('reader', async reader => {
            setReader(reader)
            reader.on('status', status => {
                const changes = reader.state ^ status.state
                if ((changes & reader.SCARD_STATE_PRESENT) && (status.state & reader.SCARD_STATE_PRESENT)) {
                    reader.connect({
                            share_mode: reader.SCARD_SHARE_SHARED,
                            protocol: reader.SCARD_PROTOCOL_T1
                    }, async (err, _) => {
                        if (err) {
                            info(err)
                            remote.dialog.showErrorBox("PCSC error", err.message)
                        } else {
                            this.setState({connection: true})
                            this.startWalletInfoPing()
                        }
                })
            }
            })

            reader.on('error', err => {
                info('Error', err.message)
                remote.dialog.showErrorBox("PCSC error", err.message)
            })
            reader.on('end', () => {
                info('Reader', reader.name, 'removed')
                this.setState({connection: false})
            })
        })

        pcsc.on('error', err => {
            info('PCSC error', err.message)
            remote.dialog.showErrorBox("PCSC error", err.message)
        })
    }

    setRedirectToMain() {
        this.setState({redirectToMain: true})
    }

    async initAll() {
        info('initAll')
        try {
            if (this.state.allowInit) {
                this.setState({allowInit: false})
                const updateHwStatus = async () => UpdateHWStatusPCSC(this.state.BTCBalance, this.state.BTCPrice, this.state.ETHBalance, this.state.ETHPrice, this.state.LTCBalance, this.state.LTCPrice, this.state.XRPBalance, this.state.XRPPrice, this.state.numTransactions)
                const updateHwTransactions = async () => updateTransactionsPCSC(this.state.BTCLastTx, this.state.ETHLastTx,this.state.LTCLastTx,this.state.XRPLastTx)
                const redirect =  () => {
                    this.setRedirectToMain()
                    this.setValues()
                }
                await Promise.all([initBitcoinAddress(), initEthereumAddress(), initLitecoinAddress()])
                await Promise.all([this.getBalances(), this.getTransactions()])
                await Promise.all([this.setChartBTC(), this.getRates()])
                await Promise.all([redirect(), updateHwStatus(), updateHwTransactions()])
            }
        } catch(err) {
            info(err)
            remote.dialog.showErrorBox("Initialization error", err.message)
        }
    }

    setValues() {
        setBTCBalance(this.state.BTCBalance)
        setBTCPrice(this.state.BTCPrice)
        setETHBalance(this.state.ETHBalance)
        setETHPrice(this.state.ETHPrice)
        setLTCBalance(this.state.LTCBalance)
        setLTCPrice(this.state.LTCPrice)
        setXRPBalance(this.state.XRPBalance)
        setXRPPrice(this.state.XRPPrice)
    }

    async updateData() {
        info('REFRESHING')
        this.setState({numTransactions: 0})
        await Promise.all([this.getTransactions(), this.getBalances()])
        const updateHwStatus = async () => UpdateHWStatusPCSC(this.state.BTCBalance, this.state.BTCPrice, this.state.ETHBalance, this.state.ETHPrice, this.state.LTCBalance, this.state.LTCPrice, this.state.XRPBalance, this.state.XRPPrice, this.state.numTransactions)
        await Promise.all([this.getRates(), updateHwStatus()])
    
    }

    changeBalance(currency: string, amount: number) {
        switch (currency) {
            case 'BTC': {
                this.setState({BTCBalance: (this.state.BTCBalance - amount)})
                break
            }
            case 'ETH': {
                this.setState({ETHBalance: (this.state.ETHBalance - amount)})
                break
            }
            case 'LTC': {
                this.setState({LTCBalance: (this.state.LTCBalance - amount)})
            }
            case 'XRP': {
                this.setState({XRPBalance: (this.state.XRPBalance - amount)})
            }
        }
    }

    async getRates(): Promise<void> {
        const rates = await getCurrencyRate();
        if (rates.status.error_code != 0) {
            return
        }
        for (const rate of rates.data) {
            const usdQuote = rate.quote.USD
            switch (rate.slug) {
                case "bitcoin": {
                    this.setState({
                        BTCPrice: parseFloat(Number(usdQuote.price * this.state.BTCBalance).toFixed(1)),
                        BTCCourse: usdQuote.price,
                        BTCHourChange: Number(usdQuote.percent_change_1h)
                    })
                    break
                }
                case "litecoin": {
                    this.setState({
                        LTCPrice: parseFloat(Number(usdQuote.price * this.state.LTCBalance).toFixed(1)),
                        LTCCourse: usdQuote.price,
                        LTCHourChange: Number(usdQuote.percent_change_1h)
                    })
                    break
                }
                case "ethereum": {
                    this.setState({
                        ETHPrice: parseFloat(Number(usdQuote.price * this.state.ETHBalance).toFixed(1)),
                        ETHCourse: usdQuote.price,
                        ETHHourChange: Number(usdQuote.percent_change_1h)
                    })
                    break
                }
                case "ripple": {
                    this.setState({
                        XRPPrice: parseFloat(Number(usdQuote.price * this.state.XRPBalance).toFixed(1)),
                        XRPCourse: usdQuote.price,
                        XRPHourChange: Number(usdQuote.percent_change_1h)
                    })
                    break
                }
            }
           
        } 
        const total = this.state.BTCPrice + this.state.ETHPrice + this.state.LTCPrice + this.state.XRPPrice  
        this.setState({totalBalance: Number((total).toFixed(8))})
        const totalPercentage = this.state.BTCHourChange + this.state.ETHHourChange + this.state.LTCHourChange + this.state.XRPHourChange
        this.setState({totalPercentage: Number((totalPercentage).toFixed(2))})
    }

    async getBalances() {
        const balances = await Promise.all([getBTCBalance(), getLTCBalance(),  getETHBalance(), getXRPBalance()])
        this.setState({BTCBalance: balances[0]})
        this.setState({LTCBalance: balances[1]})
        this.setState({ETHBalance: balances[2]})
        this.setState({XRPBalance: balances[3]})
    }

    componentWillMount() {
        this.setState({redirect: true})
    }

    async getTransactions() {
        const transactions = await Promise.all([getBitcoinLastTx(), getLitecoinLastTx(), getEthereumLastTx(), getRippleLastTx()])
        this.setState({BTCLastTx: transactions[0]})
        this.setState({LTCLastTx: transactions[1]})
        this.setState({ETHLastTx: transactions[2]})
        this.setState({XRPLastTx: transactions[3]})
    }

    render() {
        let container: string = (this.state.redirectToMain === true) ? 'main_container' : 'container'
        if (this.state.SR) container = 'main_container_blur'
        return (
            <div className='blackBackground'>
                <Header/>
                <div className={container}>
                    {(this.state.redirect) ? (
                        <Redirect to='/start'/>
                    ) : (
                        null
                    )}
                    {(this.state.redirectToTransactionSuccess) ? (
                        <Redirect to='/transaction_success'/>
                    ) : (
                        null
                    )}
                    <Route path='/transaction_success' component={() => <TransactionSuccess refresh={this.updateData}
                                                                                            resetState={this.redirectToTransactionsuccess}/>}/>
                    <Route path='/start' component={() => <MainWindow connection={this.state.connection}
                                                                      status={this.state.status}
                                                                      init={this.initAll}
                                                                      isInitialized={this.state.isInitialized}
                                                                      walletStatus={this.state.walletStatus}
                                                                      redirectToMain={this.state.redirectToMain}/>}/>
                    {this.routes.map((route, index) => (
                        <Route
                            exact={route.exact}
                            key={index}
                            path={route.path}
                            component={route.sidebarLeft}
                        />
                    ))}


                    {this.routes.map((route, index) => (
                        <Route
                            exact={route.exact}
                            key={index}
                            path={route.path}
                            component={route.sidebar}
                        />
                    ))}
                </div>

                <div className='containerData'>
                    {this.routes.map((route, index) => (
                        <Route
                            key={index}
                            exact={route.exact}
                            path={route.path}
                            component={route.main}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

