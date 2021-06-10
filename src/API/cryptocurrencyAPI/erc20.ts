import axios from 'axios';

const testTokensList = [

]

const mainTokensList = [

]

export interface Erc20DisplayToken {
    name: string,
    address: string,
    amount: number
}

export let tokens: Array<Erc20DisplayToken> = []

export const getTokensBalance = (
    address: string,
    tokensList: Array<string>
    ) => {

    }