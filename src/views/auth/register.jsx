import React from 'react';
import Input from '../../components/form/input';
import Loading from '../../components/common/loading';
import AuthenticationService  from '../../services/authentication-service';
import WithAuthentication from '../../hocs/with-user-authentication';

class Register extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            user: {
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                email: '',
                username: '',
                password: '',  
                confirmPassword: '',
            },
            isLoading: false,
        };

        this.AuthenticationService = new AuthenticationService();

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(event) {
        const name = event.target.name;
        
        if(this.state.user.hasOwnProperty(name)) {
            const value = event.target.value;

            const user = this.state.user;
            user[name] = value;

            this.setState(user);
        }
    }

    async onSubmitHandler(event) {
        event.preventDefault();
        this.setState({isLoading: true});

        const { password, confirmPassword } = this.state;

        if(password !== confirmPassword) {
            console.log("Passwords must match.");
            this.setState({isLoading: false});
            return;
        }

        const user = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
        };

        const result = await this.AuthenticationService.register(user);
        
        if(result.debug) {
            result.debug.forEach((error) => {
                console.log(`Field '${error.attr}': ${error.msg}`);
            });
            this.setState({isLoading: false});
            return;
        }

        if(result.error) {
            console.log(result.error);
            console.log(result.description);
            this.setState({isLoading: false});
            return;
        }

        const registeredUser = {
            id: result._id,
            username: result.username,
            authtoken: result._kmd.authtoken,
            isLoggedIn: true,
            isAdmin: false,
        };
        
        window.localStorage.setItem('userId', registeredUser.id);
        window.localStorage.setItem('username', registeredUser.username);
        window.localStorage.setItem('authtoken', registeredUser.authtoken);
        window.localStorage.setItem('isAdmin', false);
        
        this.setState({isLoading: false});
        this.props.updateUser(registeredUser);
    }

    render() {
        return (
            <div className="row container block">
            {this.state.isLoading ? <Loading /> : null}
            <h2 className="purple-text text-darken-4 center">Register</h2>
            <form className="col s10 offset-s1" onSubmit={this.onSubmitHandler}>  
                <div className="row">
                    <Input 
                        name="firstName" 
                        label="First name" 
                        type="text" 
                        className="s6" 
                        onChangeHandler={this.onChangeHandler} />

                    <Input 
                        name="lastName" 
                        label="Last name" 
                        type="text" 
                        className="s6" 
                        onChangeHandler={this.onChangeHandler} />
                </div>
                <div className="row">
                    <Input 
                        name="address" 
                        label="Address" 
                        type="text" 
                        className="s6" 
                        onChangeHandler={this.onChangeHandler} />

                    <Input 
                        name="phoneNumber" 
                        label="Phone number" 
                        className="s6" 
                        type="text" 
                        onChangeHandler={this.onChangeHandler} />                    
                </div>
                <div className="row">
                    <Input 
                        name="email" 
                        label="Email" 
                        type="email" 
                        className="s6" 
                        onChangeHandler={this.onChangeHandler} />

                    <Input 
                        name="username" 
                        label="Username" 
                        type="text" 
                        className="s6" 
                        onChangeHandler={this.onChangeHandler} />
                </div>
                <div className="row">
                    <Input 
                        name="password" 
                        label="Password" 
                        type="password" 
                        className="s6" 
                        onChangeHandler={this.onChangeHandler} />

                    <Input 
                        name="confirmPassword" 
                        label="Confirm password" 
                        type="password" 
                        className="s6" 
                        onChangeHandler={this.onChangeHandler} />                    
                </div>
                <button className="btn waves-effect waves-darken right" type="submit" name="action">Register</button>
            </form>
          </div>
        );
    }
}

export default WithAuthentication(Register);