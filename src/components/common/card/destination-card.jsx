import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import WithAuthentication from '../../../hocs/with-user-authentication';

import './card.css';

function DestinationCard({ id, name, location, description, imageUrl, user }) {
    return (
        <div className="col s12 m6 l4 xl3 card-container">
            <div className="card">
                <div className="card-image waves-effect waves-block waves-light custom-card-image">
                    <img className="activator" src={imageUrl} alt="Dress" />
                </div>
                <div className="card-content">
                    <span className="card-title activator grey-text text-darken-4">{name}</span>
                    <span className="card-title activator grey-text text-darken-4 small-text">Location: {location}</span>
                </div>
                <div className="card-reveal">
                    <span className="card-title grey-text text-darken-4">{name}<i className="material-icons right">close</i></span>
                    <p>{description}</p>
                </div>  
                    <div className="card-action">
                    <Link to={`/destination/details/${id}`} className="waves-effect waves-light btn teal lighten-1 custom-btn">Details</Link>
                    {
                        user.isAdmin
                        ?
                        <Fragment>
                            <Link to={`/destination/edit/${id}`} className="waves-effect waves-light btn orange lighten-1 custom-btn">Edit</Link>
                        </Fragment>
                        : null
                    }
                </div>
            </div>
        </div>
    );
}

export default WithAuthentication(DestinationCard);