export default {
    defaultState: {
        name: '',
        description: '',
    },
    validationOptions: {
        name: {
            required: true,
            minLength: 3,
            maxLength: 20,
        },
        description: {
            required: true,
            minLength: 10,
            maxLength: 2000,
        },        
    }
};