import React from 'react';
import Categories from '../../../components/Categories/Categories';
import classes from './HomePage.module.scss';

const HomePage = () => {
    return (
        <div className={classes.HomePage}>
            <Categories />
        </div>
    );
}

export default HomePage;