import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Input from '../../../components/form/input';
import Loading from '../../../components/common/loading';
import Textarea from '../../../components/form/textarea';

import DestinationService from '../../../services/destination-service';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
registerPlugin(FilePondPluginImagePreview);

class AddDestination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            destination: {
                name: '',
                location: '',
                description: '',
            },
            destinationId: '',
            images: [],
            redirect: false,
            isLoading: false,
        };

        this.destinationService = new DestinationService();

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    onChangeHandler(event) {
        const { destination } = this.state;
        const {name, value} = event.target;
        
        if(destination.hasOwnProperty(name)) {
            destination[name] = value;
            this.setState({ destination });
        }
    }

    async onSubmitHandler(event) {
        event.preventDefault();
        const {destination, images} = this.state;

        this.setState({isLoading: true});
        
        const createdDestination = await this.destinationService.create(destination, images);

        this.setState({isLoading: false, redirect: true, destinationId: createdDestination._id});
    }

    onDrop(fileItems) {
        this.setState({
            images: fileItems.map(fileItem => fileItem.file)
        });
    }

    render() {
        const { isLoading, destinationId, redirect } = this.state;
        const disabled = isLoading ? true : false;

        if(redirect && destinationId.length > 0) {
            return <Redirect to={`/destination/details/${destinationId}`} />;
        }

        return (
            <div className="row container block">
            {isLoading ? <Loading /> : null}
            <h2 className="teal-text text-lighten-2 center">Add Destination</h2>
            <form className="col s10 offset-s1" onSubmit={this.onSubmitHandler}>  
                <div className="row">
                    <Input 
                        name="name" 
                        label="Name" 
                        type="text" 
                        className="l6" 
                        disabled={disabled}
                        onChangeHandler={this.onChangeHandler} />
                    <Input 
                        name="location" 
                        label="Location" 
                        type="text" 
                        className="l6" 
                        disabled={disabled}
                        onChangeHandler={this.onChangeHandler} />
                </div>
                <div className="row">
                    <Textarea 
                        name="description" 
                        label="Description" 
                        className="l12"
                        disabled={disabled}
                        onChangeHandler={this.onChangeHandler} />
                </div>
                <div className="row">
                    <FilePond                         
                        ref={ref => this.pond = ref}
                        files={this.state.pictures}
                        maxFiles="5"
                        required={true}
                        allowMultiple={true} 
                        dropOnPage={true}
                        onupdatefiles={this.onDrop} />
                </div>
                <button className="btn waves-effect waves-light right" type="submit" name="action">Add</button>
            </form>
          </div>
        );
    }
}
export default AddDestination;
