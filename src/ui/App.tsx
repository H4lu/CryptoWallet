import {info, log} from 'electron-log'
import React from 'react'
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
    getEthereumAddress,
    setETHBalance,
    setETHPrice
} from '../API/cryptocurrencyAPI/Ethereum'
import GetCurrencyRate from '../core/GetCurrencyRate'
import {SidebarNoButtons} from '../components/SidebarNoButtons'
import {MainWindow} from '../components/MainWindow'
import {TransactionSuccess} from '../components/TransactionSuccess'
import pcsclite from 'pcsclite'
import {reader, setReader} from '../API/hardwareAPI/Reader'

let pcsc = new pcsclite()
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
import {getRate} from "../API/cryptocurrencyAPI/Exchange";
import {ModeWindow} from "../components/ModeWindow";


interface IAPPState {
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
    BTCLastTx: Array<any>,
    LTCLastTx: Array<any>,
    ETHLastTx: Array<any>,
    XRPLastTx: Array<any>,
    connection: boolean,
    status: boolean,
    redirect: boolean,
    tempState: Array<any>,
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


export default class App extends React.Component<any, IAPPState> {

    routes = [
        {
            path: '/main',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeft refresh={this.updateData} pathState={this.state.stateTransaction}/>,
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

                                     lastTx={this.state.BTCLastTx.concat(this.state.ETHLastTx, this.state.LTCLastTx, this.state.XRPLastTx).sort((a: any, b: any) => {
                                         let c = new Date(a.Date).getTime()
                                         let d = new Date(b.Date).getTime()
                                         return d - c
                                     })} transactions={this.getTransactions}
                                     refresh={this.updateData} stateSR={this.setStateSR}
                                     chartBTC={this.state.chartBTC} setChartLen={this.setChartLen}
                                      chartLen={this.state.chartLen} />
        },
        {
            path: '/mode-window',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeft refresh={this.updateData} pathState={this.state.stateTransaction}/>,
            main: () => <ModeWindow setFee={this.setTransactionFee} trFee={this.state.transactionFee}/>
        },
        {
            path: '/currency-carousel',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: () => <SidebarLeft refresh={this.updateData} pathState={this.state.stateTransaction}/>,
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
            sidebarLeft: () => <SidebarLeft refresh={this.updateData} pathState={this.state.stateTransaction}/>,
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
            sidebarLeft: () => <SidebarLeft refresh={this.updateData} pathState={this.state.stateTransaction}/>,
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
            sidebarLeft: () => <SidebarLeft refresh={this.updateData} pathState={this.state.stateTransaction}/>,
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
            sidebarLeft: () => <SidebarLeft refresh={this.updateData} pathState={this.state.stateTransaction}/>,
            main: () => <LTCWindow balance={this.state.LTCBalance} price={this.state.LTCPrice}
                                   course={this.state.BTCCourse}
                                   hourChange={this.state.LTCHourChange}
                                   lastTx={this.state.LTCLastTx.sort((a: any, b: any) => {
                                       let c = new Date(a.Date).getTime()
                                       let d = new Date(b.Date).getTime()
                                       return d - c
                                   })} transactions={this.getTransactions} redirect={this.redirectToTransactionsuccess}
                                   reset={this.resetRedirect}/>
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
            tempState: [],
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
        this.parseETHTransactions = this.parseETHTransactions.bind(this)
        this.parseTransactionDataETH = this.parseTransactionDataETH.bind(this)
        this.parseBTCLikeTransactions = this.parseBTCLikeTransactions.bind(this)
        this.parseTransactionDataBTC = this.parseTransactionDataBTC.bind(this)
        // this.waitForPin = this.waitForPin.bind(this)
        this.initAll = this.initAll.bind(this)
        this.getBalances = this.getBalances.bind(this)
        this.getTransactions = this.getTransactions.bind(this)
        this.updateData = this.updateData.bind(this)
        this.connectionERROR = this.connectionERROR.bind(this)
        this.connectionOK = this.connectionOK.bind(this)
        this.addUnconfirmedTx = this.addUnconfirmedTx.bind(this)
        this.changeBalance = this.changeBalance.bind(this)
        this.getWalletInfo = this.getWalletInfo.bind(this)
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
        let currentDate = new Date()
        let month = currentDate.getMonth() + 1
        let monthStr: string
        if (month < 10) {
            monthStr = '0' + month.toString()
        } else {
            monthStr = month.toString()
        }
        let day = currentDate.getDate()
        let dayStr: string
        if (day < 10) {
            dayStr = '0' + day.toString()
        } else {
            dayStr = day.toString()
        }
        let dataend = currentDate.getFullYear().toString() + '-' + monthStr + '-' + dayStr
        let datastart = (currentDate.getFullYear() - 1).toString() + '-' + monthStr + '-' + dayStr

        let arrData = await getChartBTC(dataend, datastart);
        let arr = []
        for (let index = 0; index < 365; index++) {
            let dataN = new Date(Date.now() - 86400000 * (364 - index))
            let mon: string
            switch (dataN.getMonth() + 1){
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
            let dat = dataN.getDate().toString() + '.' + mon
            let temp = {date: dat, pv: arrData[index]}
            arr.push(temp)
        }
        for (let index = 0; index < 365; index++) {
            this.setState({chartBTC: [...this.state.chartBTC, arr[index]]})
        }
    }


    setTransactionFee(num: number) {
        this.setState({transactionFee: num},
            () => {
                console.log('FEE:  ', this.state.transactionFee)
            })

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

    getWalletInfo() {
        let interval = setInterval(async () => {
            try {
                info('START GETWALLET INFO')
                let data = await getInfoPCSC()
                info('GOT THIS DATA', data)
                switch (data) {
                    case 0: {
                        clearInterval(interval)
                        info('SETTING WALLET STATUS 0')

                        this.initAll()

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

        info('APP PROPS:', this.props)
        info('APP:', App)
        pcsc.on('reader', async (reader) => {
            info('READER DETECTED', reader.name)
            info('setting')
            setReader(reader)
            reader.on('status', (status) => {
                info('READER STATE', reader.state)
                let changes = reader.state ^ status.state
                info(status)
                if (changes) {
                    if ((changes & reader.SCARD_STATE_EMPTY) && (status.state & reader.SCARD_STATE_EMPTY)) {
                        info('ASD')
                    } else if ((changes & reader.SCARD_STATE_PRESENT) && (status.state & reader.SCARD_STATE_PRESENT)) {
                        info('card inserted')
                        reader.connect({
                            share_mode: reader.SCARD_SHARE_SHARED,
                            protocol: reader.SCARD_PROTOCOL_T1
                        }, async (err, protocol) => {
                            if (err) {
                                info('ERROR OCCURED', err)
                                info(err)
                            } else {
                                info('CONNECTED')
                                this.setState({connection: true})

                                this.getWalletInfo()
                                /*reader.transmit(Buffer.from([0x00,0xA4,0x04,0x00,0x08,0x48,0x65,0x6C,0x6C, 0x6F, 0x41, 0x70, 0x70]), 4,2,(err,data) => {
                                    if (err) {
                                        info('ERROR IN APLET', err)
                                    } else {
                                        info('SETAPLET', data.toString('hex'))
                                        reader.transmit(Buffer.from([0xB0,0x60,0x00,0x00,0x04,0x31,0x32,0x33,0x34]), 100,2,(err,data) => {
                                            if (err) {
                                                info('ERROR IN SETPIN', err)
                                            } else {
                                                info('SETPIN', data.toString('hex'))

                                                this.getWalletInfo()
                                            }
                                        })
                                    }
                                })*/

                                info('Protocol(', reader.name, '):', protocol)
                            }
                        })
                    }
                }
            })

            reader.on('error', function (err) {
                info('Error(', this.name, '):', err.message)
            })
            reader.on('end', () => {
                info('Reader', reader.name, 'removed')
                this.setState({connection: false})
            })
        })


        pcsc.on('error', function (err) {
            info('PCSC error', err.message)
        })
    }

    setRedirectToMain() {
        this.setState({redirectToMain: true})
    }

    initAll() {
        info('initAll')
        if (this.state.allowInit) {
            this.setState({allowInit: false})
            initBitcoinAddress().then(initEthereumAddress).then(initLitecoinAddress).then(initRippleAddress).then(this.getRates).then(this.getBalances).then(this.getTransactions).then(() => UpdateHWStatusPCSC(this.state.BTCBalance, this.state.BTCPrice, this.state.ETHBalance, this.state.ETHPrice, this.state.LTCBalance, this.state.LTCPrice, this.state.XRPBalance, this.state.XRPPrice, this.state.numTransactions)).then(() => {
                this.setRedirectToMain()
                this.setValues()
            }).then(this.updateData).then(this.setChartBTC).then(() =>updateTransactionsPCSC(this.state.BTCLastTx, this.state.ETHLastTx,this.state.LTCLastTx,this.state.XRPLastTx))
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

    updateData() {
        info('REFRESHING')
        this.setState({numTransactions: 0})
        this.getTransactions().then(this.getBalances).then(this.getRates)
            .then(() => {
                UpdateHWStatusPCSC(this.state.BTCBalance, this.state.BTCPrice, this.state.ETHBalance, this.state.ETHPrice, this.state.LTCBalance, this.state.LTCPrice, this.state.XRPBalance, this.state.XRPPrice, this.state.numTransactions)
            })
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


    addUnconfirmedTx(currency: string, amount: number, address: string, hash: string) {
        let currentDate = new Date()
        let tx = {
            Date: currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getDate() + ' ' + currentDate.getHours() + ':' + currentDate.getMinutes(),
            Currency: currency,
            Amount: amount,
            Address: address,
            Status: 'Unconfirmed',
            Type: 'outgoing',
            Hash: hash
        }
        switch (currency) {
            case 'BTC' : {
                this.setState({BTCLastTx: [...this.state.BTCLastTx, tx]})
                break
            }
            case 'ETH': {
                this.setState({ETHLastTx: [...this.state.ETHLastTx, tx]})
                break
            }
            case 'LTC': {
                this.setState({LTCLastTx: [...this.state.LTCLastTx, tx]})
                break
            }
            case 'XRP': {
                this.setState({XRPLastTx: [...this.state.XRPLastTx, tx]})
                break
            }
        }
    }

    getRates() {
        return new Promise((resolve) => {
            info('IN GET RATES')
            GetCurrencyRate().then(value => {
                const parsedValue = JSON.parse(value.content)
                for (let item in parsedValue) {
                    switch (parsedValue[item].id) {
                        case 'bitcoin': {
                            info('BTC PRICE')
                            this.setState({
                                BTCPrice: Number((parsedValue[item].price_usd * this.state.BTCBalance).toFixed(2)),
                                BTCCourse: Number(parsedValue[item].price_usd),
                                BTCHourChange: Number(parsedValue[item].percent_change_1h)
                            })
                            info('BTC PRICE', parsedValue[item].price_usd, parsedValue[item].percent_change_1h)
                            break
                        }
                        case 'ethereum': {
                            info('ETH PRICE')
                            this.setState({
                                ETHPrice: Number((parsedValue[item].price_usd * this.state.ETHBalance).toFixed(2)),
                                ETHCourse: Number(parsedValue[item].price_usd),
                                ETHHourChange: Number(parsedValue[item].percent_change_1h)
                            })
                            info('ETH PRICE', this.state.ETHPrice, this.state.ETHHourChange)
                            break
                        }
                        case 'litecoin': {
                            this.setState({
                                LTCPrice: Number((parsedValue[item].price_usd * this.state.LTCBalance).toFixed(2)),
                                LTCCourse: Number(parsedValue[item].price_usd),
                                LTCHourChange: Number(parsedValue[item].percent_change_1h)
                            })
                            info('LTC PRICE', this.state.LTCPrice, this.state.LTCHourChange)
                            break
                        }
                        case 'ripple': {
                            this.setState({
                                XRPPrice: Number((parsedValue[item].price_usd * this.state.XRPBalance).toFixed(2)),
                                XRPCourse: Number(parsedValue[item].price_usd),
                                XRPHourChange: Number(parsedValue[item].percent_change_1h)
                            })
                            info('XRP PRICE', this.state.XRPPrice, this.state.XRPHourChange)
                            break
                        }
                    }
                }
                let total = this.state.BTCPrice + this.state.ETHPrice + this.state.LTCPrice + this.state.XRPPrice
                info('TOTAL', total)
                info(Number((total).toFixed(8)))
                this.setState({totalBalance: Number((total).toFixed(8))})
                let totalPercentage = this.state.BTCHourChange + this.state.ETHHourChange + this.state.LTCHourChange + this.state.XRPHourChange
                info('TOTAL PERCENTAGE', totalPercentage)
                this.setState({totalPercentage: Number((totalPercentage).toFixed(2))})
                resolve()
            })
        })
    }

    getBalances() {
        return Promise.all([getBTCBalance(), getETHBalance(), getLTCBalance(), getXRPBalance()]).then(value => {
            for (let item in value) {
                info('SUBSTRING' + value[item][0])
                info('VALUE OF SUB', value[item][1])
                switch (value[item][0]) {
                    case 'BTC': {
                        info('SETTING BTC BALANCE', value[item][1])
                        this.setState({BTCBalance: value[item][1]})
                        info('BTC STATE', this.state.BTCBalance)
                        break
                    }
                    case 'ETH': {
                        info('SETTING ETH BALANCE', value[item][1])
                        this.setState({ETHBalance: value[item][1]})
                        info('ETH STATE', this.state.ETHBalance)
                        break
                    }
                    case 'LTC': {
                        info('SETTING LTC BALANCE', value[item][1])
                        this.setState({LTCBalance: value[item][1]})
                        info('LTC STATE', this.state.LTCBalance)
                        break
                    }
                    case 'XRP': {
                        info('SETTING XRP BALANCE', value[item][1])
                        this.setState({XRPBalance: value[item][1]})
                        info('XRP STATE', this.state.XRPBalance)
                        break
                    }
                }
            }
        })
    }

    componentWillMount() {
        info('SETTING REDIRECT')
        this.setState({redirect: true})
    }

    getTransactions() {
        return Promise.all([getBitcoinLastTx(), getLitecoinLastTx(), getEthereumLastTx(), getRippleLastTx()]).then(value => {
            for (let index in value) {
                if (Object.prototype.hasOwnProperty.call(JSON.parse(value[index].content), 'data')) {
                    info('Parsing btc-like tx')
                    this.parseBTCLikeTransactions(value[index].content)
                } else {
                    info('PArsing eth tx')
                    this.parseETHTransactions(value[index].content)
                }
            }
        }).catch(error => {
            info(error)
        })
    }

    parseETHTransactions(value: any) {

        let transactionsObject = JSON.parse(value)
        if (transactionsObject === undefined) {
            info('RETURNING')
            return
        }

        transactionsObject.map((value: any) => {

            let parsedTx = this.parseTransactionDataETH(value, getEthereumAddress())
            let findResp = this.state.ETHLastTx.find(function (obj) {


                return obj.Hash === Object(parsedTx).Hash
            })
            if (findResp === undefined) {
                this.setState({ETHLastTx: [...this.state.ETHLastTx, parsedTx]})

                this.setNumTransactions(1)
                info('numTransaction: ', this.state.numTransactions)
            } else if (Object(parsedTx).Status !== findResp.Status) {
                for (let index in this.state.ETHLastTx) {
                    if (this.state.ETHLastTx[index].Hash === Object(parsedTx).Hash) {
                        this.state.ETHLastTx[index].Status = Object(parsedTx).Status
                    }
                }
            } else {
                this.setNumTransactions(1)
                info('numTransaction: ', this.state.numTransactions)
            }
        })

    }

    parseBTCLikeTransactions(value: any) {
        let parsedResponse = JSON.parse(value).data
        for (let tx in parsedResponse.txs) {
            this.setNumTransactions(1)
            info('numTransaction: ', this.state.numTransactions)
            switch (parsedResponse.network) {
                case 'BTC': {
                    let parsedTx = this.parseTransactionDataBTC(parsedResponse.txs[tx], 'BTC')
                    let findResp = this.state.BTCLastTx.find(function (obj) {
                        return obj.Hash === Object(parsedTx).Hash
                    })
                    if (findResp === undefined) {
                        this.setState({BTCLastTx: [...this.state.BTCLastTx, parsedTx]})
                    } else if (Object(parsedTx).Status !== findResp.Status) {
                        for (let index in this.state.BTCLastTx) {
                            if (this.state.BTCLastTx[index].Hash === Object(parsedTx).Hash) this.state.BTCLastTx[index].Status = Object(parsedTx).Status
                        }
                    }
                    break
                }
                case 'LTC': {
                    info('IN LTC')
                    let parsedTx = this.parseTransactionDataBTC(parsedResponse.txs[tx], 'LTC')
                    let findResp = this.state.LTCLastTx.find(function (obj) {
                        return obj.Hash === Object(parsedTx).Hash
                    })
                    if (findResp === undefined) {
                        this.setState({LTCLastTx: [...this.state.LTCLastTx, parsedTx]})
                    } else if (Object(parsedTx).Status !== findResp.Status) {
                        for (let index in this.state.LTCLastTx) {
                            if (this.state.LTCLastTx[index].Hash === Object(parsedTx).Hash) this.state.LTCLastTx[index].Status = Object(parsedTx).Status
                        }
                    }
                    break
                }
            }
        }
    }

    parseTransactionDataETH(transaction: any, ethAddress: string) {
        let date = new Date(transaction.timestamp * 1000)
        let dateCell = date.getHours() + ':' + ((date.getMinutes() >= 10) ? date.getMinutes() : '0' + date.getMinutes()) + ' ' + ' ' + ' ' + date.getDate() + ' ' + (date.getMonth() + 1) + ' ' + date.getFullYear()
        let amount = transaction.value
        let type = ''
        let hash = transaction.hash
        {
            (transaction.from === ethAddress.toLowerCase()) ? (type = 'outgoing') : (type = 'incoming')
        }
        let address = ''
        {
            (type === 'outgoing') ? (address = transaction.to) : (address = transaction.from)
        }
        let status = transaction.success ? 'Finished' : 'Active'
        let returnedObject = {
            DateUnix: date,
            Date: dateCell,
            Currency: 'ETH',
            Amount: amount,
            Address: address,
            Status: status,
            Type: type,
            Hash: hash
        }
        return returnedObject

    }

    parseTransactionDataBTC(transaction: any, currency: string): Object {
        let returnedObject = {}
        if (transaction.outgoing !== undefined) {
            let date = new Date(transaction.time * 1000)
            let dateCell = date.getHours() + ':' + ((date.getMinutes() >= 10) ? date.getMinutes() : '0' + date.getMinutes()) + ' ' + ' ' + ' ' + date.getDate() + ' ' + (date.getMonth() + 1) + ' ' + date.getFullYear()
            let amount = transaction.outgoing.outputs[0].value
            let address = transaction.outgoing.outputs[0].address
            let type = 'outgoing'
            let status = (transaction.confirmations === 0) ? 'Active' : 'Finished'
            let hash = transaction.txid
            let dataToPass = {
                DateUnix: date,
                Date: dateCell,
                Currency: currency,
                Amount: amount,
                Address: address,
                Status: status,
                Type: type,
                Hash: hash
            }
            returnedObject = dataToPass
        } else {
            let date = new Date(transaction.time * 1000)
            let dateCell = date.getHours() + ':' + ((date.getMinutes() >= 10) ? date.getMinutes() : '0' + date.getMinutes()) + ' ' + ' ' + ' ' + date.getDate() + ' ' + (date.getMonth() + 1) + ' ' + date.getFullYear()
            let amount = transaction.incoming.value
            let address = transaction.incoming.inputs[0].address
            let type = 'incoming'
            let status = (transaction.confirmations === 0) ? 'Active' : 'Finished'
            let hash = transaction.txid
            let dataToPass = {
                DateUnix: date,
                Date: dateCell,
                Currency: currency,
                Amount: amount,
                Address: address,
                Status: status,
                Type: type,
                Hash: hash
            }
            returnedObject = dataToPass
        }
        return returnedObject
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

