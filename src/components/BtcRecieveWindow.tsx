import * as React from 'react'
import getBitcoinAddress from "../API/cryptocurrencyAPI/BitCoin";

interface IBTCRecieveState {
    address: string,
    qrcodeAddress: string,

}

export class BtcRecieveWindow extends React.Component<any, IBTCRecieveState> {
    constructor(props: any) {
        super(props)
        this.state = {
            address: getBitcoinAddress(),
            qrcodeAddress: '',
        }
    }

    render() {
        return (
            <div className='main'>
                <div className='rectangleSR'>
                    <div className='iconCryptoCurrency'/>
                </div>
            </div>
        )
    }
}