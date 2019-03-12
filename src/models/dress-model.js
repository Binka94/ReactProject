export default {
    defaultState: {
        color: '',
        model: '',
        description: '',
    },
    validationOptions: {
        model: {
            required: true,
            minLength: 3,
            maxLength: 30, 
        },
        color: {
            required: true,
            minLength: 2,
            maxLength: 12, 
        },
        description: {
            required: true,
            minLength: 10,
            maxLength: 2000,
        },
    }
};