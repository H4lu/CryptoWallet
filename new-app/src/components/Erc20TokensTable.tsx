import React, {FunctionComponent} from 'react';
import { Erc20DisplayToken } from '../API/cryptocurrencyAPI/erc20';
import {Erc20tokesTableRow} from "./Erc20TokensTableRow"

interface Erc20TableProps {
    data: Array<Erc20DisplayToken>
}

export const Erc20TokensTable: FunctionComponent<Erc20TableProps> = (props: Erc20TableProps) => 
    <div className="transaction-history">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.data
                        .map(element => <Erc20tokesTableRow data={element}/>)
                }
            </tbody>
        </table>
    </div>