import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AnonymousRoute from './components/AnonymousRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';

import {
  defaultAuthenticationContext, 
  AuthenticationProvider } from './components/contexts/authentication-context';

import NavBar from './components/navigation/NavBar';
import Footer from './components/footer/footer';

import Homepage from './views/home/index';
import Login from './views/auth/login';
import Register from './views/auth/register';
import Logout from './views/auth/logout';
import AddDestination from './views/destination/add/add-destination';
import EditDestination from './views/destination/edit/edit-destination';
import AllDestinations from './views/destination/list-all/list-all';
import DestinationDetails from './views/destination/details/details';
import AddDress from './views/dress/add/add-dress';
import EditDress from './views/dress/edit/edit-dress';
import DressDetails from './views/dress/details/details';
import DeleteDress from './views/dress/delete/delete-dress';
import Find from './views/dress/find/find';
import About from './views/about/about';
import NotFound from './views/notFound';

import './components/footer/footer.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.updateUser = this.updateUser.bind(this);
    defaultAuthenticationContext.updateUser = this.updateUser;

    this.state = defaultAuthenticationContext;    
  }

  componentWillMount() {
    const userId = window.localStorage.getItem('userId');
    const username = window.localStorage.getItem('username');
    const authtoken = window.localStorage.getItem('authtoken');
    const isAdmin = window.localStorage.getItem('isAdmin');
    
    if(userId && username && authtoken) {
      this.setState({
        user: {
          userId,
          username,
          authtoken,
          isLoggedIn: true,
          isAdmin,
        }
      });
    }
  }

  updateUser(user) {
    this.setState({user});
  }

  render() {    
    return (
      <Router>
        <AuthenticationProvider value={this.state}>
          <NavBar />
            <main>
                <Switch>
                  <Route exact path="/" component={Homepage} />
                  <AnonymousRoute path="/login" component={Login} />
                  <AnonymousRoute path="/register" component={Register} />
                  <AuthenticatedRoute path="/logout" component={Logout} />
                  <AuthenticatedRoute path="/destination/add" component={AddDestination} />
                  <AuthenticatedRoute path="/destination/edit/:destinationId" component={EditDestination} />
                  <AuthenticatedRoute path="/destination/details/:destinationId" component={DestinationDetails} />
                  <AuthenticatedRoute exact path="/destination/all" component={AllDestinations} />
                  <AuthenticatedRoute path="/dress/add" component={AddDress} />
                  <AuthenticatedRoute path="/dress/edit/:dressId" component={EditDress} />
                  <AuthenticatedRoute path="/dress/delete/:dressId" component={DeleteDress} />
                  <AuthenticatedRoute path="/dress/details/:dressId" component={DressDetails} />
                  <AuthenticatedRoute path="/find" component={Find} />
                  <Route path="/about" component={About} />
                  <Route component={NotFound} />
                </Switch>
            </main>
          <Footer />
        </AuthenticationProvider>
      </Router>
    );
  }
}

export default App;
