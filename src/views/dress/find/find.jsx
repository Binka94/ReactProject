import React, { Component, Fragment } from 'react';

import WithAuthentication from '../../../hocs/with-user-authentication';

import Select from '../../../components/form/select';
import Loading from '../../../components/common/loading';
import Card from '../../../components/common/card/dress-card';

import DressService from '../../../services/dress-service';
import DestinationService from '../../../services/destination-service';

import dress from '../../../static/images/dress-white.jpg';
import destination from '../../../static/images/destination-couple.jpg';
import search from '../../../static/images/dress-search.jpg';

import './find.css';

class Find extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: {
                dress: '',
                destination: '',
            },
            isLoading: false,
            dresses: [],
            dressSelectListItems: [],
            destinationSelectListItems: [],
        };
        
        this.dressService = new DressService();
        this.destinationService = new DestinationService();

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    async componentDidMount() {
        this.setState({isLoading: true});

        const all = [{ title: 'All', value: 'all' }];
        let dressSelectListItems = [
            ...all,
            ...await this.dressService.getSelectListItems()
        ];

        let destinationSelectListItems = [
            ...all,
            ...await this.destinationService.getSelectListItems()
        ];
        
        this.setState({
            dressSelectListItems,
            destinationSelectListItems,
            isLoading: false
        });

        const { filter } = this.props.location;
        if(filter) {
            this.setState({ filter }, () => {
                this.onSubmitHandler();
            });            
        }
    }

    onChangeHandler(event) {
        const { filter } = this.state;
        const { name, value } = event.target;
        
        if(filter.hasOwnProperty(name)) {
            filter[name] = value;
            this.setState({filter});
        }
    }

    async onSubmitHandler(event) {
        if(event) {
            event.preventDefault();
        }

        const {filter} = this.state;

        this.setState({isLoading: true});
        
        const dresses = await this.dressService.getAll(filter);

        this.setState({
            dresses,
            isLoading: false,
        });
    }

    render() {
        const {
            destinationSelectListItems,
            dressSelectListItems,
            isLoading,
            filter,
        } = this.state;

        return(
            <Fragment>
                <div className="teal lighten-3 section">                
                    <div className="row container section">
                        <div className="col l8 m12 s12 search">                        
                            <h3 className="teal-text text-darken-5">Search to find the best dress!</h3>
                            <div >
                                {isLoading ? <Loading /> : null}
                                <form className="row valign-wrapper" onSubmit={this.onSubmitHandler}>
                                    <Select 
                                        name="dress" 
                                        title="Choose a dress"
                                        value={filter.dress}
                                        type="default"
                                        options={dressSelectListItems} 
                                        className="l4 s4"
                                        selectClassName="z-depth-1"
                                        onChangeHandler={this.onChangeHandler} />

                                    <Select 
                                        name="destination" 
                                        title="Choose a destination"
                                        value={filter.destination}
                                        type="default"
                                        options={destinationSelectListItems} 
                                        className="l6 s6"
                                        selectClassName="z-depth-1"
                                        onChangeHandler={this.onChangeHandler} />
                                    <button className="waves-effect waves-teal btn col l2 s2"><i className="material-icons">search</i></button>                            
                                </form>
                            </div>                    
                        </div>  
                        <div className="dress-container col l4 s12 right">
                            <span className="dress-images right">
                                <img alt="Dress" src={dress} className="dress-image z-depth-1" />
                                <img alt="Destination" src={destination} className="destination-image z-depth-1" />
                            </span>
                        </div>  
                    </div>
                </div>

                {
                    this.state.dresses.length === 0
                    ?
                    <div className="row container section center">
                        <img alt="Search for dress" src={search} width="300" />
                        <h5>Find your perfect dress!</h5>
                        <p>Select some search criteria and click “Search!”</p>
                    </div>
                    : 
                    <Fragment>
                        <div className="row container dresses-container">
                            {
                                this.state.dresses.map((dress) => (
                                    <Card 
                                        id={dress._id} 
                                        color={dress.color}
                                        model={dress.model}
                                        description={dress.description} 
                                        destination={dress.destination}
                                        imageUrl={dress.primaryImageUrl}
                                        key={dress._id} />
                                ))
                            }
                        </div>
                    </Fragment>
                    
                }
            </Fragment>           
        );
    }
}

export default WithAuthentication(Find);