// @ts-nocheck
var React = require('react');
var ReactDOM = require('react-dom');
var Coverflow = require('react-coverflow');

var fn = function () {
    /* do you want */
}

ReactDOM.render(
    <Coverflow
        width={960}
        height={480}
        displayQuantityOfSide={2}
        navigation={false}
        enableHeading={false}
        infiniteScroll
    >
        <div
            onClick={() => fn()}
            onKeyDown={() => fn()}
            role="menuitem"
        >
            <img
                src='/static/icon__BTC.svg'
                style={{ display: 'block', width: '100%' }}
            />
        </div>
        <img src='/static/icon__BTC.svg'/>
        <img src='/static/icon__LTC.svg'/>
        <img src='/static/icon__ETH.svg'/>
        <img src='/static/icon__XRP.svg'/>
    </Coverflow>
);