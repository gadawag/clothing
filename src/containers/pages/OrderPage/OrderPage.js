import React from 'react';
import Order from '../../../components/Order/Order';
import classes from './OrderPage.module.scss';

const OrderPage = () => {
    return (
        <div className={classes.OrderPage}>
            <Order />
        </div>
    );
}

export default OrderPage;