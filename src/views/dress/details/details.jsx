import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom'; 

import WithAuthentication from '../../../hocs/with-user-authentication';

import DressService from '../../../services/dress-service';
import ImageService from '../../../services/image-service';
import DestinationService from '../../../services/destination-service';

import './details.css';

class Details extends Component {
    constructor(props) {
        super(props);

        this.state = {            
            dress: {
                _id: '',
                destination: '',
                dress: '',
                color: '',
                model: '',
                description: '',
                primaryImageUrl: '',
            },
            destination: {
                _id: '',
                name: '',
                location: '',
                description: '',
            },
            dressImages: [],
            instance: null,
        }

        this.dressService = new DressService();
        this.imageService = new ImageService();
        this.destinationService = new DestinationService();
    }

    async componentDidMount() {        
        const { dressId } = this.props.match.params;

        const dress = await this.dressService.getById(dressId);
        const dressImages = await this.imageService.getDressImagesByDressId(dressId);
        const destination = await this.destinationService.getById(dress.destination);

        this.setState({
            dress,
            destination,
            dressImages,
        }, () => {
            const elems = document.querySelectorAll('.materialboxed');
            const instance = window.M.Materialbox.init(elems);

            this.setState({instance});
        });
    }

    componentWillUnmount() {
        if(this.state.instance) {
            this.state.instance[0].destroy();
        }
    }
    
    render() {
        const { dress, dressImages } = this.state;

        return (
            <Fragment>
                <div className="container info-container">
                    <h2 className="center teal-text text-lighten-2">{dress.model}</h2>

                    <div className="divider"></div>

                    <div className="row">                   
                        <img className="materialboxed col s12 m4 l4 image-margin" src={dress.primaryImageUrl} alt="Dress primary" />
                        
                        <div className="col s12 m8 l8">
                            <p className="light-background">Color: {dress.color}</p>
                            {/* <p className="light-background">Destination: <Link to={`/destination/details/${destination._id}`} className="btn-flat teal lighten-2 white-text">{destination.name}</Link></p> */}
                            <p className="light-background">Model: {dress.model}</p>
                            
                        </div>
                    </div>
                        
                    <h4 className="teal-text text-lighten-2 center">Description</h4>  
                    <p className="light-background">{dress.description}</p>  

                    <div className="light-background">
                        {
                            this.props.user.isAdmin
                            ?
                            <Fragment>
                                <Link to={`/dress/edit/${dress._id}`} className="waves-effect waves-light btn orange lighten-1 custom-btn">Edit</Link>
                                <Link to={`/dress/delete/${dress._id}`} className="waves-effect waves-light btn red lighten-1 custom-btn">Delete</Link>
                            </Fragment>
                            : null
                        }                        
                    </div>           
                </div>

                <div className="row container info-container">
                    <h4 className="center teal-text text-lighten-2">All photos</h4>
                    <div className="row">
                        {
                            dressImages.map((image) => (
                                <div className="col s12 m4 l2" key={image._id}>
                                    <div className="card">
                                        <div className="card-image">
                                            <img className="materialboxed"
                                                src={image.link}  
                                                alt="Dress"/>
                                        </div>                       
                                    </div>
                                </div>                                    
                            ))
                        }
                    </div>
                </div> 
            </Fragment>
        );
    };
}

export default WithAuthentication(Details);