import React from 'react';

const defaultAuthenticationContext = {
    user: {
        userId: '',
        username: '',
        authtoken: '',
        isLoggedIn: false,
        isAdmin: false,
    },
    updateUser: () => {},
};

const { 
    Provider: AuthenticationProvider, 
    Consumer: AuthenticationConsumer,
} = React.createContext(defaultAuthenticationContext);

export {
    defaultAuthenticationContext,
    AuthenticationProvider,
    AuthenticationConsumer,
};