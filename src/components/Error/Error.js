import React from 'react';
import classes from './Error.module.scss';

const Error = ({error}) => {
    return (
        <div className={classes.Error}>
            <p>{error}</p>
        </div>
    );
}

export default Error;