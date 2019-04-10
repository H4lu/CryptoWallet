
import * as React from "react";

export class ModeWindow extends React.Component<any, any> {
    classFee1: string;
    classFee2: string;
    classFee3: string;

    constructor(props: any) {
        super(props)

        this.changeFee1 = this.changeFee1.bind(this)
        this.changeFee2 = this.changeFee2.bind(this)
        this.changeFee3 = this.changeFee3.bind(this)
       // this.setClass1 = this.setClass1.bind(this)
       // this.setClass2 = this.setClass2.bind(this)
       // this.setClass3 = this.setClass3.bind(this)
       // this.setClass = this.setClass.bind(this)


        this.classFee1 = this.setClass1()
        this.classFee2 = this.setClass2()
        this.classFee3 = this.setClass3()
    }

    changeFee1() {
        this.props.setFee(1)
        this.setClass()
    }

    changeFee2() {
        this.props.setFee(2)
        this.setClass()
    }

    changeFee3() {
        this.props.setFee(3)
        this.setClass()
    }

    setClass1(): string
    {
        if(this.props.trFee === 1){
            return 'clickFee1'
        }else{
            return 'Fee1'
        }
    }
    setClass2(): string
    {
        if(this.props.trFee === 2){
            return 'clickFee2'
        }else{
            return 'Fee2'
        }
    }
    setClass3(): string
    {
        if(this.props.trFee === 3){
            return 'clickFee3'
        }else{
            return 'Fee3'
        }
    }

    setClass(){
        this.classFee1 = this.setClass1()
        this.classFee2 = this.setClass2()
        this.classFee3 = this.setClass3()
    }


    render() {
        return (
            <div className='main'>
                <div className='rectangleSR'>
                    <div className='setFee'></div>
                    <button className={this.classFee1} onClick={this.changeFee1}>Lower fee</button>
                    <button className={this.classFee2} onClick={this.changeFee2}>Typical fee</button>
                    <button className={this.classFee3} onClick={this.changeFee3}>Higher fee</button>
                </div>
            </div>
        )
    }
}