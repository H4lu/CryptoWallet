import React, {Component} from 'react'
import {Header} from './components/header'
import {Redirect, Route} from 'react-router'
import {SidebarContent} from './components/sidebarContent'
import './index.css'
import MainContent from './components/windows/mainWindow'
import {WalletCarousel} from './components/walletCarousel'
import {getCurrencyRate} from './core/setCurrencyRate'
import {StartWindow} from './components/windows/startWindow'
import {SidebarLeft} from "./components/sidebarLeft";
import {BtcRecieveWindow} from "./components/windows/btcRecieveWindow";
import {LtcRecieveWindow} from "./components/windows/ltcRecieveWindow";
import {EthRecieveWindow} from "./components/windows/ethReceiveWindow";
import {CarouselHistory} from "./components/carouselHistory";
import {DisplayTransaction, DisplayTransactionCurrency, Erc20DisplayToken} from './api/cryptocurrencyApi/utils';
import {ipcRenderer, remote} from "electron";
import {ERC20Window} from './components/windows/erc20Window';
import {FirmwareWindow} from './components/windows/firmwareWindow';
import {SendWindow} from './components/windows/sendWindow'
import {
    AddressChange,
    ConnectionStatus,
    DisplayBalanceStatus,
    ErrorMessage,
    PCSCMessage,
    TransactionsStatus,
    WalletStatus
} from './pcsc_helpers'

interface AppState {
    BTCAddress: string,
    ETHAddress: string,
    LTCAddress: string,
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
    activeCurrency: DisplayTransactionCurrency,
    BTCCourse: number,
    LTCCourse: number,
    ETHCourse: number,
    XRPCourse: number,
    SR: boolean,
    SideBarLeftState: number,
    numTransactions: number,
    chartBTC: Array<any>,
    chartLen: number,
    erc20Tokens: Array<Erc20DisplayToken>
}

const mockState: AppState = {
    BTCAddress: "1h3432hxh2h222agagagag32gfggafafaf",
    ETHAddress: "0xalibababababababaagagagaggq23333",
    LTCAddress: "1Lookoekokeagagagagagagagagf332222",
    BTCBalance: 0.02,
    ETHBalance: 0.1,
    LTCBalance: 0.3,
    XRPBalance: 0.0,
    BTCPrice: 14999,
    ETHPrice: 1313,
    LTCPrice: 222,
    XRPPrice: 31312,
    totalBalance: 1,
    BTCHourChange: 1,
    ETHHourChange: 2,
    LTCHourChange: 3,
    XRPHourChange: 4,
    BTCLastTx: [],
    LTCLastTx: [],
    ETHLastTx: [],
    XRPLastTx: [],
    connection: true,
    status: true,
    redirect: true,
    allowInit: true,
    redirectToTransactionSuccess: true,
    totalPercentage: 1,
    isInitialized: true,
    walletStatus: 0,
    redirectToMain: true,
    activeCurrency: "BTC",
    BTCCourse: 3131,
    LTCCourse: 2131313,
    ETHCourse: 131313,
    XRPCourse: 3131313,
    SR: true,
    SideBarLeftState: 1,
    numTransactions: 0,
    chartBTC: [],
    chartLen: 0,
    erc20Tokens: []
}

const initState: AppState = {
    BTCAddress: "",
    ETHAddress: "",
    LTCAddress: "",
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
    activeCurrency: 'BTC',
    BTCCourse: 0,
    LTCCourse: 0,
    ETHCourse: 0,
    XRPCourse: 0,
    SR: false,
    SideBarLeftState: 1,
    numTransactions: 0,
    chartBTC: [],
    chartLen: 360,
    erc20Tokens: []
}

export default class App extends Component<any, AppState> {
    routes = [
        {
            path: '/main',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: SidebarLeft,
            main: () => <MainContent
                btcBalance={this.state.BTCBalance}
                ltcBalance={this.state.LTCBalance}
                ethBalance={this.state.ETHBalance}
                xrpBalance={this.state.XRPBalance}
                total={this.state.totalBalance}
                numTr={this.state.numTransactions}
                btcPrice={this.state.BTCPrice}
                ltcPrice={this.state.LTCPrice}
                ethPrice={this.state.ETHPrice}
                xrpPrice={this.state.XRPPrice}
                btcHourChange={this.state.BTCHourChange}
                ltcHourChange={this.state.LTCHourChange}
                ethHourChange={this.state.ETHHourChange}
                xrpHourChange={this.state.XRPHourChange}
                setActiveCurrency={this.setActiveCurrency}
                activeCurrency={this.state.activeCurrency}

                lastTx={
                    this.state.BTCLastTx
                        .concat(this.state.ETHLastTx, this.state.LTCLastTx, this.state.XRPLastTx)
                        .sort((a, b) => {
                            return b.dateUnix - a.dateUnix
                        })
                }
                transactions={this.getTransactions}
                refresh={this.updateData}
                stateSR={this.setStateSR}
                chartBTC={this.state.chartBTC}
                setChartLen={this.setChartLen}
                chartLen={this.state.chartLen}
            />
        },
        {
            path: '/currency-carousel',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: SidebarLeft,
            main: () => <WalletCarousel
                setActiveCurrency={this.setActiveCurrency}
                activeCurrency={this.state.activeCurrency}
                btcBalance={this.state.BTCBalance}
                ltcBalance={this.state.LTCBalance}
                ethBalance={this.state.ETHBalance}
                btcPrice={this.state.BTCPrice}
                ltcPrice={this.state.LTCPrice}
                ethPrice={this.state.ETHPrice}
                stateSR={this.setStateSR}
            />
        },
        {
            path: '/btc-window-send',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: SidebarLeft,
            main: () => <SendWindow
                stateSR={this.setStateSR}
                course={this.state.BTCCourse}
                cryptoBalance={this.state.BTCBalance}
                feeCoeff={0}
                //  feeCoeff = {Math.floor(getFee(1) * 0.7) + 1}
                feeMagic={431}
                currency={"BTC"}
                feeDivider={100000000}
            />
        },
        {
            path: '/btc-window-receive',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: SidebarLeft,
            main: () => <BtcRecieveWindow stateSR={this.setStateSR} address={this.state.BTCAddress}/>
        },
        {
            path: '/ltc-window-send',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: SidebarLeft,
            main: () => <SendWindow
                stateSR={this.setStateSR}
                course={this.state.LTCCourse}
                cryptoBalance={this.state.LTCBalance}
                feeCoeff={25}
                feeMagic={431}
                currency={"LTC"}
                feeDivider={100000000}
            />
        },
        {
            path: '/ltc-window-receive',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: SidebarLeft,
            main: () => <LtcRecieveWindow stateSR={this.setStateSR} address={this.state.LTCAddress}/>
        },
        {
            path: '/eth-window-send',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: SidebarLeft,
            main: () => <SendWindow
                stateSR={this.setStateSR}
                course={this.state.ETHCourse}
                cryptoBalance={this.state.ETHBalance}
                feeCoeff={491}
                feeMagic={1}
                currency={"ETH"}
                feeDivider={1000000}
            />
        },
        {
            path: '/eth-window-receive',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: SidebarLeft,
            main: () => <EthRecieveWindow stateSR={this.setStateSR} address={this.state.ETHAddress}/>
        },
        {
            path: '/history-carousel',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: SidebarLeft,
            main: () => <CarouselHistory
                activeCurrency={this.state.activeCurrency}
                setActiveCurrency={this.setActiveCurrency}
                stateSR={this.setStateSR}
                refresh={this.updateData}
                lastTxBTC={this.state.BTCLastTx.sort((a, b) => {
                    const c = new Date(a.dateUnix).getTime()
                    const d = new Date(b.dateUnix).getTime()
                    return d - c
                })}
                lastTxETH={this.state.ETHLastTx.sort((a, b) => {
                    const c = new Date(a.dateUnix).getTime()
                    const d = new Date(b.dateUnix).getTime()
                    return d - c
                })}
                lastTxLTC={this.state.LTCLastTx.sort((a, b) => {
                    const c = new Date(a.dateUnix).getTime()
                    const d = new Date(b.dateUnix).getTime()
                    return d - c
                })}
                lastTxXRP={this.state.XRPLastTx.sort((a, b) => {
                    const c = new Date(a.dateUnix).getTime()
                    const d = new Date(b.dateUnix).getTime()
                    return d - c
                })}
            />
        },
        {
            path: '/erc20-window',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: SidebarLeft,
            main: () => <ERC20Window data={this.state.erc20Tokens}/>
        },
        {
            path: '/firmware-window',
            exact: true,
            sidebar: () => <SidebarContent/>,
            sidebarLeft: SidebarLeft,
            main: FirmwareWindow,
        }
    ]

    constructor(props: any) {
        super(props)
        this.state = mockState

        this.resetRedirect = this.resetRedirect.bind(this)
        this.redirectToTransactionsuccess = this.redirectToTransactionsuccess.bind(this)
        this.getTransactions = this.getTransactions.bind(this)
        this.updateData = this.updateData.bind(this)
        this.connectionERROR = this.connectionERROR.bind(this)
        this.connectionOK = this.connectionOK.bind(this)
        this.setRedirectToMain = this.setRedirectToMain.bind(this)
        this.getRates = this.getRates.bind(this)
        this.setActiveCurrency = this.setActiveCurrency.bind(this)
        this.setStateSR = this.setStateSR.bind(this)
        this.setNumTransactions = this.setNumTransactions.bind(this)
        this.setChartLen = this.setChartLen.bind(this)
        this.updateHwWalletInfo = this.updateHwWalletInfo.bind(this)
    }

    setChartLen(len: number) {
        this.setState({chartLen: len})
    }

    setNumTransactions(num: number) {
        let old = this.state.numTransactions
        this.setState({numTransactions: old + num})
    }

    setActiveCurrency(currency: DisplayTransactionCurrency) {
        this.setState({activeCurrency: currency})
    }

    setStateSR(sr: boolean) {
        this.setState({SR: sr})
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

    async componentDidMount() {
        this.setState({connection: true})
        this.setState({redirectToMain: true})
        this.setState({walletStatus: 0})
        ipcRenderer.on('pcsc', async (event, message) => {
            switch (message.type) {
                case 0: { // WALLET_STATUS_CHANGE
                    this.setState({walletStatus: (message.data as WalletStatus).walletStatus})
                    break
                }
                case 1: { // CONNECTION_STATUS_CHANGE
                    this.setState({connection: (message.data as ConnectionStatus).isConnected})
                    break
                }
                case 3: { // BALANCE_CHANGE
                    const data = message.data as DisplayBalanceStatus
                    switch (data.currency) {
                        case 'BTC': {
                            console.log("set btc balance", data.balance)
                            this.setState({BTCBalance: data.balance})
                            break
                        }
                        case 'ETH': {
                            console.log("set eth balance: ", data.balance)
                            this.setState({ETHBalance: data.balance})
                            break
                        }
                        case 'LTC': {
                            console.log("set ltc balance: ", data.balance)
                            this.setState({LTCBalance: data.balance})
                            break
                        }
                        case 'XRP': {
                            this.setState({XRPBalance: data.balance})
                            break
                        }
                        default:
                            return
                    }
                    break
                }
                case 4: { // TRANSACTIONS_CHANGE
                    const data = message.data as TransactionsStatus
                    switch (data.currency) {
                        case 'BTC': {
                            console.log("set btc last tx")
                            this.setState({BTCLastTx: data.transactions})
                            break
                        }
                        case 'ETH': {
                            console.log("set ")
                            this.setState({ETHLastTx: data.transactions})
                            break
                        }
                        case 'LTC': {
                            this.setState({LTCLastTx: data.transactions})
                            break
                        }
                        case 'XRP': {
                            this.setState({XRPLastTx: data.transactions})
                            break
                        }
                        default:
                            return
                    }
                    break
                }
                case 7: { // CHART_DATA_CHANGE
                    this.setState({chartBTC: message.data})
                    break
                }
                case 5: { // ERC20_CHANGE
                    this.setState({erc20Tokens: message.data})
                    break
                }
                case 6: { // INITIALIZED
                    await this.getRates()
                    await this.updateHwWalletInfo()
                    this.setRedirectToMain()
                    break
                }
                case 2: { // ERROR
                    remote.dialog.showErrorBox("Error", (message.data as ErrorMessage).errorMessage)
                    break
                }
                case 11: { // UPDATED
                    console.log("GOT UPDATED SIGNAL")
                    await this.getRates()
                    await this.updateHwWalletInfo()
                    break
                }
                case 13: { // ADDRESS_CHANGE
                    const data = message.data as AddressChange
                    switch (data.currency) {
                        case "BTC": {
                            this.setState({BTCAddress: data.address})
                            break
                        }
                        case "ETH": {
                            this.setState({ETHAddress: data.address})
                            break
                        }
                        case "LTC": {
                            this.setState({LTCAddress: data.address})
                            break
                        }
                        default:
                            return
                    }
                    break
                }
                case 14: { // TRANSACTION_SUCCESS
                    this.redirectToTransactionsuccess()
                    break
                }
                default:
                    return
            }
        })
    }

    setRedirectToMain() {
        this.setState({redirectToMain: true})
    }

    async updateHwWalletInfo() {
        // for some reason enum not work here
        let msg: PCSCMessage = {
            type: 8,
            data: [this.state.BTCBalance, this.state.BTCPrice, this.state.ETHBalance, this.state.ETHPrice, this.state.LTCBalance,
                this.state.LTCPrice, this.state.XRPBalance, this.state.XRPPrice, this.state.numTransactions]
        }
        ipcRenderer.send('pcsc', msg)
        msg = {
            type: 9,
            data: [this.state.BTCLastTx, this.state.ETHLastTx, this.state.LTCLastTx, this.state.XRPLastTx]
        }
        ipcRenderer.send('pcsc', msg)
    }

    async updateData() {
        this.setState({numTransactions: 0})
        ipcRenderer.send('pcsc', {type: 10})
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
                        BTCPrice: parseFloat((usdQuote.price * this.state.BTCBalance).toFixed(1)),
                        BTCCourse: usdQuote.price,
                        BTCHourChange: usdQuote.percent_change_1h
                    })
                    break
                }
                case "litecoin": {
                    this.setState({
                        LTCPrice: parseFloat((usdQuote.price * this.state.LTCBalance).toFixed(1)),
                        LTCCourse: usdQuote.price,
                        LTCHourChange: usdQuote.percent_change_1h
                    })
                    break
                }
                case "ethereum": {
                    this.setState({
                        ETHPrice: parseFloat((usdQuote.price * this.state.ETHBalance).toFixed(1)),
                        ETHCourse: usdQuote.price,
                        ETHHourChange: usdQuote.percent_change_1h
                    })
                    break
                }
                case "ripple": {
                    this.setState({
                        XRPPrice: parseFloat((usdQuote.price * this.state.XRPBalance).toFixed(1)),
                        XRPCourse: usdQuote.price,
                        XRPHourChange: usdQuote.percent_change_1h
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

    componentWillMount() {
        this.setState({redirect: true})
    }

    async getTransactions() {
        // const transactions = await Promise.all([getBitcoinLastTx(), getLitecoinLastTx(), getEthereumLastTx(), getRippleLastTx()])
        // this.setState({BTCLastTx: transactions[0]})
        // this.setState({LTCLastTx: transactions[1]})
        // this.setState({ETHLastTx: transactions[2]})
        // this.setState({XRPLastTx: transactions[3]})
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
                        <Redirect to='/main'/>
                    ) : (
                        null
                    )}

                    <Route
                        path='/start'
                        component={() => <StartWindow
                            connection={this.state.connection}
                            walletStatus={this.state.walletStatus}
                            redirectToMain={this.state.redirectToMain}
                        />
                        }
                    />
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

