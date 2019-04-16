import React from 'react';
import Main from 'Pages/Main';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import awsmobile from './aws-export';
Amplify.configure(awsmobile);

const App = props => (
        <div>
        	<Main/>
        </div>
);

export default withAuthenticator(App, true);
