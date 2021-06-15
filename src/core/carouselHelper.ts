import { DisplayTransactionCurrency } from "../api/cryptocurrencyApi/utils";

export enum CarouselCurrencyIndex {
    BTC = 0,
    ETH = 1,
    LTC = 2,
    XRP = 3,
    BCH = 4,
    DOGE = 5,
    XCH = 6,
    MNR = 7
}

// TODO: implement other currencies and use activeCurrency from props in carousel components
export const currencyToIndex = (currency: DisplayTransactionCurrency): CarouselCurrencyIndex => {
    switch (currency) {
        case "BTC": return CarouselCurrencyIndex.BTC;
        case "ETH": return CarouselCurrencyIndex.ETH;
        case "LTC": return CarouselCurrencyIndex.LTC;
        case "XRP": return CarouselCurrencyIndex.XRP;
        case "BCH": return CarouselCurrencyIndex.BCH;
        case "DOGE": return CarouselCurrencyIndex.DOGE;
        case "XCH": return CarouselCurrencyIndex.XCH;
        case "MNR": return CarouselCurrencyIndex.MNR
        default: return CarouselCurrencyIndex.BTC;
    }
}
