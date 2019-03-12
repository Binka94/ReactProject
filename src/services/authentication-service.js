import requester, { APP_KEY, ADMIN_ROLE_ID } from '../data/requester';

class AuthenticationService {
    
    async register(user) {  
        try {
            return await requester.post(`/user/${APP_KEY}/`, user); 
        } catch(err) {
            return err;
        }           
    }

    async login(user) {
        try {
            return await requester.post(`/user/${APP_KEY}/login`, user);
        } catch(err) {
            return err;
        }
    }

    async logout() {
        try {
            return await requester.post(`/user/${APP_KEY}/_logout`);
        } catch(err) {
            return err; 
        }
    }

    async isAdmin(userId) {
        try {
            return await requester.get(`/user/${APP_KEY}/${userId}/roles/${ADMIN_ROLE_ID}`);
        } catch(err) {
            return err; 
        }
    }
}

export default AuthenticationService;