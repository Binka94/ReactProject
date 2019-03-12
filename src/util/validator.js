export default (() => {
    return {
        validateInput: (input, options) => {
            const name = input.name;
            const value = input.value;

            let error = null;
            
            if(options.hasOwnProperty('isRequired') && options.isRequired && value.trim().length === 0) {
                error = options.isRequiredMessage || `Field '${name}' is required!`;
            }
            
            if(options.hasOwnProperty('minLength') && value.length < options.minLength) {
                error = options.minLengthMessage || `Field '${name}' must be at least ${options.minLength} characters long!`;
            }

            if(options.hasOwnProperty('maxLength') && value.length > options.maxLength) {
                error = options.maxLengthMessage || `Field '${name}' must be less than or equal ${options.maxLength} characters long!`;
            }
    
            if(error) {    
                input.classList.add('invalid');            
                input.classList.remove('valid');            
                document.getElementById(`for-${name}`).dataset.error = error;
            } else {
                input.classList.add('valid');          
                input.classList.remove('invalid');     
                document.getElementById(`for-${name}`).dataset.success = "It's Ok";
            }
        }
    }
})();