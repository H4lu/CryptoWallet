import mocha from "mocha";
import {fromDecimal, numberToHex, toWei, toHex} from "web3-utils";
import {BN} from 'ethereumjs-util'

describe("Test bn conversion", () => {
    it("should convert", () => {
        const num = 0.0001
        console.log( num > 1e21)
        console.log(Number.isSafeInteger(num))
        const v = toHex(num.toString())
        console.log(v)
    })
})