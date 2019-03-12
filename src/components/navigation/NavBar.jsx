import React, { Fragment } from 'react';
import { AuthenticationConsumer } from '../../components/contexts/authentication-context';
import { Link, NavLink } from 'react-router-dom';

const logoStyle = {
  position: 'relative',
}
const space = {
  width: '20px',
  height: '100%',
}

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      activeLink: "",
    }
  }

  handleClick(event) {
    this.setState({
      activeLink: event.target.innerText,
    });
  }

  render() {
    const loginActive = this.state.activeLink === 'Login' ? 'active' : '';
    const registerActive = this.state.activeLink === 'Register' ? 'active' : '';
    const addDestinationActive = this.state.activeLink === 'Add Destination' ? 'active' : '';
    const addDressActive = this.state.activeLink === 'Add Dress' ? 'active' : '';
    const findActive = this.state.activeLink === 'Find Your Destination' ? 'active' : '';
    const aboutActive = this.state.activeLink === 'About' ? 'active' : '';

    return (
        <div>
          <nav className="deep-purple accent-2">
            <div className="nav-wrapper container">
                <Link to="/" className="brand-logo left" style={logoStyle} onClick={this.handleClick}>Wedding Agency</Link>
                <span className="left" style={space}></span>
                <ul className="left hide-on-med-and-down">
                  {
                    this.props.user.isAdmin 
                    ?                    
                    <Fragment>
                        <li className={addDestinationActive}><NavLink to="/destination/add" onClick={this.handleClick}>Add Destination</NavLink></li>
                        <li className={addDressActive}><NavLink to="/dress/add" onClick={this.handleClick}>Add Dress</NavLink></li>
                      </Fragment>
                    : null
                  }
                  {
                    this.props.user.isLoggedIn
                    ? <li className={findActive}><NavLink to="/find" onClick={this.handleClick}>Find Your Destination</NavLink></li>
                    : null
                  }                  
                  <li className={aboutActive}><NavLink to="/about" onClick={this.handleClick}>About</NavLink></li>
                </ul> 
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                  {
                    this.props.user.isLoggedIn 
                    ? 
                    <Fragment>                      
                      <li><Link to="#">Hello, {this.props.user.username}!</Link></li>
                      <li><NavLink to="/logout" className="btn-flat waves-effect waves-teal btn grey lighten-5 teal-text" onClick={this.handleClick}>Logout</NavLink></li>
                    </Fragment>                    
                    :
                    <Fragment>
                      <li className={loginActive}><NavLink to="/login" onClick={this.handleClick}>Login</NavLink></li>
                      <li className={registerActive}><NavLink to="/register" onClick={this.handleClick}>Register</NavLink></li>
                    </Fragment>
                  }
                </ul>        
            </div>
          </nav>
        </div>
    );
  }
}

function LoginWithAuthorization(props) {
  return (
      <AuthenticationConsumer>
          {
              (data) => (<NavBar {...data} {...props}/>)
          }
      </AuthenticationConsumer>
  );
}

export default LoginWithAuthorization;
