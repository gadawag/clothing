import React from 'react';
import {connect} from 'react-redux';
import CartItem from './CartItem/CartItem';
import {withRouter} from 'react-router-dom';
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import AdminModal from '../../containers/pages/Admin/AdminModal/AdminModal';
import classes from './Cart.module.scss';

class Cart extends React.Component {
    constructor() {
        super();
        this.state = {
            totalPrice: 0,
            checkout: false
        }
        this.checkoutHandler = this.checkoutHandler.bind(this);
        this.cancelCheckout = this.cancelCheckout.bind(this);
    }

    componentDidMount() {
        this._flag = true;
        this.calculateTotal();
    }

    componentDidUpdate(prevProps, prevState) {
        // If the cart in our store changes, re-calculate the total
        if (prevProps.cart !== this.props.cart) {
            this.calculateTotal();
        }
    }

    componentWillUnmount() {
        this._flag = false;
    }

    displayCart() {
        if (this.props.cart.length > 0) {
            return this.props.cart.map(p => <CartItem key={p._id} product={p} />);
        }

        return <p style={{fontSize: '2rem', textAlign: 'center', fontWeight: 'bold', color: 'red'}}>YOUR CART IS EMPTY</p>;
    }

    calculateTotal() {
        let total = 0;
        this.props.cart.forEach(p => {
            total += parseFloat(p.price) * p.quantity;
        });
        total = total.toLocaleString();

        if (this._flag) {
            this.setState({totalPrice: total});
        }
    }

    checkoutHandler() {
        if (this.props.isAuth) {
            return this.setState({checkout: true});
        }

        this.props.history.push('/login');
    }

    cancelCheckout() {
        this.setState({checkout: false});
    }

    render() {
        return (
            <div className={classes.Cart}>
                <h1 className={classes.Cart__title}>Cart Page</h1>
                <div className={classes.Cart__labels}>
                    <div><p>Product</p></div>
                    <div><p>Price</p></div>
                    <div><p>Quantity</p></div>
                    <div><p>Amount</p></div>
                    <div><p>Actions</p></div>
                </div>
                <div className={classes.Cart__content}>
                    {this.displayCart()}
                </div>
                {this.props.cart.length > 0 && 
                    <div className={classes.Cart__checkout}>
                        <p className={classes.Cart__totalamount}>Total Amount: <span>${this.state.totalPrice}</span></p>
                        <div className={classes.Cart__btnwrap}>
                            <button className={classes.Cart__btn} onClick={this.checkoutHandler}>Checkout</button>
                        </div>
                    </div>
                }
                {this.state.checkout && 
                    <StripeProvider apiKey="pk_test_XC5J9txPy1emexwYaFVNStS700b3ooZhEX">
                        <AdminModal 
                            content={<div className={classes.Cart__payment}>
                                        <h1 style={{color: '#8e7dd0', fontSize: '2rem'}}>Checkout with Stripe</h1>
                                        <Elements>
                                            <CheckoutForm isAuth={this.props.isAuth} token={this.props.token} />
                                        </Elements>
                                    </div>}
                            close={this.cancelCheckout} />
                    </StripeProvider>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.token !== '',
        token: state.auth.token,
        cart: state.cart.cart
    }
}

export default connect(mapStateToProps)(withRouter(Cart));