import * as React from 'react'
import {Link} from "react-router-dom";
export class SidebarLeftBlur extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

    }

    render() {
        return (
            <div className = 'sidebar-Left-blur'>
                <div className = 'nav-buttons-Left'>
                    <div className = 'but_home'/>
                    <div className = 'but_pay'/>

                    <div className = 'but_refresh'/>

                    <div className = 'but_exchange'/>

                    <div className = 'but_info'/>

                    <div className = 'but_menu'/>
                </div>
            </div>
        )
    }
}