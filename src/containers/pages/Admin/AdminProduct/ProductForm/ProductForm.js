import React from 'react';
import {imageHandler, errorHelper, getUrl} from '../../../../../utilities/utilities';
import axios from '../../../../../utilities/axios';
import {connect} from 'react-redux';
import {saveCategory} from '../../../../../store/actions/adminAction';
import classes from './ProductForm.module.scss';

class ProductForm extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '',
            category: '',
            price: '',
            description: '',
            image: '',
            imageBlob: '',
            error: [],
            success: '',
            loading: false
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.file = React.createRef();
    }

    componentDidMount() {
        this._flag = true;
        this.fetchCategory();
        if (this.props.type === 'edit') {
            this.getProduct();
        }
    }

    componentWillUnmount() {
        this._flag = false;
    }

    changeHandler(e) {
        if (e.target.name === 'image') {
            return imageHandler(e, this);
        }

        this.setState({
            [e.target.name]: e.target.value,
            error: []
        });
    }   

    showError(e) {
        this.setState({
            error: [...e],
            loading: false
        });
    }

    async submitHandler(e) {
        this.setState({loading: true});

        try {
            e.preventDefault();

            const formData = new FormData();
            formData.append('title', this.state.title);
            formData.append('category', this.state.category);
            formData.append('price', this.state.price);
            formData.append('description', this.state.description);
            formData.append('productImage', this.state.image);

            if (this.props.type !== 'edit') {
                const response = await axios.post('/product/create', formData, {
                    headers: {
                        Authorization: `Bearer ${this.props.adminToken}`
                    }
                });
                
                // Clear the placeholder of input file
                this.file.current.value = '';
    
                this.setState({
                    title: '',
                    image: '',
                    category: '',
                    price: '',
                    description: '',
                    imageBlob: '',
                    success: response.data.message,
                    error: [],
                    loading: false
                });
            } else {
                formData.append('productId', this.props.productId);

                const response = await axios.patch('/product/update', formData, {
                    headers: {
                        Authorization: `Bearer ${this.props.adminToken}`
                    }
                });

                this.setState({
                    success: response.data.message,
                    error: [],
                    loading: false
                });
            }

            // Callback after add / edit is done
            this.props.action(true);

        } catch (e) {
            // Show server validation error
            if (e.response) {
                return this.showError(e.response.data.error);
            }

            // Show internal error if server is not responding
            return this.showError([e.message]);
        }
    }

    async fetchCategory() {
        if (this.props.category.length < 1) {
            try {
                const response = await axios.get('/admin/category', {
                    headers: {
                        Authorization: `Bearer ${this.props.adminToken}`
                    }
                });
        
                if (this._flag) {
                    this.setState({error: []});

                    this.props.saveCategory(response.data.categories);
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

    getProduct() {
        if (this.props.productId !== null && this.props.type === 'edit') {
            let selectedProduct = this.props.product.filter(e => e._id === this.props.productId);

            this.setState({
                title: selectedProduct[0].title,
                category: selectedProduct[0].categoryId,
                price: selectedProduct[0].price,
                description: selectedProduct[0].description,
                imageBlob: `${getUrl()}/${selectedProduct[0].image}`
            });
        }
    }

    render() { 
        const imageSrc = this.state.imageBlob;

        let disabled = '';
        if (this.state.loading ||  this.state.error.length > 0) {
            disabled = 'disabled';
        }

        const error = errorHelper(this.state);

        return (
            <form className={classes.ProductForm} onSubmit={this.submitHandler}>
                <p className={classes.ProductForm__title}>{this.props.title}</p>
                <input 
                    className={classes.ProductForm__input}
                    type="text"
                    name="title"
                    value={this.state.title}
                    onChange={this.changeHandler}
                    placeholder="Title"
                     />

                <select 
                   className={classes.ProductForm__input}
                   name="category"
                   value={this.state.category}
                   onChange={this.changeHandler}>
                       <option value="" disabled>- Select Category -</option>
                       {this.props.category.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                </select>

                <input 
                    className={classes.ProductForm__input}
                    type="number"
                    name="price"
                    value={this.state.price}
                    onChange={this.changeHandler}
                    placeholder="Price"
                     />

                <textarea 
                    className={classes.ProductForm__input}
                    name="description"
                    value={this.state.description}
                    onChange={this.changeHandler}
                    rows="4"
                    placeholder="Description"></textarea>

                <input 
                    className={classes.ProductForm__input}
                    type="file"
                    name="image"
                    accept="image/*"
                    ref={this.file}
                    onChange={this.changeHandler}
                     />

                {imageSrc && <img className={classes.ProductForm__img} src={imageSrc} alt="preview"/>}

                <button className={classes.ProductForm__btn} disabled={disabled}>
                    {this.props.type === 'add' ? 'Create' : 'Update'}
                </button>

                {this.state.success && <p style={{color: 'green', fontSize: '1.6rem', fontWeight: '600', marginTop: '1rem'}}>{this.state.success}</p>}

                {error}
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        adminToken: state.admin.token,
        category: state.admin.category,
        product: state.admin.product
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveCategory: (category) => {dispatch(saveCategory(category))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductForm);