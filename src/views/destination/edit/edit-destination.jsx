import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Input from '../../../components/form/input';
import Loading from '../../../components/common/loading';
import Textarea from '../../../components/form/textarea';

import ImageService from '../../../services/image-service';
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
                primaryImageUrl: '',
            },
            destinationId: '',
            oldImages: [],
            newImages: [],
            imagesToDelete: [],
            isLoading: false,
            redirect: false,
        };

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
    
        const { destinationId } = this.props.match.params;
        const destinationModel = await this.destinationService.getById(destinationId);
        const destinationImages = await this.imageService.getDestinationImagesByDestinationId(destinationId);
        
        const destination = {
            name: destinationModel.name,
            location: destinationModel.location,
            description: destinationModel.description,
            primaryImageUrl: destinationModel.primaryImageUrl,
        }

        destinationImages.forEach((image) => {
            if(image.link === destination.primaryImageUrl) {
                image.isPrimary = true;
            } else {
                image.isPrimary = false;
            }
        });

        this.setState({
            destinationId,
            destination,
            isLoading: false,
            oldImages: destinationImages,
        });

        window.M.updateTextFields();
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
        this.setState({isLoading: true});

        const {destinationId, destination, imagesToDelete, newImages} = this.state;

        
        await this.destinationService.update(destinationId, destination, imagesToDelete, newImages);

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
        
        let { destination, oldImages, imagesToDelete } = this.state;

        oldImages = oldImages.filter((image) => image._id !== imageId);
        imagesToDelete.push({
            id: imageId, 
            deletehash
        });

        if(link === destination.primaryImageUrl) {
            destination.primaryImageUrl = oldImages[0] ? oldImages[0].link : '';
        }

        this.setState({ destination, oldImages, imagesToDelete });
    }

    makePrimary(event) {
        event.preventDefault();

        const { id: imageId, link, } = event.target.parentElement.dataset;
        let { destination, oldImages } = this.state;

        oldImages.forEach((image) => {
            if(image._id === imageId) {
                image.isPrimary = true;
            } else {
                image.isPrimary = false;
            }
        });

        destination.primaryImageUrl = link;

        this.setState({destination, oldImages});
    }

    render() {
        const {
            redirect,
            isLoading,
            oldImages,
            newImages,
            destination: destinationModel,
            destinationId,
        } = this.state;

        if(redirect && destinationId.length > 0) {
            return <Redirect to={`/destination/details/${destinationId}`} />;
        }

        const {
            name,
            location,
            description,
        } = destinationModel;

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
            <h2 className="orange-text text-lighten-1 center">Edit Destination</h2>
            <form className="col s10 offset-s1" onSubmit={this.onSubmitHandler}>  
                <div className="row">
                    <Input 
                        name="name"
                        label="Name"
                        value={name}
                        type="text" 
                        className="l6"
                        disabled={disabled}
                        onChangeHandler={this.onChangeHandler} />
                    <Input 
                        name="location" 
                        label="Location" 
                        value={location}
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
                                            <img src={image.link} alt="Destination" />
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

export default AddDestination;