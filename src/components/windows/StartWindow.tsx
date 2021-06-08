import React, {FC, useEffect} from 'react'
import { Redirect } from 'react-router'

interface StartWindowProps {
  walletStatus: number,
  redirectToMain: boolean,
  connection: boolean
}

const renderWalletState = (walletStatus: number) => {
  switch (walletStatus) {
  case 0: {
    return <p className = 'window-main-ready'>Your Crypto Wallet is ready for use</p>
  }
  case 1: {
    return <p className = 'window-main-not-ready'>Don`t contain SIM</p>
  }
  case 2: {
      return <p className = 'window-main-not-ready'><p className='two_line_1'>Please enter</p><p className='two_line_2'>Pin code</p></p>
  }
  case 3: {
    return <p className = 'window-main-not-ready'>Not initialized</p>
  }
  case 4: {
    return <p className = 'window-main-not-ready'>SIM blocked</p>
  }
  }
} 


export const StartWindow: FC<StartWindowProps> = (props) => {
  if (props.redirectToMain) {
    return <Redirect from = '/' to = '/main'/>
  }

  return (
    <div className = 'background-start'>
        {(props.connection) ? (
            renderWalletState(props.walletStatus)
        ) : (
            <p className = 'window-main-not-ready'>Please connect Runer</p>
        )}
    </div>
  )
}
//   constructor(props: any) {
//     super(props)
    
//     this.renderWalletState = this.renderWalletState.bind(this)
//   }
  

//   render() {
//     if (this.props.redirectToMain) {
//       console.log("REDIRECT")
//       return <Redirect from = '/' to = '/main'/>
//     }

   
//   }
// }
