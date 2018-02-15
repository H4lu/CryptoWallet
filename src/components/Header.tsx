import * as React from 'react'

export class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
    <div className = 'header'>
      <div className = 'header-content'>
        <header>Braitberry</header>
      </div>
    </div>)
  }

}