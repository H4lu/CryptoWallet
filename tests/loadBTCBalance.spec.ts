import { setMyAddress, getBTCBalance } from '../src/API/cryptocurrencyAPI/BitCoin'

describe('BTC balance req',() => {
    before(() => {
        const BTCAddress: string = '1EWxZ6PKEojn9UsNQtZXPPMR8fiwLRxMh6';
        setMyAddress(BTCAddress);
    });
    it ('should return btc balance', async () => {
        const btcBalance = await getBTCBalance();
    })
})