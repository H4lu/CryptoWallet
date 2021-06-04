import React, {FunctionComponent} from "react"
import { Erc20DisplayToken } from "../API/cryptocurrencyAPI/erc20"
import { Erc20TokensTable } from "./Erc20TokensTable"


interface Erc20TokensTableProps {
    data: Array<Erc20DisplayToken>
}

export const ERC20Window: FunctionComponent<Erc20TokensTableProps> = (props: Erc20TokensTableProps) => 
    <div className = "backgroundERC20">
        <div className = "iconEthErc20"/>
        <p className = "erc20Text">ERC-20</p>
        <Erc20TokensTable data={props.data}/>
    </div>     
    