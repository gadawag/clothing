import React from 'react';
import SignupForm from './SignupForm/SignupForm';
import classes from './Signup.module.scss';

const Signup = () => {
    return (
        <div className={classes.Signup}>
            <h3 className={classes.Signup__title}>Signup</h3>
            <SignupForm />
        </div>
    );
}

export default Signup;