import React, { Component } from 'react';
import {loginSignupValidator, errorHelper, saveUserToStorage, registerExpiraton, saveCartFromStorageToDB, cartToStore} from '../../../utilities/utilities';
import axios from '../../../utilities/axios';
import {connect} from 'react-redux';
import {authorizeUser, logout} from '../../../store/actions/authAction';
import {withRouter} from 'react-router-dom';
import {saveCartToStore} from '../../../store/actions/cartAction';
import classes from './LoginForm.module.scss';

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            error: [],
            loading: false
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    showError(e) {
        this.setState({
            error: [...e],
            loading: false
        });
    }

    async submitHandler(e) {
        this.setState({loading: true});

        try {
            e.preventDefault();

            const error = loginSignupValidator(this.state);

            if (error.length > 0) {
                return this.showError(error);
            }

            const result = await axios.post('/signin', {
                email: this.state.email,
                password: this.state.password
            });

            const token = result.data.token;
            const name = result.data.name;

            // Save the cart from storage to user's cart
            await saveCartFromStorageToDB(token);

            await cartToStore(true, token, this.props.storeCart);

            // Save details and expiration in localStorage
            saveUserToStorage(token, name);

            // Register a timeout to logout the user
            registerExpiraton(this.props.logoutUser);            

            // Save to our redux store
            this.props.authUser(token, name);

            // Redirect to homepage
            this.props.history.push('/');

        } catch (e) {
            // Show server validation error
            if (e.response) {
                return this.showError(e.response.data.error);
            }

            // Show internal error if server is not responding
            return this.showError([e.message]);
        }
    }

    render() {
        const error = errorHelper(this.state);

        return (
            <form className={classes.LoginForm} onSubmit={this.submitHandler}>
                <input 
                    className={classes.LoginForm__input} 
                    type="text" 
                    name="email"
                    placeholder="email" 
                    value={this.state.email}
                    onChange={this.changeHandler} />

                <input 
                    className={classes.LoginForm__input} 
                    type="password" 
                    name="password"
                    placeholder="password" 
                    value={this.state.password}
                    onChange={this.changeHandler} />
                    
                <button className={classes.LoginForm__btn} type="submit" disabled={this.state.loading ? 'disabled' : ''}>
                    {this.state.loading ? 'Logging in...' : 'Login'}
                </button>

                {error}
            </form>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        authUser: (token, name) => dispatch(authorizeUser(token, name)),
        logoutUser: () => dispatch(logout()),
        storeCart: (cart) => {dispatch(saveCartToStore(cart))}
    }
}

export default connect(null, mapDispatchToProps)(withRouter(LoginForm));