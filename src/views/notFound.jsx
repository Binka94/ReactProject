import React from 'react';
import { Link } from 'react-router-dom';

import notFound from '../static/images/not-found.png'

function NotFound(props) {
    return (
        <div className="row container section center">
            <img alt="Search for pet" src={notFound} width="300" />
            <h5>Page not found!</h5>
            <p>Whoops, the page you’ve tried to access doesn’t exist. Sorry about that!</p>
            <Link to="/" className="waves-effect waves-purple btn deep-purple lighten-2">RETURN HOME</Link>
        </div>
    );
}

export default NotFound;