import React from 'react';
import {withRouter} from 'react-router-dom';
import Loader from '../Loader/Loader';
import axios from '../../utilities/axios';
import {errorHelper} from '../../utilities/utilities';
import SingleProduct from '../SingleProduct/SingleProduct';
import classes from './CategoryProduct.module.scss';

class CategoryProduct extends React.Component {
    constructor() {
        super();
        this.state = {
            category: '',
            product: [],
            error: [],
            loading: false
        }
    }

    componentDidMount() {
        this._flag = true;
        this.fetchProductByCategory();
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

    async fetchProductByCategory() {
        this.setState({
            loading: true
        });
        
        try {
            const response = await axios.get(`/category-product/${this.props.match.params.slug}`);

            if (this._flag) {
                this.setState({
                    category: response.data.category,
                    product: response.data.product,
                    loading: false,
                    error: []
                });
            }

        } catch (e) {
            if (this._flag) {
                // Show server validation error
                if (e.response) {
                    return this.showError(e.response.data.error);
                }

                // Show internal error if server is not responding
                return this.showError([e.message]);
            }
        }
    }

    displayProducts() {
        return this.state.product.map(e => (
            <SingleProduct 
                key={e._id} 
                product={e} />
        ));
    }

    render() {
        let content = <Loader />;
        const error = errorHelper(this.state);

        if (!this.state.loading) {
            content = (
                <div className={classes.CategoryProduct}>
                    {error}
                    <h6 className={classes.CategoryProduct__title}>{this.state.category}</h6>
                    <div className={classes.CategoryProduct__content}>
                        {this.displayProducts()}
                    </div>
                </div>
            );
        }

        return content;
    }
}

export default withRouter(CategoryProduct);