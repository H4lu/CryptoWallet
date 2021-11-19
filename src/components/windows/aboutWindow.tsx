import React, {FC} from 'react'

export const AboutWindow: FC = () => {
    return(
        <div className={"backgroundAbout"}>
            <div className={"aboutIcon"}/>
            <p style={{marginTop: "7px"}}>About</p>
            <p style={{fontSize: "23px", color: "rgba(255, 255, 255, 1)", fontWeight: "normal", lineHeight: "28px", marginTop: "-10px"}}>
                Product Crypto Wallet
            </p>
            <p style={{color: "rgba(255, 255, 255, 0.85)", fontSize: "15px", lineHeight: "18px", marginTop: "-15px"}}>
                Version: 1.1.9
            </p>
            <p style={{lineHeight: "14px", fontSize: "12px", color: "rgba(222, 222, 222, 0.75)", marginTop: "30px"}}>
                (c) Copyright Brightberry, 2021
            </p>
            <p style={{lineHeight: "14px", fontSize: "12px", color: "rgba(222, 222, 222, 0.75)", marginTop: "-10px"}}>
                All rights reserved
            </p>
        </div>
    )
}

