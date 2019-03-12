const BASE_URL = 'https://baas.kinvey.com';
const APP_KEY = 'kid_ByLm0fbDE';
const APP_SECRET = 'd013abf4801b414ab60720b2dd619b00';
const ADMIN_ROLE_ID = '31978b08-5f3c-4edc-b479-a601c0913deb';

const requester = (method) => {    
    return (url, data = {}, headers = {}) => {      
        const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

        const authtoken = window.localStorage.getItem('authtoken');    
        const predefinedHeaders = {
            'Authorization': authtoken 
                ? ('Kinvey ' + authtoken)
                : ('Basic ' + btoa(`${APP_KEY}:${APP_SECRET}`)),            
        }
          
        const requestData = {
            method,
            headers: {
                ...predefinedHeaders,
                ...headers,
            }
        };
        
        if(Object.keys(data).length) {
            requestData.body = JSON.stringify(data);
            requestData.headers['Content-Type'] = "application/json";
        } else if(requestData.headers['Authorization'].startsWith('Client-ID')) {
            requestData.body = data
        }
                
        return new Promise((resolve, reject) => {
            fetch(fullUrl, requestData)
                .then((response) => {
                    resolve(response.json());
                })
                .catch((err) => reject(err));
        }) 
    }
}

export {APP_KEY, ADMIN_ROLE_ID};

export default {
    get: requester('GET'),
    post: requester('POST'),
    put: requester('PUT'),
    delete: requester('DELETE'),
};