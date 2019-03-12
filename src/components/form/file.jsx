import React from 'react';

function File(props) {
    return(
        <form action="#" className={`col ${props.className}`}>
            <div className="file-field input-field">
            <div className="btn">
                <span>{props.label}</span>
                <input type="file" name={props.name} multiple />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" placeholder={props.placeholder} />
            </div>
            </div>
        </form>
    );
}

export default File;