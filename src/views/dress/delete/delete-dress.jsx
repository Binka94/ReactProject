import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'; 
import Loading from '../../../components/common/loading';


import DressService from '../../../services/dress-service';
import DestinationService from '../../../services/destination-service';


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
            instance: null,
            isLoading: false,
            redirect: false,
        }

        this.dressService = new DressService();
        this.destinationService = new DestinationService();

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    async componentDidMount() {        
        const { dressId } = this.props.match.params;

        const dress = await this.dressService.getById(dressId);
        const destination = await this.destinationService.getById(dress.destination);

        this.setState({
            dress,
            destination,
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
    
    async onSubmitHandler(event) {
        event.preventDefault();
        this.setState({ isLoading: true });

        const { dress } = this.state;
       
        await this.dressService.delete(dress._id);

        this.setState({ isLoading: false, redirect: true });
    }

    render() {
        const { dress, destination, redirect, isLoading } = this.state;

        if(redirect) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container info-container">
                <h2 className="center red-text text-lighten-1">Delete Dress</h2>

                <div className="divider"></div>

                <div className="row">                   
                    <img className="materialboxed col s12 m4 l4" src={dress.primaryImageUrl} alt="Dress primary"/>
                    
                    <div className="col s12 m8 l8">
                        <h4 className="red-text text-lighten-1 center">{dress.model}</h4>
                        <p className="light-background">Color: {dress.color}</p>
                        <p className="light-background">Destination: <Link to={`/destination/details/${destination._id}`}>{destination.name}</Link></p>
                        <p className="light-background">Locaton: {destination.location}</p>
                        <div className="light-background">
                            <form className="center" onSubmit={this.onSubmitHandler}>
                                <span>Are you sure?</span>
                                <br/>
                                <button type="submit" className="waves-effect waves-light btn red lighten-1 custom-btn">Yes, delete it!</button>
                            </form>                        
                        </div>
                    </div>
                </div>

                {isLoading ? <Loading innerColor="red lighten-1" outerColor="red lighten-4" /> : null}

                <div className="divider"></div>
                <h4 className="red-text text-lighten-1 center">Description</h4>
                <p className="light-background">{dress.description}</p>               
            </div>
        );
    };
}

export default Details;