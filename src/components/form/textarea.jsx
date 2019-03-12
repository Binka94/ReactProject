import React from 'react';

function Textarea(props) {
    const {
        name,
        label,
        value,
        className,
        labelClassName,
        placeholder,
        onChangeHandler,
    } = props;

    return(
        <div className={`col ${className}`}>
            <div className="row">
                <div className="input-field col s12">
                    <textarea 
                        id="textarea1" 
                        name={name}
                        value={value}
                        placeholder={placeholder}
                        className="materialize-textarea" 
                        onChange={onChangeHandler}>
                    </textarea>
                    <label htmlFor="textarea1" className={labelClassName}>{label}</label>
                </div>
            </div>
        </div>
    );
}

export default Textarea;