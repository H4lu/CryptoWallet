import React, {FC} from 'react';
import {Erc20tokesTableRow} from "./erc20TokensTableRow"
import {Erc20DisplayToken} from "../api/cryptocurrencyApi/utils";

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
