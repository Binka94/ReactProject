import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import WithAuthentication from '../../../hocs/with-user-authentication';

import Input from '../../../components/form/input';
import Textarea from '../../../components/form/textarea';
//import Select from '../../../components/form/select';
import Loading from '../../../components/common/loading';

import './edit-dress.css';

import DressService from '../../../services/dress-service';
import ImageService from '../../../services/image-service';
import DestinationService from '../../../services/destination-service';

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
registerPlugin(FilePondPluginImagePreview);

class EditDress extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            dress: {
                destination: '',
                dress: '',
                color: '',
                model: '',
                description: '',
                primaryImageUrl: '',
            },
            dressId: '',
            oldImages: [],
            newImages: [],
            imagesToDelete: [],
            dressSelectListItems: [],
            destinationSelectListItems: [],
            isLoading: false,
            redirect: false,
        };

        this.dressService = new DressService();
        this.imageService = new ImageService();
        this.destinationService = new DestinationService();

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        
        this.onDrop = this.onDrop.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.makePrimary = this.makePrimary.bind(this);
    }

    async componentDidMount() {
        this.setState({isLoading: true});
    
        const { dressId } = this.props.match.params;
        const dressModel = await this.dressService.getById(dressId);
        const dressImages = await this.imageService.getDressImagesByDressId(dressId);
        
        const dress = {
            color: dressModel.color,
            model: dressModel.model,
            description: dressModel.description,
            primaryImageUrl: dressModel.primaryImageUrl,
        }

        dressImages.forEach((image) => {
            if(image.link === dress.primaryImageUrl) {
                image.isPrimary = true;
            } else {
                image.isPrimary = false;
            }
        });

        this.setState({
            dressId,
            dress,
            isLoading: false,
            oldImages: dressImages,
        });

        window.M.updateTextFields();
    }
    
    onChangeHandler(event) {
        const { dress } = this.state;
        const {model, value} = event.target;
        
        if(dress.hasOwnProperty(model)) {
            dress[model] = value;
            this.setState({ dress });
        }
    }

    async onSubmitHandler(event) {
        event.preventDefault();
        this.setState({isLoading: true});

        const {dressId, dress, imagesToDelete, newImages} = this.state;

        
        await this.dressService.update(dressId, dress, imagesToDelete, newImages);

        this.setState({ isLoading: false, redirect: true });
    }

    onDrop(fileItems) {
        this.setState({
            newImages: fileItems.map(fileItem => fileItem.file)
        });
    }

    onDelete(event) {
        event.preventDefault();

        const {
            id: imageId, 
            deletehash,
            link,
        } = event.target.parentElement.dataset;
        
        let { dress, oldImages, imagesToDelete } = this.state;

        oldImages = oldImages.filter((image) => image._id !== imageId);
        imagesToDelete.push({
            id: imageId, 
            deletehash
        });

        if(link === dress.primaryImageUrl) {
            dress.primaryImageUrl = oldImages[0] ? oldImages[0].link : '';
        }

        this.setState({ dress, oldImages, imagesToDelete });
    }

    makePrimary(event) {
        event.preventDefault();

        const { id: imageId, link, } = event.target.parentElement.dataset;
        let { dress, oldImages } = this.state;

        oldImages.forEach((image) => {
            if(image._id === imageId) {
                image.isPrimary = true;
            } else {
                image.isPrimary = false;
            }
        });

        dress.primaryImageUrl = link;

        this.setState({dress, oldImages});
    }

    render() {
        const {
            redirect,
            isLoading,
            oldImages,
            newImages,
            dress: dressModel,
            dressId,
        } = this.state;

        if(redirect && dressId.length > 0) {
            return <Redirect to={`/dress/details/${dressId}`} />;
        }

        const {
            color,
            model,
            description,
        } = dressModel;

        const requiredImages = oldImages.length === 0;

        const disabled = isLoading;

        return (
            <div className="row container block">    
            {
                isLoading 
                ? 
                <Loading innerColor="orange lighten-4" outerColor="orange" /> 
                : null
            }
            <h2 className="orange-text text-lighten-1 center">Edit Dress</h2>
            <form className="col s10 offset-s1" onSubmit={this.onSubmitHandler}>  
                <div className="row">
                    <Input 
                        name="color"
                        label="Color"
                        value={color}
                        type="text" 
                        className="l6"
                        disabled={disabled}
                        onChangeHandler={this.onChangeHandler} />
                    <Input 
                        name="model" 
                        label="Model" 
                        value={model}
                        type="text" 
                        className="l6" 
                        disabled={disabled}
                        onChangeHandler={this.onChangeHandler} />
                </div>
                <div className="row">
                    <Textarea 
                        name="description" 
                        value={description}
                        label="Description" 
                        className="l12"
                        disabled={disabled}
                        onChangeHandler={this.onChangeHandler} />
                </div>
                <div className="row">
                    {
                        oldImages.map((image) => {
                            const primaryButtonColor = image.isPrimary ? 'green' : 'blue';
                            const primaryButtonIcon = image.isPrimary ? 'check' : 'image';

                            return(
                                <div className="col s12 m4 l3" key={image._id}>
                                    <div className="card">
                                        <div className="card-image">
                                            <img src={image.link} alt="Dress" />
                                            <a
                                                href="#!"
                                                data-id={image._id}
                                                data-deletehash={image.deletehash}
                                                data-link={image.link}
                                                onClick={this.onDelete}
                                                className="btn-floating halfway-fab waves-effect waves-light red lighten-1 delete-btn">
                                                <i className="material-icons">delete</i>
                                            </a>
                                            <a
                                                href="#!"
                                                data-id={image._id}
                                                data-link={image.link}
                                                onClick={this.makePrimary}
                                                className={`btn-floating halfway-fab waves-effect waves-light lighten-1 primary-btn ${primaryButtonColor}`}>
                                                <i className="material-icons">{primaryButtonIcon}</i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="row">
                    <FilePond                         
                        ref={ref => this.pond = ref}
                        files={newImages}
                        maxFiles="5"
                        required={requiredImages}
                        allowMultiple={true} 
                        dropOnPage={true}
                        onupdatefiles={this.onDrop} />
                </div>
                <button className="btn waves-effect waves-light orange right" type="submit" name="action">Save changes</button>
            </form>
          </div>
        );
    }
}


export default WithAuthentication(EditDress);