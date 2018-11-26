import * as React from 'react'
import getBitcoinAddress from "../API/cryptocurrencyAPI/BitCoin";
import CreateQR from "../core/CreateQR";
import {Link} from "react-router-dom";
import {shell} from 'electron'

interface IBTCRecieveState {
    address: string,
    qrcodeAddress: string,

}

export class BtcRecieveWindow extends React.Component<any, IBTCRecieveState> {
    constructor(props: any) {
        super(props)

        this.props.stateSR(true)
        this.state = {
            address: /*getBitcoinAddress()*/'1NeJEFzY8PbVS9RvYPfDP93iqXxHjav791',
            qrcodeAddress: '',
        }
       this.openUrl = this.openUrl.bind(this)
    }

    componentWillMount() {
        this.setState({qrcodeAddress: CreateQR(this.state.address)})
        // this.props.transactions()
        console.log('PROPERTY: ' + this.props.lastTx)
    }



openUrl(){
    shell.openExternal('https://www.blockchain.com/btc/address/' + this.state.address)
}

    render() {
        return (
            <div className='main'>
                <div className='rectangleSR'>
                    <div className='iconCryptoCurrency'/>
                    <img src={this.state.qrcodeAddress} className='address-qrcode'/>
                    <div className='YOURB_0ITCOIN_ADDRESS'>YOUR BITCOIN ADDRESS</div>
                    <div className='YOURB_0ITCOIN_ADDRESS_crypto'>{this.state.address}</div>
                    <div className='flex_button_recieve'>
                        <button className='copy_to_buffer'/>
                        <button className='sent_to_print'/>
                        <button className='sent_to_email'/>
                        <button className='view_on_blockchain' onClick={this.openUrl}/>
                    </div>
                </div>
            </div>
        )
    }
}