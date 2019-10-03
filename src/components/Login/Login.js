import React from 'react';
import LoginForm from './LoginForm/LoginForm';
import classes from './Login.module.scss';

const Login = () => {
    return (
        <div className={classes.Login}>
            <h3 className={classes.Login__title}>Login</h3>
            <LoginForm />
        </div>
    );
}

export default Login;