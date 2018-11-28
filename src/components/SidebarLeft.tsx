import * as React from 'react'
import {Link} from "react-router-dom";

export class SidebarLeft extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.handleUpdateDataClick = this.handleUpdateDataClick.bind(this)
    }

    handleUpdateDataClick() {
        this.props.refresh()
    }

    render() {
        return (
            <div className='sidebar-Left'>
                <div className='nav-buttons-Left'>
                    <Link to='/main' className='but_home'/>

                    {/* <Link to={this.props.pathState} className = 'but_pay'/>*/}
                    <Link to='/currency-carousel' className='but_pay'/>

                    <Link to='/history-carousel' className='but_history'/>

                    <button className='but_exchange'/>

                    <button className='but_info'/>

                    <button className='but_menu'/>
                </div>
            </div>
        )
    }
}