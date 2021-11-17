import {fromDecimal, numberToHex, toWei, toHex} from "web3-utils";
import {BN} from 'ethereumjs-util'
import {ECPair, networks} from 'bitcoinjs-lib'
import {getTestnetAddressBTC} from "../src/api/cryptocurrencyApi/utils";

describe("Test bn conversion", () => {
    it("should convert", () => {
        const num = 0.0001
        console.log( num > 1e21)
        console.log(Number.isSafeInteger(num))
        const v = toHex(num.toString())
        console.log(v)
    })
    it("check conversion", () => {
        const key = "04944fa3b7eb80dbba03d6420f4755f732b2712eb47163ea63f19244d1c9dd6896e63a99a85dad16aae07e4d588c72f00c337127af420a95a7ec6380a2776abdae"
        const keyBuffer = Buffer.from(key, "hex")
        console.log("pubkey buffer: ", keyBuffer.toString("hex"))
        const keyPair = ECPair.fromPublicKeyBuffer(keyBuffer, networks.testnet)
        console.log(keyPair.getAddress())
        const testAddr = getTestnetAddressBTC(keyBuffer)
        console.log("addr: ", testAddr)
    })
})