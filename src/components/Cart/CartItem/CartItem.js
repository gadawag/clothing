import React from 'react';
import {getUrl, addToCart, cartToStore, decreaseToCart, removeToCart} from '../../../utilities/utilities';
import {connect} from 'react-redux';
import {saveCartToStore} from '../../../store/actions/cartAction';
import classes from './CartItem.module.scss';

class CartItem extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false
        }
        this.incHandler = this.incHandler.bind(this);
        this.decHandler = this.decHandler.bind(this);
        this.removeHandler = this.removeHandler.bind(this);
    }

    componentDidMount() {
        this._flag = true;
    }

    componentWillUnmount() {
        this._flag = false;
    }

    calcTotal() {
        const price = parseFloat(this.props.product.price);
        const quantity = parseFloat(this.props.product.quantity);
        return (price * quantity).toLocaleString();
    }

    async incHandler() {
        this.setState({loading: true});

        await addToCart(this.props.product, this.props.isAuth, this.props.token);

        await cartToStore(this.props.isAuth, this.props.token, this.props.storeCart);

        this.setState({loading: false});
    }

    async decHandler() {
        this.setState({loading: true});
        
        await decreaseToCart(this.props.product._id, this.props.isAuth, this.props.token);

        await cartToStore(this.props.isAuth, this.props.token, this.props.storeCart);

        // I used flag here becase when the quantity drops to 0, this component will unmount
        if (this._flag) {
            this.setState({loading: false});
        }
    }

    async removeHandler() {
        this.setState({loading: true});

        await removeToCart(this.props.product._id, this.props.isAuth, this.props.token);

        await cartToStore(this.props.isAuth, this.props.token, this.props.storeCart);
    }

    render() {
        return (
            <div className={classes.CartItem}>
                <div className={classes.CartItem__img}>
                    <img className={classes.CartItem__image} src={`${getUrl()}/${this.props.product.image}`} alt={this.props.product.slug}/>
                </div>
                <h1 className={classes.CartItem__title}>{this.props.product.title}</h1>
                <p className={classes.CartItem__price}><strong>${parseFloat(this.props.product.price).toLocaleString()}</strong></p>
                <p className={classes.CartItem__quantity}><strong>{this.props.product.quantity}</strong></p>
                <p className={classes.CartItem__total}><strong>${this.calcTotal()}</strong></p>
                <div className={classes.CartItem__actions}>
                    <button 
                        className={`${classes.CartItem__btn} ${classes.CartItem__inc}`} 
                        disabled={this.state.loading ? 'disabled' : ''}
                        onClick={this.incHandler}>+</button>

                    <button 
                        className={`${classes.CartItem__btn} ${classes.CartItem__dec}`} 
                        disabled={this.state.loading ? 'disabled' : ''}
                        onClick={this.decHandler}>-</button>

                    <button 
                        className={`${classes.CartItem__btn} ${classes.CartItem__rem}`} 
                        disabled={this.state.loading ? 'disabled' : ''}
                        onClick={this.removeHandler}>x</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.token !== '',
        token: state.auth.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeCart: (cart) => {dispatch(saveCartToStore(cart))}
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CartItem);