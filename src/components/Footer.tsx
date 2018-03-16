import * as React from 'react'

export class Footer extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
    <div className = 'footer'>
      <div className = 'footer-content'>
        <p className = 'version'>Version 1.1</p>
        {(this.props.connection) ? (
          <p className = 'status'>Status:<span className = 'footer-connected'> Connected</span></p>
        ) : (
          <p className = 'status'>Status:<span className = 'footer-not-connected'> Not Connected</span></p>
        )}
      </div>
    </div>
    )
  }
}
