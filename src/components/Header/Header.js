import React from 'react';
import Navigation from '../Navigation/Navigation';
import logo from '../../assets/logo.png';
import classes from './Header.module.scss';

const Header = (props) => {
    return (
        <header className={classes.Header}>
            <div className={classes.Header__banner}>
                <img className={classes.Header__img} src={logo} alt="Logo"/>
            </div>
            {/* <h1 className={classes.Header__title}>Shoptop</h1> */}
            <Navigation />
        </header>
    );
}

export default Header;