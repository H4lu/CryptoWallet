import React, {Component} from 'react'
// import {Link} from 'react-router-dom'
import { REFRESH_BUTTON_PATH, BTN_MENU_PATH } from '../core/paths'
export class SidebarContent extends Component<any, any> {
  constructor(props: any) {
    super(props)

    this.handleUpdateDataClick = this.handleUpdateDataClick.bind(this)
  }
  handleUpdateDataClick() {
    this.props.refresh()
  }
  render() {
    return (
      <div className = 'sidebar'>
        <div className = 'sidebar-content'>
          <div className='headerSidebar'>
            <div className='headerSidebarFlex'>
                <div className='Notifications'>Notifications</div>
                <div className='NotificationsNumber'/>
                <div className='CloseNotifications'>Close all</div>
            </div>
          </div>
            <div className='notificationContent'/>
        </div>
    </div>
    )
  }
}
