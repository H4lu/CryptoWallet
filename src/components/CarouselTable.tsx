import * as React from 'react'
import {Link} from "react-router-dom";

export class CarouselTable extends React.Component<any, any> {
    currencyName:string
    pathSend: string
    pathRecive: string
    direct: number

    constructor(props: any) {
        super(props)

        this.direct = 0

        this.state = {
            activeCurrency:this.props.activeCurrency,
            classNameAll: 'AlldirectHistory_a',
            classNameSend: 'SenddirectHistory_p',
            classNameReceive: 'ReceivedirectHistory_p'
        }

        this.updateProps = this.updateProps.bind(this)
        this.allDirect = this.allDirect.bind(this)
        this.sendDirect = this.sendDirect.bind(this)
        this.receiveDirect = this.receiveDirect.bind(this)
        this.choeceDirect = this.choeceDirect.bind(this)
    }
    updateProps(){
        switch(this.props.activeCurrency) {
            case 1: {
                this.currencyName = 'Bitcoin'
                this.pathSend = '/btc-window-send'
                this.pathRecive = '/btc-window-recieve'
                break
            }
            case 2: {
                this.currencyName = 'Etereum'
                this.pathSend = '/eth-window-send'
                this.pathRecive = '/eth-window-recieve'
                break
            }
            case 3: {
                this.currencyName = 'Litecoin'
                this.pathSend = '/ltc-window-send'
                this.pathRecive = '/ltc-window-recieve'
                break
            }
            case 4: {
                this.currencyName = 'Ripple'
                this.pathSend = '/xrp-window-send'
                this.pathRecive = '/xrp-window-recieve'
                break
            }
        }

    }

    allDirect(){
        this.direct = 0
        this.choeceDirect()
    }
    sendDirect(){
        this.direct = -1
        this.choeceDirect()
    }
    receiveDirect(){
        this.direct = 1
        this.choeceDirect()
    }

    choeceDirect(){
        switch (this.direct) {
            case -1:{
                this.setState({classNameAll:'AlldirectHistory_p'})
                this.setState({classNameSend:'SenddirectHistory_a'})
                this.setState({classNameReceive:'ReceivedirectHistory_p'})
                break
            }
            case 1:{
                this.setState({classNameAll:'AlldirectHistory_p'})
                this.setState({classNameSend:'SenddirectHistory_p'})
                this.setState({classNameReceive:'ReceivedirectHistory_a'})
                break
            }
            case 0:{
                this.setState({classNameAll:'AlldirectHistory_a'})
                this.setState({classNameSend:'SenddirectHistory_p'})
                this.setState({classNameReceive:'ReceivedirectHistory_p'})
                break
            }
        }
    }

    render() {
        return (
            <div>
                {this.updateProps()}
                {this.choeceDirect()}
                <p className='currencyNameHistory'>{this.currencyName}</p>
                <div className='buttonHistoryFlex'>
                    <button className={this.state.classNameAll} onClick={this.allDirect}>All</button>
                    <button className={this.state.classNameSend} onClick={this.sendDirect}>Send</button>
                    <button className={this.state.classNameReceive} onClick={this.receiveDirect}>Receive</button>
                    <button className='AlldirectHistoryUpdate' onClick={this.allDirect}/>
                </div>
                <div className='line_graph'/>

                <div className='blockButtonSendRecieve'>
                    <Link to={this.pathSend}>
                        <button className='sendCurrencybutton'/>
                    </Link>
                    <Link to={this.pathRecive}>
                        <button className='recieveCurrencybutton'/>
                    </Link>
                </div>
            </div>
        )
    }
}