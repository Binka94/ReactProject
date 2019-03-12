import requester, { APP_KEY } from '../data/requester';

import ImageService from './image-service';

class DressService {  
    constructor() {
        this.imageService = new ImageService();
    }
    
    async getAll(filters) {

        const filter = Object.keys(filters)
            .filter((key) => {
                return filters[key].length > 0 && filters[key] !== 'all';
            })
            .map((key) => `"${key}":"${filters[key]}"`)
            .join(", ");

        let query = '';
        if(filter) {
            query = `?query={${filter}}`;
        }

        try {
            return await requester.get(`/appdata/${APP_KEY}/dresses${query}`);
        } catch(err) {
            return err;
        }           
    }

    async getById(dressId) {
        try {
            return await requester.get(`/appdata/${APP_KEY}/dresses/${dressId}`);
        } catch(err) {
            return err;
        }
    }

    async getSelectListItems() {
        try {
            const dressTypes = await requester.get(`/appdata/${APP_KEY}/dressTypes`);

            return dressTypes.map((dressType) => ({value: dressType.value, title: dressType.title}));
        } catch(err) {
            return err;
        }
    }

    async create(dress, images) {
        try {            
            // Upload dress
            const uploadedDress = await requester.post(`/appdata/${APP_KEY}/dresses`, dress);            
            if(uploadedDress.error) {
                console.log(uploadedDress);
                return;
            }
            
            // Upload images
            let primaryImage = true; // First uploaded image is Primary.

            // images.forEach(async (image) => {
            //     const headers = {
            //         'Authorization': 'Client-ID 93943f36b2a1fbb',
            //     }
                const headers = {
                    'Authorization': 'Client-ID 93943f36b2a1fbb',
                }
    
                for (let i = 0; i < images.length; i++) {
                    const image = images[i];

                var formData = new FormData();
                formData.append("image", image);
                
                const result = await requester.post(
                    'https://api.imgur.com/3/image', 
                    formData, 
                    headers
                );

                if(result.success) {
                    const dressImage = {
                        dressId: uploadedDress._id,
                        ...result.data,
                    }

                    const imageResponse = await requester.post(`/appdata/${APP_KEY}/dressImages`, dressImage);

                    if(primaryImage) {
                        dress.primaryImageUrl = imageResponse.link;
                        await requester.put(`/appdata/${APP_KEY}/dresses/${uploadedDress._id}`, dress);
                        primaryImage = false;
                    }
                }else{
                    console.log('error', result);
                }
            }
            return uploadedDress;
        } catch(err) {
            return err; 
        }
    }

    async update(dressId, dress, imagesToDelete, newImages) {
        // Upload dress
        const updatedDress = await requester.put(`/appdata/${APP_KEY}/dresses/${dressId}`, dress);            
        if(updatedDress.error) {
            console.log(updatedDress);
            return;
        }
        const headers = {
            'Authorization': 'Client-ID 93943f36b2a1fbb',
        }

        // Remove old images
        for (let i = 0; i < imagesToDelete.length; i++) {
            const image = imagesToDelete[i];
            await requester.delete(`https://api.imgur.com/3/image/${image.deletehash}`, {}, headers);
            await requester.delete(`/appdata/${APP_KEY}/dressImages/${image.id}`); 
        };


        // Upload new images
        let primaryImage = dress.primaryImageUrl === ''; // First uploaded image is Primary.
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
                const dressImage = {
                    dressId: updatedDress._id,
                    ...result.data,
                }

                const imageResponse = await requester.post(`/appdata/${APP_KEY}/dressImages`, dressImage);

                if(primaryImage) {
                    dress.primaryImageUrl = imageResponse.link;
                    await requester.put(`/appdata/${APP_KEY}/dresses/${updatedDress._id}`, dress);
                    primaryImage = false;
                }

                console.log(imageResponse);
            } else {
                console.log('error', result);
            }
        }
        return updatedDress;
    }

    async delete(dressId) {
        try {            
            const headers = {
                'Authorization': 'Client-ID 93943f36b2a1fbb',
            };

            const images = await this.imageService.getDressImagesByDressId(dressId);  
            
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                await requester.delete(`https://api.imgur.com/3/image/${image.deletehash}`, {}, headers);
            }

            await requester.delete(`/appdata/${APP_KEY}/dressImages?query={"dressId":"${dressId}"}`); 
            const result = await requester.delete(`/appdata/${APP_KEY}/dresses/${dressId}`);

            return result;
        } catch(err) {
            return err;
        }
    }
}

export default DressService;