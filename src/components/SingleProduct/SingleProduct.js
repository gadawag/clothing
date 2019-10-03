import React from 'react';
import {getUrl, addToCart, cartToStore} from '../../utilities/utilities';
import {connect} from 'react-redux';
import {saveCartToStore} from '../../store/actions/cartAction';
import mySprite from '../../assets/sprite.svg';
import classes from './SingleProduct.module.scss';

class SingleProduct extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            notification: false,
            notificationMessage: ''
        }
        this.addToCartHandler = this.addToCartHandler.bind(this);
    }
    
    componentDidMount() {
        this._flag = true;
        this._timeout = null;
    }

    componentWillUnmount() {
        this._flag = false;
        clearTimeout(this._timeout);
    }

    async addToCartHandler() {
        this.setState({loading: true});

        await addToCart(this.props.product, this.props.isAuth, this.props.token);

        // Copy the cart into our store either from storage or db
        await cartToStore(this.props.isAuth, this.props.token, this.props.storeCart);

        if (this._flag) {
            this.setState({
                loading: false,
                notification: true,
                notificationMessage: 'This item was added to your cart'
            });
            
            // Clear the timeout for prev notification in-case there is any, then register a new clear
            clearTimeout(this._timeout);
            this.clearNotification();
        }
    }

    clearNotification() {
        this._timeout = setTimeout(() => {
            this.setState({
                notification: false,
                notificationMessage: ''
            });
        }, 3000);
    }

    render() {
        return (
            <>
                <div className={classes.SingleProduct}>
                    <div className={classes.SingleProduct__content}>
                        <div className={classes.SingleProduct__highlight}>
                            <figure className={classes.SingleProduct__fig}>
                                <img className={classes.SingleProduct__image} src={`${getUrl()}/${this.props.product.image}`} alt={this.props.product.slug} />
                            </figure>
                        </div>
                        <div className={classes.SingleProduct__desc}>
                            <h1 className={classes.SingleProduct__title}>{this.props.product.title}</h1>
                            <p>{this.props.product.description}</p>
                            <div className={classes.SingleProduct__actions}>
                                {this.state.notification && 
                                    <p className={classes.SingleProduct__notif}>{this.state.notificationMessage}</p>
                                }
                                <button className={classes.SingleProduct__button} onClick={this.addToCartHandler} disabled={this.state.loading ? 'disabled' : ''}>
                                    <svg className={classes.SingleProduct__icon}><use xlinkHref={`${mySprite}#icon-cart`}></use></svg>
                                    Add to cart | ${parseFloat(this.props.product.price).toLocaleString()}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct);