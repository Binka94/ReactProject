import React, { Fragment, Component } from 'react';
import { Redirect } from 'react-router-dom';

import WithAuthentication from '../../hocs/with-user-authentication';

import Select from '../../components/form/select';
import Loading from '../../components/common/loading';

import DressService from '../../services/dress-service';
import DestinationService from '../../services/destination-service';

import HomeImage from '../../static/images/homepage.jpg'
import WeddingAgency from '../../static/images/wedding-agency.png'
import destination from '../../static/images/image-grid-destination.jpeg'
import parties from '../../static/images/image-grid-parties.jpg'
import event from '../../static/images/image-grid-event.jpg'
import weddingParties from '../../static/images/wedding-parties.jpg'

const padding = {
    padding: "60px 0 0",
}

const margin = {
    margin: "0 auto 80px"
}

const paragraph = {
    width: "245px",
    margin: "10px auto"
};

const display = {
    'display': "inherit",
    'margin': '0px',
}

class Homepage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: {
                dress: '',
                destination: '',
            },
            instance: null,
            isLoading: false,
            hasRedirect: false,
            dressSelectListItems: [],
            destinationSelectListItems: [],
        };

        this.dressService = new DressService();
        this.destinationService = new DestinationService();

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    async componentDidMount() {
        this.setState({ isLoading: true });

        const elems = document.querySelectorAll('.parallax');
        const instance = window.M.Parallax.init(elems);

        let dressSelectListItems = [];
        let destinationSelectListItems = [];

        if (this.props.user.isLoggedIn) {
            const all = [{ title: 'All', value: 'all' }];
            dressSelectListItems = [
                ...all,
                ...await this.dressService.getSelectListItems()
            ];

            destinationSelectListItems = [
                ...all,
                ...await this.destinationService.getSelectListItems()
            ];
        }

        this.setState({
            instance,
            dressSelectListItems,
            destinationSelectListItems,
            isLoading: false
        });
    }

    componentWillUnmount() {
        if (this.state.instance) {
            this.state.instance[0].destroy();
        }
    }

    onChangeHandler(event) {
        const { filter } = this.state;
        const { name, value } = event.target;

        if (filter.hasOwnProperty(name)) {
            filter[name] = value;
            this.setState({ filter });
        }
    }

    async onSubmitHandler(event) {
        event.preventDefault();
        this.setState({ hasRedirect: true });
    }

    render() {
        const {
            destinationSelectListItems,
            dressSelectListItems,
            isLoading,
            hasRedirect,
            filter,
        } = this.state;

        if (hasRedirect) {
            return <Redirect to={{
                pathname: '/find',
                filter
            }} />
        }

        return (
            <Fragment>
                <div id="homepage" className="deep-purple accent-1">
                    {/* <button onClick={() => window.M.toast({html: 'Something went wrong while login user.',classes: "red lighten-1 grey-text text-lighten-5"})}>Error</button>
                    <button onClick={() => window.M.toast({html: 'Successful login!.',classes: "green lighten-1 grey-text text-lighten-5"})}>Success</button> */}
                    <div className="row container" style={display}>
                        <div className="col l8 s12">
                            <h1>
                                <img src={WeddingAgency}  alt="Wedding Agency" className="wedding-agency" />
                            </h1>
                            <h3 className="deep-text text-darken-5">Search to find the best destination!</h3>
                            {
                                this.props.user.isLoggedIn
                                    ?
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
                                    : null
                            }
                        </div>
                        <div className="col l4 s12 hide-on-med-and-down" style={display}>
                            <img alt="Couples" src={HomeImage} />
                        </div>
                    </div>
                </div>

                <div style={padding}>
                    <h3 className="center purple-text text-darken-3">DISCOVER MORE...</h3>
                </div>

                <div className="container row" style={{ ...padding, ...margin }}>
                    <div className="center col l4 s12">
                        <img src={destination} alt="Destinations" width="200" />
                        <h5 className="purple-text text-darken-3">DESTINATIONS</h5>
                        <p style={paragraph}>From our offices in London we plan luxury destination weddings and celebrations across the globe - from castles to vineyards, private villas, yachts and some of the world's finest hotels. Here is a selection of some of the beautiful weddings destinations and party locations we have worked, and are working at present. You may be based in Britain and seeking our services abroad, or located elsewhere in the world and hoping to work with us for a destination wedding or celebration in the UK or overseas. We have a global network of strong relationships with suppliers to ensure that wherever in the world we are working, our high standards of service, event production and design are deliverable.</p>
                    </div>
                    <div className="center col l4 s12">
                        <img src={parties} alt="Parties" width="200" />
                        <h5 className="purple-text text-darken-3">PARTIES</h5>
                        <p style={paragraph}>We plan elegant, glamorous and fun luxury parties throughout the globe. Our discerning, international client base includes some of the world's leading families for whom we create magical, immersive, world-class experiences. From birthday parties to bar mitzvahs, special anniversary parties and kids parties every celebration we plan is unique.</p>
                    </div>
                    <div className="center col l4 s12" >
                        <img src={event} alt="Event Courses" width="200" />
                        <h5 className="purple-text text-darken-3">EVENT COURSES</h5>
                        <p style={paragraph}>We offer residential wedding planning courses and one day wedding workshops for bridal professionals. They have been developed by Sarah Haywood, an award winning businesswoman with a wealth of experience building a international party planning business and luxury brand.</p>
                    </div>
                </div>

                <div className="parallax-container">
                    <div className="parallax">
                        <img className="responsive-img" src={weddingParties} alt="Wedding Parties" />
                    </div>
                </div>

                <div style={padding}>
                    <h4 className="center purple-text text-darken-3">#WeddingLove</h4>
                </div>

                <div className="container row" style={margin}>
                    <div className="center col l12 s12">
                        <p className="flow-text">"A successful marriage requires falling in love many times, always with the same person!"</p>
                        <p className="flow-text"> "I love you without knowing how, or when, or from where. I love you simply, without problems or pride: I love you in this way because I do not know any other way of loving but this, in which there is no I or you, so intimate that your hand upon my chest is my hand, so intimate then when I fall asleep your eyes close."</p>
                        <p className="flow-text">“I’m selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can’t handle me at my worst, then you sure as hell don’t deserve me at my best.”</p>
                        <p className="flow-text">“A great marriage is not when the ‘perfect couple’ comes together. It is when an imperfect couple learns to enjoy their differences.”</p>
                    </div>
                </div>

            </Fragment>
        );
    }
}

export default WithAuthentication(Homepage);