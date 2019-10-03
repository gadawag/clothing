import React from 'react';
import AdminModal from '../AdminModal/AdminModal';
import ProductForm from './ProductForm/ProductForm';
import {connect} from 'react-redux';
import axios from '../../../../utilities/axios';
import {saveProduct} from '../../../../store/actions/adminAction';
import {errorHelper} from '../../../../utilities/utilities';
import ProductContent from './ProductContent/ProductContent';
import moment from 'moment';
import classes from './AdminProduct.module.scss';

class AdminProduct extends React.Component {
    constructor() {
        super();
        this.state = {
            showModal: false,
            type: null,
            productId: null,
            error: []
        }
        this.openModalHandler = this.openModalHandler.bind(this);
        this.closeModalHandler = this.closeModalHandler.bind(this);
        this.fetchProduct = this.fetchProduct.bind(this);
    }

    componentDidMount() {
        this._flag = true;
        this.fetchProduct();
    }

    componentWillUnmount() {
        this._flag = false;
    }

    openModalHandler(type, productId) {
        this.setState({
            showModal: true, 
            type,
            productId
        });
    }

    closeModalHandler(e) {
        // dataset.role = data-role in div
        if (e.target.dataset.role) {
            this.setState({
                showModal: false,
                type: null,
                categoryId: null
            });
        }
    }

    showError(e) {
        this.setState({
            error: [...e],
            loading: false
        });
    }

    async fetchProduct(hasNew = false) {
        if (this.props.product.length < 1 || hasNew) {
            try {
                const response = await axios.get('/admin/product', {
                    headers: {
                        Authorization: `Bearer ${this.props.adminToken}`
                    }
                });
        
                if (this._flag) {
                    // Format our product object
                    const newProductArr = response.data.product.map(e => {
                        return {
                            _id: e._id,
                            title: e.title,
                            category: e.categoryId.title,
                            categoryId: e.categoryId._id,
                            price: e.price,
                            image: e.image,
                            description: e.description,
                            createdAt: e.createdAt
                        }
                    });

                    this.setState({error: []});

                    this.props.saveProduct(newProductArr);
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
    }  

    displayProduct() {
        const products = this.props.product.map((e, i) => (
            <tr key={i}>
                <td>{e.title}</td>
                <td>{e.category}</td>
                <td>{moment(new Date(e.createdAt)).format('MMMM Do YYYY')}</td>
                <td>
                    <button onClick={this.openModalHandler.bind(this, 'edit', e._id)}>View/Edit</button>
                    <button>Delete</button>
                </td>
            </tr>
        ));

        return  <ProductContent products={products} />;
    }

    render() {
        const error = errorHelper(this.state);

        return (
            <div className={classes.AdminProduct}>
                <h1>Products</h1>
                <div className={classes.AdminProduct__content}>
                    <button className={classes.AdminProduct__btn} onClick={this.openModalHandler.bind(this, 'add', null)}>Create New</button>

                    {error}

                    {this.displayProduct()}

                    {this.state.showModal && 
                        <AdminModal 
                            close={this.closeModalHandler} 
                            content={<ProductForm
                                        action={this.fetchProduct} 
                                        type={this.state.type} 
                                        productId={this.state.productId}
                                        title={this.state.type === 'add' ? 'Create Product' : 'Update Product'} />} />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        adminToken: state.admin.token,
        product: state.admin.product
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveProduct: (product) => {dispatch(saveProduct(product))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminProduct);