import React from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from '../../store/actions/authAction';
import {deleteUserToStorage, cancelTimeout} from '../../utilities/utilities';
import classes from './Navigation.module.scss';

class Navigation extends React.Component {
    constructor() {
        super();
        this.logoutHandler = this.logoutHandler.bind(this);
    }

    logoutHandler() {
        // Cancel the logout timeout in 1 hour / remaining time
        cancelTimeout();

        // Delete user from localStorage
        deleteUserToStorage();

        // Delete user from store
        this.props.logoutUser();

        // Redirect
        this.props.history.push('/');
    }

    render() {
        return (
            <nav className={classes.Nav}>
                <ul className={classes.Nav__list}>
                    <li className={classes.Nav__item}><NavLink exact to="/" className={classes.Nav__link} activeClassName={classes.active}>Shop</NavLink></li>
                    <li className={classes.Nav__item}><NavLink exact to="/cart" className={classes.Nav__link} activeClassName={classes.active}>Cart</NavLink></li>
                    {!this.props.isAuth && 
                        <li className={classes.Nav__item}><NavLink exact to="/login" className={classes.Nav__link} activeClassName={classes.active}>Login</NavLink></li>
                    }
                    {this.props.isAuth && 
                        <>
                            <li className={classes.Nav__item}>
                                <NavLink exact to="/orders" className={classes.Nav__link} activeClassName={classes.active}>Orders</NavLink>
                            </li>
                            <li className={classes.Nav__item}>
                                <button onClick={this.logoutHandler} className={classes.Nav__link}>Logout</button>
                            </li>
                        </>
                    }
                    <li className={classes.Nav__item}><NavLink to="/admin" className={classes.Nav__link} activeClassName={classes.active}>Admin</NavLink></li>
                </ul>
            </nav>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.token !== ''
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logoutUser: () => dispatch(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navigation));