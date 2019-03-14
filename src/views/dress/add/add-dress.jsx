import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Input from '../../../components/form/input';
import Textarea from '../../../components/form/textarea';
import Select from '../../../components/form/select';
import Loading from '../../../components/common/loading';

import DressService from '../../../services/dress-service';
import DestinationService from '../../../services/destination-service';

import { dressModel } from '../../../models/dress-model';
import validator from '../../../util/validator';
import notify from '../../../util/notification';

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
                dressId: '',
                dress: dressModel.defaultState,
                images: [],
                dressSelectListItems: [],
                destinationSelectListItems: [],
                linearLoading: false,
                circularLoading: false,
                successRedirect: false,
                errorRedirect: false,
            }
        };

        this.dressService = new DressService();
        this.destinationService = new DestinationService();

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    async componentDidMount() {
        this.setState({ circularLoading: true, });

        const dressSelectListItems = await this.dressService.getSelectListItems();
        if(notify.showIfError(dressSelectListItems)) {
            this.setState({isLoading: false});
            return;
        }
        const destinationSelectListItems = await this.destinationService.getSelectListItems();
        if(notify.showIfError(destinationSelectListItems)) {
            this.setState({isLoading: false});
            return;
        }

        if(destinationSelectListItems.length === 0) {
            console.log("Please, add a destination before add a dress.");
            this.setState({ errorRedirect: true, circularLoading: false, });
            return;
        }
        const {dress} = this.state;
        dress.dress = dressSelectListItems.length > 0 ? dressSelectListItems[0].value : '';
        dress.destination = destinationSelectListItems.length > 0 ? destinationSelectListItems[0].value : '';

    this.setState({
        dress,
        dressSelectListItems,
        destinationSelectListItems,
        circularLoading: false,
    });

    var elems = document.querySelectorAll('select');
    window.M.FormSelect.init(elems);
    notify.info(`The first uploaded photo will be used as the primary image.`);
}

onChangeHandler(event) {
    event.preventDefault();

    const { dress } = this.state;
    const { model, value } = event.target;
    
    if(dress.hasOwnProperty(model)) {
        validator.validateInput(event.target, dressModel.validationOptions[model]);

        dress[model] = value;
        this.setState({dress});
    }
}

async onSubmitHandler(event) {
    event.preventDefault();

    this.setState({linearLoading: true});        
    const {dress, images} = this.state;

    const isFormValid = validator.validateAllInputs(dress, dressModel.validationOptions);
    if(!isFormValid) {
        console.log("Form is not valid. Please, complete all fields correctly.");
        this.setState({linearLoading: false});
        return;
    }
    
    const createdDress = await this.dressService.create(dress, images);
    if(notify.showIfError(createdDress)) {
        notify.error('Dress is not created!');
        this.setState({linearLoading: false});
        return;
    }

    notify.success(`Dress '${createdDress.name}' is created successfully!`);
    this.setState({linearLoading: false, successRedirect: true, dressId: createdDress._id});
}

onDrop(fileItems) {
    this.setState({
        images: fileItems.map(fileItem => fileItem.file)
    });
}

render() {
    const {
        dressId,
        successRedirect,
        errorRedirect,
        circularLoading,
        linearLoading,
        destinationSelectListItems,
        dressSelectListItems,
        images,
        dress,
    } = this.state;

    if(circularLoading) {
        return <Loading circle={true} />
    }

    if(errorRedirect) {
        return <Redirect to='/' />;
    }

    if(successRedirect && dressId.length > 0) {
        return <Redirect to={`/dress/details/${dressId}`} />;
    }
    
    return (
        <div className="row container block">
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
                {linearLoading ? <Loading /> : null}
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
