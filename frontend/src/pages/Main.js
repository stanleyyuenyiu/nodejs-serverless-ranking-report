import React from 'react';
import ListContainer from 'Components/Report/ListContainer';
import Control from 'Components/Report/Control';

const Main = props => {
    return (
        <div>
            <div className="app-header"><h1>Simple Ranking Table</h1></div>
            <div className="container">
            	<Control/>
            	<ListContainer/>
            </div>
        </div>
    );
};


export default Main;

