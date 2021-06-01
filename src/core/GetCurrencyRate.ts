import axios from 'axios'
import { info } from 'electron-log'

const requestURL = 'https://api.coinmarketcap.com/v1/ticker/'

export default async function getCurrencyRate() {
    try {
        const response = await axios.get(requestURL)
        return response.data
    } catch (error) {
        info(error)
    }
}
