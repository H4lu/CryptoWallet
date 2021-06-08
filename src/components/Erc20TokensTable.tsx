import React, {FC} from 'react';
import { Erc20DisplayToken } from '../API/cryptocurrencyAPI/erc20';
import {Erc20tokesTableRow} from "./Erc20TokensTableRow"

interface Erc20TableProps {
    data: Array<Erc20DisplayToken>
}

export const Erc20TokensTable: FC<Erc20TableProps> = (props) => 
    <div className="erc20Table">
        <table >
            <thead >
                <tr >
                    <th>Name</th>
                    <th>Address</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <hr/>
            <tbody>
                {
                    props.data
                        .map(element => <Erc20tokesTableRow data={element}/>)
                }
            </tbody>
        </table>
    </div>
