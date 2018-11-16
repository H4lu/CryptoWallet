import * as React from 'react'
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
            <div className = 'sidebar-Left'>
                    <div className = 'nav-buttons-Left'>
                        <button className = 'but_home'/>
                        <button className = 'but_pay'/>
                        <button className = 'but_refresh'/>
                        <button className = 'but_exchange'/>
                        <button className = 'but_info'/>
                        <button className = 'but_menu'/>
                    </div>
            </div>
        )
    }
}