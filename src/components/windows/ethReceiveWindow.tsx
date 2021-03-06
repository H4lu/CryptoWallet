import React, {Component} from 'react'
import createQR from "../../core/createQR";
import { getEthereumAddress } from '../../api/cryptocurrencyApi/ethereum'
import {clipboard, shell} from 'electron'
import {Link} from "react-router-dom";

interface IETHRecieveState {
    address: string,
    qrcodeAddress: string,

}

export class EthRecieveWindow extends Component<any, IETHRecieveState> {
    constructor(props: any) {
        super(props)

        this.handleCopyClick = this.handleCopyClick.bind(this)
        this.openUrl = this.openUrl.bind(this)

        this.props.stateSR(true)
        this.state = {
            address: getEthereumAddress().toLowerCase(),
            qrcodeAddress: '',
        }
    }

    componentWillMount() {
        this.setState({qrcodeAddress: createQR(this.state.address)})
        console.log('PROPERTY: ' + this.props.lastTx)
    }


    handleCopyClick() {
        clipboard.writeText(this.state.address)
    }

    openUrl() {
        shell.openExternal('https://etherscan.io/address/' + this.state.address)
    }


    render() {
        return (
            <div className='main'>
                <div className='rectangleSR'>
                    <div className='iconCryptoCurrencyETH'/>
                    <img src={this.state.qrcodeAddress} className='address-qrcode'/>
                    <div className='YOURB_0ITCOIN_ADDRESS'>YOUR ETHEREUM ADDRESS</div>
                    <div className='YOURB_0ITCOIN_ADDRESS_crypto'>{this.state.address}</div>
                    <div className='flex_button_recieve'>
                        <button className='copy_to_buffer' onClick={this.handleCopyClick}/>
                        <button className='sent_to_print'/>
                        <button className='sent_to_email'/>
                        <button className='view_on_blockchain' onClick={this.openUrl}/>
                    </div>
                    <Link to = '/currency-carousel'>
                        <div className='button-cancel-ricieve'/>
                    </Link>
                </div>
            </div>
        )
    }
}