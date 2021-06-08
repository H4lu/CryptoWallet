import { DisplayTransactionCurrency } from "../API/cryptocurrencyAPI/utils";

export enum CarouselCurrencyIndex {
    BTC = 0,
    ETH = 1,
    LTC = 2,
    XRP = 3
}

// TODO: implement other currencies and use activeCurrency from props in carousel components
export const currencyToIndex = (currency: DisplayTransactionCurrency): CarouselCurrencyIndex => {
    switch (currency) {
        case "BTC": return CarouselCurrencyIndex.BTC;
        case "ETH": return CarouselCurrencyIndex.ETH;
        case "LTC": return CarouselCurrencyIndex.LTC;
        case "XRP": return CarouselCurrencyIndex.XRP;
        default: return CarouselCurrencyIndex.BTC;
    }
}
