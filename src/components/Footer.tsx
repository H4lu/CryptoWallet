import * as React from 'react'

export class Footer extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
    <div className = 'footer'>
    <div className = 'footer-content'>
      <p className = 'status'>Status:<span className = 'footer-status-span'> OK</span></p>
      <p className = 'version'>Version 1.1</p>
    </div>
  </div>
   )
  }
}