import React, {Component} from 'react'
import createQR from "../../core/createQR";
import {clipboard, shell} from 'electron'
import {Link} from "react-router-dom";

interface BtcReceiveState {
    qrcodeAddress: string
}

interface BtcReceiveProps {
    address: string,
    stateSR: (arg: boolean) => void
}

// TODO: reuse for ltc and others
export class BtcRecieveWindow extends Component<BtcReceiveProps, BtcReceiveState> {
    constructor(props: any) {
        super(props)

        this.handleCopyClick = this.handleCopyClick.bind(this)
        this.openUrl = this.openUrl.bind(this)

        this.props.stateSR(true)
        this.state = {
            qrcodeAddress: '',
        }
    }

    componentWillMount() {
        this.setState({qrcodeAddress: createQR(this.props.address)})
    }


    handleCopyClick() {
        clipboard.writeText(this.props.address)
    }

    openUrl() {
        shell.openExternal('https://live.blockcypher.com/btc/address/' + this.props.address)
    }

    render() {
        return (
            <div className='main'>
                <div className='rectangleSR'>
                    <div className='iconCryptoCurrencyBTC'/>
                    <img src={this.state.qrcodeAddress} className='address-qrcode'/>
                    <div className='YOURB_0ITCOIN_ADDRESS'>YOUR BITCOIN ADDRESS</div>
                    <div className='YOURB_0ITCOIN_ADDRESS_crypto'>{this.props.address}</div>
                    <div className='flex_button_recieve'>
                        <button className='copy_to_buffer' onClick={this.handleCopyClick}/>
                        <button className='sent_to_print'/>
                        <button className='sent_to_email'/>
                        <button className='view_on_blockchain' onClick={this.openUrl}/>
                    </div>
                    <Link to={'/currency-carousel'}>
                        <div className='button-cancel-ricieve'/>
                    </Link>
                </div>
            </div>
        )
    }
}