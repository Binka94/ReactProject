import React from 'react';
import { Redirect } from 'react-router-dom';

import AuthenticationService  from '../../services/authentication-service';
import WithAuthentication from '../../hocs/with-user-authentication';
import { 
    defaultAuthenticationContext 
} from '../../components/contexts/authentication-context';

class Logout extends React.Component {
    constructor(props){
        super(props);

        this.AuthenticationService = new AuthenticationService();
    }

    async componentDidMount() {
        const result = await this.AuthenticationService.logout();           
        
        if(result.debug) {
            console.log(result.debug);
            return;
        }

        if(result.error) {
            console.log(result.error);
            console.log(result.description);
            return;
        }

        window.localStorage.removeItem('userId');
        window.localStorage.removeItem('username');
        window.localStorage.removeItem('authtoken');
        window.localStorage.removeItem('isAdmin');

        this.props.updateUser(defaultAuthenticationContext);        
    }
    
    render() {
        return (<Redirect to="/" />);        
    }
}

export default WithAuthentication(Logout);