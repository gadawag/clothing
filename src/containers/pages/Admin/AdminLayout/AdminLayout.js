import React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {logoutAdmin} from '../../../../store/actions/adminAction';
import {withRouter} from 'react-router-dom';
import {cancelTimeout, deleteAdminToStorage} from '../../../../utilities/utilities';
import classes from './AdminLayout.module.scss';

class AdminLayout extends React.Component {
    constructor() {
        super();
        this.logoutHandler = this.logoutHandler.bind(this);
    }

    logoutHandler() {
        // Cancel the logout timeout in 1 hour / remaining time
        cancelTimeout(true); // true for admin

        // Delete user from localStorage
        deleteAdminToStorage(true);

        // Delete user from store
        this.props.logoutAdmin();

        // Redirect
        this.props.history.push('/admin');
    }

    render() {
        return (
            <div className={classes.AdminLayout}>
                <nav className={classes.AdminLayout__nav}>
                    <ul className={classes.AdminLayout__list}>
                        <li className={classes.AdminLayout__item}>
                            <NavLink to="/admin" exact className={classes.AdminLayout__link} activeClassName={classes.active}>Dashboard</NavLink>
                        </li>
                        <li className={classes.AdminLayout__item}>
                            <NavLink to="/admin/products" className={classes.AdminLayout__link} activeClassName={classes.active}>Products</NavLink>
                        </li>
                        <li className={classes.AdminLayout__item}>
                            <NavLink to="/admin/categories" className={classes.AdminLayout__link} activeClassName={classes.active}>Categories</NavLink>
                        </li>
                        <li className={classes.AdminLayout__item}>
                            <button className={classes.AdminLayout__btn} onClick={this.logoutHandler}>Logout</button>
                        </li>
                    </ul>
                </nav>
                <div className={classes.AdminLayout__content}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      logoutAdmin: () => dispatch(logoutAdmin())
    }
}

export default connect(null, mapDispatchToProps)(withRouter(AdminLayout));