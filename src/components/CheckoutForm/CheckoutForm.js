import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import axios from '../../utilities/axios';
import {cartToStore} from '../../utilities/utilities';
import {connect} from 'react-redux';
import {saveCartToStore} from '../../store/actions/cartAction';
import classes from './CheckoutForm.module.scss';

class CheckoutForm extends React.Component {
    constructor() {
        super();
        this.state = {
            done: false,
            loading: false
        }
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this._flag = true;
    }

    componentWillUnmount() {
        this._flag = false;
    }

    async submit() {
        this.setState({loading: true});

        try {
            let {token} = await this.props.stripe.createToken();

            if (token) {
                const response = await axios.post('/charge', {tokenId: token.id}, {
                    headers: {
                        Authorization: `Bearer ${this.props.token}`
                    }
                });

                // Copy the cart into our store either from storage or db
                await cartToStore(this.props.isAuth, this.props.token, this.props.storeCart);

                if (response.status === 200 && this._flag) {
                    this.setState({
                        loading: false,
                        done: true
                    });
                }
            } else {
                this.setState({
                    loading: false
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        let content = (
            <>
                <p style={{fontSize: '1.6rem', fontWeight: 'bold'}}>
                    Try it out using the test card number 4242 4242 4242 4242, <br /> A random three-digit CVC number, <br /> Any expiration date in the future, <br /> And a random five-digit U.S. ZIP code.
                </p>
                <CardElement style={{base: {
                                        color: '#32325d',
                                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                                        fontSmoothing: 'antialiased',
                                        fontSize: '16px',
                                        '::placeholder': {
                                            color: '#aab7c4'
                                        }
                                    },
                                    invalid: {
                                        color: '#fa755a',
                                        iconColor: '#fa755a'
                                    }}} className={classes.CheckoutForm} />

                <button className={classes.CheckoutForm__btn} onClick={this.submit} disabled={this.state.loading ? 'disabled' : ''}>Purchase</button>
            </>
        );

        if (this.state.done) {
            content = <h1>Thank you for purchasing!</h1>;
        }

        return content;
      }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeCart: (cart) => {dispatch(saveCartToStore(cart))}
    }
}

export default connect(null, mapDispatchToProps)(injectStripe(CheckoutForm));
