import * as React from 'react'
import CreateQR from "../core/CreateQR";
/*import getRippleAddress from "../API/cryptocurrencyAPI/Ripple";*/
import {clipboard, shell} from 'electron'
import {Link} from "react-router-dom";
import getRippleAddress from "../API/cryptocurrencyAPI/Ripple";

interface IXRPRecieveState {
    address: string,
    qrcodeAddress: string,

}

export class XrpRecieveWindow extends React.Component<any, IXRPRecieveState> {
    constructor(props: any) {
        super(props)

        this.handleCopyClick = this.handleCopyClick.bind(this)
        this.openUrl = this.openUrl.bind(this)

        this.props.stateSR(true)
        this.state = {
            address: getRippleAddress(),
            qrcodeAddress: '',
        }
    }

    componentWillMount() {
        this.setState({qrcodeAddress: CreateQR(this.state.address)})
        console.log('PROPERTY: ' + this.props.lastTx)
    }


    handleCopyClick() {
        clipboard.writeText(this.state.address)
    }

    openUrl() {
        shell.openExternal('https://bithomp.com/explorer/' + this.state.address)
    }


    render() {
        return (
            <div className='main'>
                <div className='rectangleSR'>
                    <div className='iconCryptoCurrencyXRP'/>
                    <img src={this.state.qrcodeAddress} className='address-qrcode'/>
                    <div className='YOURB_0ITCOIN_ADDRESS'>YOUR RIPPLE ADDRESS</div>
                    <div className='YOURB_0ITCOIN_ADDRESS_crypto'>{this.state.address}</div>
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