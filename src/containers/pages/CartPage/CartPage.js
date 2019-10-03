import React from 'react';
import Cart from '../../../components/Cart/Cart';
import classes from './CartPage.module.scss';

class CartPage extends React.Component {
    render() {
        return (
            <div className={classes.CartPage}>
                <Cart />
            </div>
        );
    }
}

export default CartPage