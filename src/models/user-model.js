export default {
    defaultState: {
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        email: '',
        username: '',
        password: '',  
        confirmPassword: '',
    },
    validationOptions: {
        firstName: {
            required: true,
            minLength: 3,
            maxLength: 20,
        },
        lastName: {
            required: true,
            minLength: 3,
            maxLength: 20,
        },
        address: {
            required: true,
            minLength: 3,
            maxLength: 60,
        },
        phoneNumber: {
            required: true,
            minLength: 6,
            maxLength: 12,
            regExp: /^\d+$/,
        },
        email: {
            required: true,
            minLength: 3,
            maxLength: 20,
            regExp: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
        },
        username: {
            required: true,
            minLength: 6,
            maxLength: 12,
        },
        password: {
            required: true,
            minLength: 6,
            maxLength: 30,
            regExp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/,
        },
    }
};