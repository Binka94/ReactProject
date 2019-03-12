import React from 'react';

function Loading(props) {
    return (
        <div className={`progress ${props.innerColor}`}>
            <div className={`indeterminate ${props.outerColor}`}></div>
        </div>
    );
}

export default Loading;