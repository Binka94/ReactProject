import React from 'react';
//import { Redirect } from 'react-router-dom';

import Input from '../../components/form/input';
import Loading from '../../components/common/loading';

import AuthenticationService  from '../../services/authentication-service';
import WithAuthentication from '../../hocs/with-user-authentication';

import {userLoginModel} from '../../models/user-login-model';
import notify from '../../util/notification';

class Login extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            user: userLoginModel.defaultState,
            isLoading: false,
        };

        this.AuthenticationService = new AuthenticationService();

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }
    componentDidMount() {
        window.M.updateTextFields();
    }

    onChangeHandler(event) {
        event.preventDefault();
        event.stopPropagation();

        const name = event.target.name;
        
        if(this.state.user.hasOwnProperty(name)) {            
            const value = event.target.value;

            const user = this.state.user;
            user[name] = value;

            this.setState({
                user,
            });
        }
    }

    async onSubmitHandler(event) {
        event.preventDefault();
        this.setState({isLoading: true});

      const {user} = this.state; 

        const result = await this.AuthenticationService.login(user);

        if(notify.showIfError(result, 'Invalid Credentials!')) {
            this.setState({isLoading: false});
            return;
        }

        window.localStorage.setItem('userId', result._id);
        window.localStorage.setItem('username', result.username);
        window.localStorage.setItem('authtoken', result._kmd.authtoken);
        
        let isAdmin = false;        
        const roleResult = await this.AuthenticationService.isAdmin(result._id);
        if(roleResult.roleId) {
            isAdmin = true;
        }

        window.localStorage.setItem('isAdmin', isAdmin);

        const loggedInUser = {
            id: result._id,
            username: result.username,
            authtoken: result._kmd.authtoken,
            isLoggedIn: true,
            isAdmin
        };
        
        notify.success(`Hello, ${result.lastName}! We are glad to see you again! :)`);
        this.setState({isLoading: false});
        this.props.updateUser(loggedInUser);
    }

    render() {
        const {isLoading, user} = this.state;
        return (
            <div className="row container block">     
            {isLoading ? <Loading /> : null}
            <h2 className="purple-text text-darken-4 center">Login</h2>
            <form className="col s4 offset-s4" onSubmit={this.onSubmitHandler}>                
                <div className="row">
                    <Input 
                        name="username" 
                        label="Username" 
                        type="text" 
                        value={user.username}
                        className="s12" 
                        onChangeHandler={this.onChangeHandler} />
                </div>
                <div className="row">
                    <Input 
                        name="password" 
                        label="Password" 
                        type="password"
                        value={user.password} 
                        className="s12" 
                        onChangeHandler={this.onChangeHandler} />
                </div> 
                <button 
                    className="btn waves-effect waves-light right" 
                    type="submit" 
                    name="action">
                    Login
                </button>
            </form>
          </div>
        );
    }
}

export default WithAuthentication(Login);
