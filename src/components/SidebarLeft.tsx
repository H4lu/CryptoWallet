import React, {FunctionComponent} from 'react'
import {Link} from "react-router-dom";

export const SidebarLeft: FunctionComponent<{}> = () => 
<div className='sidebar-Left'>
    <div className='nav-buttons-Left'>
        <Link to='/main' className='but_home'/>
        <Link to='/currency-carousel' className='but_pay'/>
        <Link to='/history-carousel' className='but_history'/>
        <Link to="#" className='but_erc20"'/>
        <Link to="#" className='but_cpu'/>
        <Link to="#" className='but_exchange'/>
        <Link to="#" className='but_info'/>
        <Link to='/mode-window' className='but_menu'/>
    </div> 
</div>
