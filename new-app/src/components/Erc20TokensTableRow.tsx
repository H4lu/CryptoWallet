import React, {FunctionComponent} from 'react'
import { Erc20DisplayToken } from '../API/cryptocurrencyAPI/erc20';

interface Erc20TokesTableRowProps {
    data: Erc20DisplayToken
}

export const Erc20tokesTableRow: FunctionComponent<Erc20TokesTableRowProps> = (props: Erc20TokesTableRowProps) =>
    <tr>
        <td>{props.data.name}</td>
        <td>{props.data.address}</td>
        <td>{props.data.amount}</td>
    </tr> 
    