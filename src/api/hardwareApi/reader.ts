// @ts-ignore
let reader

export {reader}

// @ts-ignore
export function setReader(readerObject) {
    reader = readerObject
}

export function connectToReader(): Promise<number> {

    return new Promise((resolve, reject) => {
        // @ts-ignore
        reader.connect({share_mode: reader.SCARD_SHARE_SHARED}, (err, protocol) => {
            if (err) {
                reject(new Error(err))
            } else {
                resolve(protocol)
            }
        })
    })
}

export function disconnectFromReader() {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        reader.disconnect(reader.SCARD_LEAVE_CARD, (err) => {
            if (err) {
                reject(new Error(err))
            } else {
                resolve('success')
            }
        })
    })

}
