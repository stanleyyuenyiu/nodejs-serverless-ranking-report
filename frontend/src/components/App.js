import React from 'react';
import Main from 'Pages/Main';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import awsmobile from './aws-export';
import { spinnerService, SpinnerComponent as Spinner } from 'Components/Common/Spinner';
Amplify.configure(awsmobile);

const App = props => (
        <div>
        	<Spinner name="mainSpinner" group="main">
                      <div className="spinner-container">
                        <div>
                            <div className="spinner">
                                <div className="spinner-loader">
                                    <div className="rect1"></div>
                                    <div className="rect2"></div>
                                    <div className="rect3"></div>
                                    <div className="rect4"></div>
                                    <div className="rect5"></div>
                                </div>
                            </div>
                        </div>
                      </div>
            </Spinner>
        	<Main/>
        </div>
);

export default withAuthenticator(App, true);
