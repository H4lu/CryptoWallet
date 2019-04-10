import React from 'react'
import {TableRow} from './TableRow'

interface ITableClass {
    dataToRender: Array<any>
}

interface ITableProps {
    data: Array<Object>,
    type: string,
    activeCurrency: string
}

export class Table extends React.Component<ITableProps, ITableClass> {
    constructor(props: any) {
        super(props)

        this.state = {
            dataToRender: []
        }

    }

    render() {
        console.log("rerender table")
        let tableType = (this.props.type === 'normal') ? 'transaction-history' : 'transaction-history-small'
        return (
            <div className={tableType}>
                <table>

                    <tbody>
                       {this.props.data.map((element: any) => {
                        return <TableRow data={element} activeCurrency={this.props.activeCurrency}/>
                    })}

                    </tbody>
                </table>
            </div>
        )
    }
}
