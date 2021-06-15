import axios from 'axios'

const requestURL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'

export interface CoinmarketCapStatus {
    timestamp: Date,
    error_code: number,
    error_message: string,
    elapsed: number,
    credit_count: number
}

export interface CoinmarketCapListingQuote {
    price: number,
    volume_24h: number,
    percent_change_1h: number,
    percent_change_24h: number,
    percent_change_7d: number,
    market_cap: number,
    last_updated: string

}

export type ListingQuotes = {
    [key: string]: CoinmarketCapListingQuote
}
export interface CoinmarketCapListingItem {
    id: number,
    name: string,
    symbol: string,
    slug: string,
    cmc_rank: number,
    num_market_pairs: number,
    circulating_supply: number,
    total_supply: number,
    max_supply: number,
    last_updated: Date,
    date_added: Date,
    tags: Array<string>,
    platfrom?: string,
    quote: ListingQuotes
}

export interface CoinmarketCapListringResponse {
    data: Array<CoinmarketCapListingItem>,
    status: CoinmarketCapStatus
}

export async function getCurrencyRate(): Promise<CoinmarketCapListringResponse> {
    const response = await axios.get(requestURL, {
        headers: {
            'X-CMC_PRO_API_KEY': '3a1e2713-dedf-4ac1-80e4-ae983b275f9f'
        }
    })
    return response.data
}
