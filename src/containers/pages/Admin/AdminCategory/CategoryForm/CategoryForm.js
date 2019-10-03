import React from 'react';
import {imageHandler, errorHelper, getUrl} from '../../../../../utilities/utilities';
import {connect} from 'react-redux';
import axios from '../../../../../utilities/axios';
import classes from './CategoryForm.module.scss';

class CategoryForm extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '',
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
        if (this.props.type === 'edit') {
            this.getCategory();
        }
    }

    getCategory() {
        if (this.props.categoryId !== null && this.props.type === 'edit') {
            let selectedCategory = this.props.category.filter(e => e._id === this.props.categoryId);

            this.setState({
                title: selectedCategory[0].title,
                imageBlob: `${getUrl()}/${selectedCategory[0].image}`
            });
        }
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
            formData.append('categoryImage', this.state.image);

            let response;

            if (this.props.type !== 'edit') {
                response = await axios.post('/category/create', formData, {
                    headers: {
                        Authorization: `Bearer ${this.props.adminToken}`
                    }
                });

                // Clear the placeholder of input file
                this.file.current.value = '';

                this.setState({
                    title: '',
                    image: '',
                    imageBlob: '',
                    success: response.data.message,
                    error: [],
                    loading: false
                });
            } else {
                formData.append('categoryId', this.props.categoryId);

                response = await axios.patch('/category/update', formData, {
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

    render() { 
        const imageSrc = this.state.imageBlob;
        
        let disabled = '';
        if (this.state.loading ||  this.state.error.length > 0) {
            disabled = 'disabled';
        }

        const error = errorHelper(this.state);

        return (
            <form className={classes.CategoryForm} onSubmit={this.submitHandler}>
                <p className={classes.CategoryForm__title}>{this.props.title}</p>
                <input 
                    className={classes.CategoryForm__input}
                    type="text"
                    name="title"
                    value={this.state.title}
                    onChange={this.changeHandler}
                    placeholder="Title"
                     />

                <input 
                    className={classes.CategoryForm__input}
                    type="file"
                    name="image"
                    accept="image/*"
                    ref={this.file}
                    onChange={this.changeHandler}
                     />

                {imageSrc && <img className={classes.CategoryForm__img} src={imageSrc} alt="preview"/>}

                <button className={classes.CategoryForm__btn} disabled={disabled}>
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
        category: state.admin.category
    }
}

export default connect(mapStateToProps)(CategoryForm);