import React, {Component} from 'react'

export class SidebarLeftBlur extends Component<any, any> {
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