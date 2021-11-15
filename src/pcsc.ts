import pcsclite from "@pokusew/pcsclite";
import { getInfoPCSC } from "./api/hardwareApi/getWalletInfo";
import {setReader} from "./api/hardwareApi/reader";
const PSCS_MANAGER_NOT_RUGGING_ERROR = "(0x8010001d)";


let pcsc = undefined;

const startWalletInfoPing = () => {
    let interval = setInterval(async () => {
        try {
            const data = await getInfoPCSC()
            console.log('GOT THIS DATA', data)
            switch (data) {
                case 0: {
                    clearInterval(interval)
                    console.log('SETTING WALLET STATUS 0')

                    //await this.initAll()
                    process.send({walletStatus: 0})
                   // this.setState({walletStatus: 0})
                    break
                }
                case 1: {
                    process.send({walletStatus: 1})
                    //this.setState({walletStatus: 1})
                    break
                }
                case 2: {
                    process.send({walletStatus: 2})
                   // this.setState({walletStatus: 2})
                    break
                }
                case 3: {
                    process.send({walletStatus: 3})
                   // this.setState({walletStatus: 3})
                    break
                }
                case 4: {
                    process.send({walletStatus: 4})
                    //this.setState({walletStatus: 4})
                    break
                }
            }
        } catch (error) {
            console.log('GOT ERROR', error)
            clearInterval(interval)
        }
    }, 500, [])
};

const onReaderCallback = async (reader) {
    setReader(reader)
    reader.on('status', status => {
        const changes = reader.state ^ status.state
        if ((changes & reader.SCARD_STATE_PRESENT) && (status.state & reader.SCARD_STATE_PRESENT)) {
            reader.connect({
                    share_mode: reader.SCARD_SHARE_SHARED,
                    protocol: reader.SCARD_PROTOCOL_T1
            }, async (err, _) => {
                if (err) {
                    process.send(err)
                    console.error(err)
                   // remote.dialog.showErrorBox("PCSC error", err.message)
                } else {
                    console.log("start wallet info")
                    process.send({connected: true})
                    startWalletInfoPing()
                    // this.setState({connection: true})
                    // this.startWalletInfoPing()
                }
        })
    }
    })

    reader.on('error', err => {
        console.log('Error', err.message)
    })
    reader.on('end', () => {
        console.log('Reader', reader.name, 'removed')
        process.send({connected: false})
        //this.setState({connection: false})
    })
};

const onErrorCallback = async (err) {
    console.log('PCSC error', err.message)
  
    const errMessage = String(err.message)
    const errLines = errMessage.split('\n')
    if (errLines.length > 1) {
        const code = errLines[1]
        // just reinit pcsc in case of manager not running error(usually appears during timeout)
        if (code == PSCS_MANAGER_NOT_RUGGING_ERROR) {
            pcsc.removeAllListeners()
            pcsc = pcsclite()
            pcsc.on('reader', onReaderCallback)
            pcsc.on('error', onErrorCallback)
            return
        }
    }
};

const start = async () => {
    pcsc = pcsclite();
    pcsc.on("reader", onReaderCallback);
    pcsc.on("error", onErrorCallback);
};

start();
