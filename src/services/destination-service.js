import requester, { APP_KEY } from '../data/requester';

import ImageService from './image-service';

class DestinationService {
    constructor() {
        this.imageService = new ImageService();
    }
    
    async getSelectListItems() {
        try {
            let destinations = await requester.get(`/appdata/${APP_KEY}/destinations?query={}&fields=id,name`);

            return destinations.map((destination) => ({value: destination._id, title: destination.name}));
        } catch (error) {
            return error;
        }
    }

    async getById(destinationId) {
        try {
            return await requester.get(`/appdata/${APP_KEY}/destinations/${destinationId}`);
        } catch(err) {
            return err;
        }
    }

    async getAll() {
        try {
            return await requester.get(`/appdata/${APP_KEY}/destinations`);
        } catch(err) {
            return err;
        }
    }

    async create(destination, images) {
        try {            
            // Upload destination
            const uploadedDestination = await requester.post(`/appdata/${APP_KEY}/destinations`, destination);            
            if(uploadedDestination.error) {
                console.log(uploadedDestination);
                return;
            }
                        
            // Upload images
            let primaryImage = true;
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const headers = {
                    'Authorization': 'Client-ID 93943f36b2a1fbb',
                }

                var formData = new FormData();
                formData.append("image", image);
                
                const result = await requester.post(
                    'https://api.imgur.com/3/image', 
                    formData, 
                    headers
                );

                if(result.success) {
                    const destinationImage = {
                        destinationId: uploadedDestination._id,
                        ...result.data,
                    }

                    const imageResponse = await requester.post(`/appdata/${APP_KEY}/destinationImages`, destinationImage);

                    if(primaryImage) {
                        destination.primaryImageUrl = imageResponse.link;
                        await requester.put(`/appdata/${APP_KEY}/destinations/${uploadedDestination._id}`, destination);
                        primaryImage = false;
                    }
                    
                } else {
                    return result;
                }
            }
            
            return uploadedDestination;
        } catch(err) {
            return err; 
        }
    }

    async update(destinationId, destination, imagesToDelete, newImages) {
        // Upload dress
        const updatedDestination = await requester.put(`/appdata/${APP_KEY}/destinations/${destinationId}`, destination);            
        if(updatedDestination.error) {
            console.log(updatedDestination);
            return;
        }

        const headers = {
            'Authorization': 'Client-ID 93943f36b2a1fbb',
        }

        // Remove old images
        for (let i = 0; i < imagesToDelete.length; i++) {
            const image = imagesToDelete[i];
            await requester.delete(`https://api.imgur.com/3/image/${image.deletehash}`, {}, headers);
            await requester.delete(`/appdata/${APP_KEY}/destinationImages/${image.id}`);            
        }

        // Upload new images
        let primaryImage = destination.primaryImageUrl === ''; // First uploaded image is Primary.
        for (let i = 0; i < newImages.length; i++) {
            const image = newImages[i];
            const formData = new FormData();
            formData.append("image", image);
            
            const result = await requester.post(
                'https://api.imgur.com/3/image', 
                formData, 
                headers
            );

            if(result.success) {
                const destinationImage = {
                    destinationId: updatedDestination._id,
                    ...result.data,
                }

                const imageResponse = await requester.post(`/appdata/${APP_KEY}/destinationImages`, destinationImage);

                if(primaryImage) {
                    destination.primaryImageUrl = imageResponse.link;
                    await requester.put(`/appdata/${APP_KEY}/destinations/${updatedDestination._id}`, destination);
                    primaryImage = false;
                }

                console.log(imageResponse);
            } else {
                console.log('error', result);
            }
        }

        return updatedDestination;
    }
    
    async delete(destinationId) {
        try {            
            const headers = {
                'Authorization': 'Client-ID 93943f36b2a1fbb',
            };
            
            const images = await this.imageService.getDestinationImagesByDestinationId(destinationId);  
            
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                await requester.delete(`https://api.imgur.com/3/image/${image.deletehash}`, {}, headers);
            }

            await requester.delete(`/appdata/${APP_KEY}/destinationImages?query={"destinationId":"${destinationId}"}`); 
            const result = await requester.delete(`/appdata/${APP_KEY}/destinations/${destinationId}`);

            return result;
        } catch(err) {
            return err;
        }
    }
}

export default DestinationService;