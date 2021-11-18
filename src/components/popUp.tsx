import React from 'react'

export class PopUp extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    render() {
        return (
            <div className='popup'>
                <div className='popup-inner'>
                    <div>
                        <p className='popup-header'>You have a pending transaction.</p>
                        <p className='popup-text'>Are you sure you want to leave this screen?</p>
                        <p className='popup-text'>The entered data will not be saved.</p>
                    </div>
                    <hr/>
                    <div className='popup-button-container'>
                        <button type='submit' className='popup-button'>Cancel</button>
                        <button type='submit' className='popup-button'>Yes, Leave Screen</button>
                    </div>
                </div>
            </div>
        )
    }
}
