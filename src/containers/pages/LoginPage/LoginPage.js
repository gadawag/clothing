import React from 'react';
import Login from '../../../components/Login/Login';
import Signup from '../../../components/Signup/Signup';
import classes from './LoginPage.module.scss';

const LoginPage = () => {
    return (
        <div className={classes.LoginPage}>
            <Login />
            <Signup />
        </div>
    );   
}

export default LoginPage;