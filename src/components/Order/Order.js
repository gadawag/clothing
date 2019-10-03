import React from 'react';
import Loader from '../Loader/Loader';
import axios from '../../utilities/axios';
import {errorHelper} from '../../utilities/utilities';
import {connect} from 'react-redux';
import moment from 'moment';
import classes from './Order.module.scss';

class Order extends React.Component {
    constructor() {
        super();
        this.state = {
            order: [],
            loading: false,
            error: []
        }
    }

    componentDidMount() {
        this._flag = true;
        this.fetchOrderHistory();
    }

    componentWillUnmount() {
        this._flag = false;
    }

    showError(e) {
        this.setState({
            error: [...e],
            loading: false
        });
    }

    async fetchOrderHistory() {
        this.setState({loading: true});

        try {
            const response = await axios.get('/order-history', {
                headers: {
                    Authorization: `Bearer ${this.props.token}`
                }
            });

            if (this._flag) {
                this.setState({
                    order: response.data.order,
                    loading: false
                });
            }
        } catch (e) {
            // Show server validation error
            if (e.response) {
                return this.showError(e.response.data.error);
            }

            // Show internal error if server is not responding
            return this.showError([e.message]);
        }
    }

    displayOrders() {
        return this.state.order.map(o => {
            return (
                <div key={o._id} className={classes.Order__item}>
                    <h2 className={classes.Order__id}>Order: {o.stripeOrderId} <span>{moment(o.createdAt).format('MMMM Do YYYY')}</span></h2>
                    <ul className={classes.Order__list}>
                        {o.order.map(i => 
                            <li className={classes.Order__listitem} key={i._id}>
                                <p><strong>Item: </strong>{i.productName}</p>
                                <p><strong>Price: </strong>{i.productPrice}</p>
                                <p><strong>Quantity: </strong>{i.quantity}</p>
                            </li>)
                        }
                        <li className={`${classes.Order__listitem} ${classes.Order__listitem_do}`}>Total: <span>${o.totalAmount}</span></li>
                    </ul>
                </div>
            );
        });
    }

    render() {
        let content = <Loader />;
        const error = errorHelper(this.state);

        if (!this.state.loading) {
            content = (
                <div className={classes.Order}>
                    <h1 className={classes.Order__title}>Order history</h1>
                    {error}

                    <div className={classes.Order__content}>
                        {this.displayOrders()}
                    </div>
                </div>
            );
        }

        return content;
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token
    }
}

export default connect(mapStateToProps)(Order);