
import requester, { APP_KEY } from '../data/requester';

class ImageService {
    async getDressImagesByDressId(dressId) {
        try {
            return await requester.get(`/appdata/${APP_KEY}/dressImages/?query={"dressId":"${dressId}"}&fields=_id,link,deletehash`);
        } catch(err) {
            return err;
        }
    }

    async getDestinationImagesByDestinationId(destinationId) {
        try {
            return await requester.get(`/appdata/${APP_KEY}/destinationImages/?query={"destinationId":"${destinationId}"}&fields=_id,link,deletehash`);
        } catch(err) {
            return err;
        }
    }
}

export default ImageService;