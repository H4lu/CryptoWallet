import React, {PureComponent} from 'react';
import {
    AreaChart, Area, XAxis, YAxis,
} from 'recharts';



export default class Chart extends React.PureComponent<any, any> {

    constructor(props: any) {
        super(props)

    }



    render() {
        return (
            <AreaChart className='classChart' width={395} height={260} data={this.props.chartBTC}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#cccccc" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#cccccc" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" opacity={0.5}/>
                <YAxis opacity={0.5}/>
                <Area type="monotone" dataKey="pv" stroke="#bfbfbf" fillOpacity={1} fill="url(#colorUv)"/>
            </AreaChart>
        );
    }
}