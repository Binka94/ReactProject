import React, { Component, Fragment } from 'react';

import WithAuthentication from '../../../hocs/with-user-authentication';

import Loading from '../../../components/common/loading';
import DestinationCard from '../../../components/common/card/destination-card';

import DestinationService from '../../../services/destination-service';

import search from '../../../static/images/dress-search.jpg';

class AllDestinations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            destinations: [],
        };

        this.destinationService = new DestinationService();
    }

    async componentDidMount() {
        this.setState({ isLoading: true });

        const destinations = await this.destinationService.getAll();

        this.setState({ destinations, isLoading: false });
    }

    render() {
        const {
            destinations,
            isLoading,
        } = this.state;

        return (
            <Fragment>
                <div className="teal lighten-3 section">
                    <div className="row container section">
                        <div className="col 12 search">
                            <h3 className="teal-text text-lighten-5">Here are all the destinations!</h3>
                        </div>
                    </div>
                </div>

                <div className="row container dress-container">
                    {isLoading ? <Loading /> : null}
                    {
                        destinations.length === 0
                            ?
                            <div className="row container section center">
                                <img alt="Search for dress" src={search} width="300" />
                                <h5>There are no destinations yet!</h5>
                                <p>Go to "Add destination" and add a new destination to the system.</p>
                            </div>
                            :
                            <Fragment>
                                {
                                    destinations.map((destination) => (
                                        <DestinationCard
                                            id={destination._id}
                                            name={destination.name}
                                            location={destination.location}
                                            description={destination.description}
                                            imageUrl={destination.primaryImageUrl}
                                            key={destination._id} />
                                    ))
                                }
                            </Fragment>
                    }
                </div>
            </Fragment>
        );
    }
}

export default WithAuthentication(AllDestinations);