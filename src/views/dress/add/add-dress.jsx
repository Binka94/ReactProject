import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Input from '../../../components/form/input';
import Textarea from '../../../components/form/textarea';
import Select from '../../../components/form/select';
import Loading from '../../../components/common/loading';

import DressService from '../../../services/dress-service';
import DestinationService from '../../../services/destination-service';

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
registerPlugin(FilePondPluginImagePreview);

class AddDress extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dress: {
                destination: '',
                dress: '',
                color: '',
                model: '',
                description: '',
            },
            images: [],
            isLoading: false,
            dressSelectListItems: [],
            destinationSelectListItems: [],
            redirect: false,
            dressId: '',
        };

        this.dressService = new DressService();
        this.destinationService = new DestinationService();

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    async componentDidMount() {
        this.setState({ isLoading: true });

        const dressSelectListItems = await this.dressService.getSelectListItems();
        const destinationSelectListItems = await this.destinationService.getSelectListItems();

        this.setState({
            dressSelectListItems,
            destinationSelectListItems,
            isLoading: false
        });
    }

    onChangeHandler(event) {
        event.preventDefault();

        const { dress } = this.state;
        const { model, value } = event.target;

        if (dress.hasOwnProperty(model)) {
            dress[model] = value;
            this.setState({ dress });
        }
    }

    async onSubmitHandler(event) {
        event.preventDefault();
        const { dress, images } = this.state;

        this.setState({ isLoading: true });

        const createdDress = await this.dressService.create(dress, images);

        this.setState({isLoading: false, redirect: true, dressId: createdDress._id});
    }

    onDrop(fileItems) {
        this.setState({
            images: fileItems.map(fileItem => fileItem.file)
        });
    }

    render() {
        const {
            dressId,
            redirect,
            isLoading,
            destinationSelectListItems,
            dressSelectListItems,
            images,
            dress,
        } = this.state;

        if(redirect && dressId.length > 0) {
            return <Redirect to={`/dress/details/${dressId}`} />;
        }

        return (
            <div className="row container block">
                {isLoading ? <Loading /> : null}
                <h2 className="teal-text text-lighten-2 center">Add Dress</h2>
                <form className="col s10 offset-s1" onSubmit={this.onSubmitHandler}>
                    <div className="row">
                        <Select
                            name="dress"
                            value={dress.dress}
                            className="l6"
                            options={dressSelectListItems}
                            onChangeHandler={this.onChangeHandler} />

                        <Select
                            name="destination"
                            value={dress.destination}
                            options={destinationSelectListItems}
                            className="l6"
                            onChangeHandler={this.onChangeHandler} />
                    </div>
                    <div className="row">
                        <Input
                            name="color"
                            label="Color"
                            type="text"
                            className="l4"
                            onChangeHandler={this.onChangeHandler} />

                        <Input
                            name="model"
                            label="Model"
                            type="text"
                            className="l4"
                            onChangeHandler={this.onChangeHandler} />
                    </div>
                    <div className="row">
                        <Textarea
                            name="description"
                            label="Description"
                            type="text"
                            className="l12"
                            onChangeHandler={this.onChangeHandler} />
                    </div>
                    <div className="row">
                        <FilePond
                            ref={ref => this.pond = ref}
                            files={images}
                            maxFiles="5"
                            required={true}
                            allowMultiple={true}
                            dropOnPage={true}
                            onupdatefiles={this.onDrop} />
                    </div>
                    <button
                        className="btn waves-effect waves-light right"
                        type="submit"
                        name="action">
                        Add
                    </button>
                </form>
            </div>
        );
    }
}

export default AddDress;