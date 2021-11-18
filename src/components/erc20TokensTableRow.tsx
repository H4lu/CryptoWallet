import React, {FC} from 'react'
import {Erc20DisplayToken} from "../api/cryptocurrencyApi/utils";


interface Erc20TokesTableRowProps {
    data: Erc20DisplayToken
}

export const Erc20tokesTableRow: FC<Erc20TokesTableRowProps> = (props) =>
    <tr>
        <td>{props.data.name}</td>
        <td>{props.data.address}</td>
        <td>{props.data.amount}</td>
    </tr>
