import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom'; 

import WithAuthentication from '../../../hocs/with-user-authentication';

import ImageService from '../../../services/image-service';
import DestinationService from '../../../services/destination-service';

class Details extends Component {
    constructor(props) {
        super(props);

        this.state = {       
            destination: {
                _id: '',
                name: '',
                location: '',
                description: '',
            },
            destinationImages: [],
            isLoading: false,
            instance: null,
        }
        
        this.imageService = new ImageService();
        this.destinationService = new DestinationService();
    }

    async componentDidMount() {        
        const { destinationId } = this.props.match.params;

        const destination = await this.destinationService.getById(destinationId);
        const destinationImages = await this.imageService.getDestinationImagesByDestinationId(destinationId);

        this.setState({ destination, destinationImages }, () => {
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
        const { destination, destinationImages } = this.state;
    
            return (
                <Fragment>
                    <div className="container info-container">
                        <h4 className="center teal-text text-lighten-2">{destination.name}</h4>
    
                        <div className="divider"></div>
    
                        <div className="row">                   
                            <img className="materialboxed col s12 m4 l4" src={destination.primaryImageUrl} alt="Destination primary"/>
                            
                            <div className="col s12 m8 l8">
                                <p className="light-background">Location: {destination.location}</p>
                                <p className="light-background">{destination.description}</p>               
                                {
                                    this.props.user.isAdmin
                                    ?
                                    <div className="light-background">
                                        <Link to={`/destination/edit/${destination._id}`} className="waves-effect waves-light btn orange lighten-1 custom-btn">Edit</Link>
                                    </div>
                                    :null
                                }
                            </div>
                        </div>
                    </div>
    
                    <div className="row container info-container">
                        <h4 className="center teal-text text-lighten-2">All photos</h4>
                        <div className="row">
                        {
                            destinationImages.map((image) => (
                                <div className="col s12 m4 l2" key={image._id}>
                                    <div className="card">
                                        <div className="card-image">
                                            <img className="materialboxed"
                                                src={image.link}  
                                                alt="Destination"/>
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