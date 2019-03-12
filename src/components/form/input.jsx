import React from 'react';

function Input(props) {
    const {
        name,
        label,
        type,
        value,
        className,
        onChangeHandler,
    } = props;

    return (
        <div className={`input-field col ${className}`}>
            <input 
                id={name} 
                name={name} 
                type={type} 
                value={value} 
                className='validate'
                onChange={onChangeHandler} 
                onInput={onChangeHandler} />
                
            <label htmlFor={name} className="">{label}</label>
            <span id={`for-${name}`} className="helper-text"></span>
        </div>
    );
}


export default Input;