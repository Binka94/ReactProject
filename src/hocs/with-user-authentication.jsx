import React from 'react';
import { AuthenticationConsumer } from '../components/contexts/authentication-context';

function WithAuthentication(Component) {
    return (props) => (
        <AuthenticationConsumer>
            {
                (data) => (<Component {...data} {...props}/>)
            }
        </AuthenticationConsumer>
    );
}

export default WithAuthentication;