import React, {FC} from 'react'
import { ipcRenderer } from 'electron'

export const Header: FC = () => {
  const closeWindow = () => {
    ipcRenderer.send('close',[])
  }
  
  const hideWindow = () => {
    ipcRenderer.send('hide',[])
  }

   return (
     <div className = 'header'>
       <div className = 'header-content'>
         <div className = 'title-bar-buttons'>
            <button className = 'button-hide' onClick = {hideWindow}/>
           <button className = 'button-close' onClick = {closeWindow}/>
         </div>
       </div>
     </div>
     )
}
