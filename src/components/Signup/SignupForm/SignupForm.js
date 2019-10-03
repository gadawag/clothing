import React, { Component } from 'react';
import {loginSignupValidator, saveUserToStorage, registerExpiraton, errorHelper, saveCartFromStorageToDB, cartToStore} from '../../../utilities/utilities';
import axios from '../../../utilities/axios';
import {connect} from 'react-redux';
import {authorizeUser, logout} from '../../../store/actions/authAction';
import {withRouter} from 'react-router-dom';
import {saveCartToStore} from '../../../store/actions/cartAction';
import classes from './SignupForm.module.scss';

class SignupForm extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            name: '',
            password: '',
            confirm: '',
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
            const error = loginSignupValidator(this.state, 'signup');

            if (error.length > 0) {
                return this.showError(error);
            }

            // I passed all the details to provide a backend checking
            const response = await axios.post('/signup', {
                email: this.state.email,
                name: this.state.name,
                password: this.state.password,
                confirm: this.state.confirm
            });

            const token = response.data.token;
            const name = response.data.name;

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
        const errors = errorHelper(this.state);

        return (
            <form className={classes.SignupForm} onSubmit={this.submitHandler}>
                <input 
                    className={classes.SignupForm__input} 
                    type="text" 
                    name="email"
                    value={this.state.email}
                    placeholder="email"
                    onChange={this.changeHandler} />
                
                <input 
                    className={classes.SignupForm__input} 
                    type="text" 
                    name="name"
                    value={this.state.name}
                    placeholder="name"
                    onChange={this.changeHandler} />

                <input 
                    className={classes.SignupForm__input} 
                    type="password" 
                    name="password"
                    value={this.state.password}
                    placeholder="password"
                    onChange={this.changeHandler} />

                <input 
                    className={classes.SignupForm__input} 
                    type="password" 
                    name="confirm"
                    value={this.state.confirm}
                    placeholder="confirm password"
                    onChange={this.changeHandler} />

                <button className={classes.SignupForm__btn} type="submit" disabled={this.state.loading ? 'disabled' : ''}>
                    {this.state.loading ? 'Signing up...' : 'Sign up'}
                </button>

                {errors}
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

export default connect(null, mapDispatchToProps)(withRouter(SignupForm));