import React from 'react';
import axios from '../../../../utilities/axios';
import {saveUserToStorage, registerExpiraton, errorHelper} from '../../../../utilities/utilities';
import {connect} from 'react-redux';
import {authorizeAdmin, logoutAdmin} from '../../../../store/actions/adminAction';
import {withRouter} from 'react-router-dom';
import classes from './AdminLogin.module.scss';

class AdminLogin extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
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

            const response = await axios.post('/admin-login', {
                username: this.state.username,
                password: this.state.password
            });

            const token = response.data.token;
            const name = response.data.name;

            // Save details and expiration in localStorage
            saveUserToStorage(token, name, true); // true is for admin

            // Register a timeout to logout the user
            registerExpiraton(this.props.logoutAdmin, true); // true is for admin     

            // Save to our redux store
            this.props.authAdmin(token, name);

            // Redirect to path given
            this.props.history.push(this.props.path);

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
            <form className={classes.AdminLogin} onSubmit={this.submitHandler} >
                <h2 className={classes.AdminLogin__title}>Admin Portal</h2>
                <p style={{fontSize: '2rem', marginBottom: '1rem', textAlign: 'center'}}>CATEGORIES AND PRODUCTS MANAGER</p>
                <input 
                    className={classes.AdminLogin__input}
                    type="text"
                    name="username"
                    placeholder="Username"
                    autoComplete="off"
                    onChange={this.changeHandler} />
    
                <input 
                    className={classes.AdminLogin__input}
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={this.changeHandler}/>
    
                <button className={classes.AdminLogin__btn} type="submit" disabled={this.state.loading ? 'disabled' : ''}>
                    {this.state.loading ? 'Logging in...' : 'Login'}
                    </button>

                {error}
            </form>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        authAdmin: (token, name) => dispatch(authorizeAdmin(token, name)),
        logoutAdmin: () => dispatch(logoutAdmin())
    }
}


export default connect(null, mapDispatchToProps)(withRouter(AdminLogin));