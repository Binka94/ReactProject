import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import WithAuthentication from '../../../hocs/with-user-authentication';

import './card.css';

function DressCard({ id, model, color, description, destination, imageUrl, user }) {
    return (
        <div className="col s12 m6 l4 xl3 card-container">
            <div className="card">
                <div className="card-image waves-effect waves-block waves-light custom-card-image">
                    <img className="activator" src={imageUrl} alt="Dress" />
                </div>
                <div className="card-content">
                    <span className="card-title activator grey-text text-darken-4">Color: {color}</span>
                    <span className="card-title activator grey-text text-darken-4 breed">Model: {model}</span>
                    <p>
                        <Link to={`/destination/${destination}`}>Destination info</Link>
                    </p>
                </div>
                <div className="card-reveal">
                    <span className="card-title grey-text text-darken-4">{model}<i className="material-icons right">close</i></span>
                    <p>{description}</p>
                </div>  
                    <div className="card-action">
                    <Link to={`/dress/details/${id}`} className="waves-effect waves-light btn blue lighten-1 custom-btn">Details</Link>
                    {
                        user.isAdmin
                        ?
                        <Fragment>
                            <Link to={`/dress/edit/${id}`} className="waves-effect waves-light btn orange lighten-1 custom-btn">Edit</Link>
                            <Link to={`/dress/delete/${id}`} className="waves-effect waves-light btn red lighten-1 custom-btn">Delete</Link>
                        </Fragment>
                        : null
                    }
                </div>
            </div>
        </div>
    );
}

export default WithAuthentication(DressCard);