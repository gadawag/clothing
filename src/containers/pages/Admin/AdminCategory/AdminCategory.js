import React from 'react';
import AdminModal from '../AdminModal/AdminModal';
import axios from '../../../../utilities/axios';
import moment from 'moment';
import {connect} from 'react-redux';
import {errorHelper} from '../../../../utilities/utilities';
import CategoryContent from './CategoryContent/CategoryContent';
import CategoryForm from './CategoryForm/CategoryForm';
import {saveCategory} from '../../../../store/actions/adminAction';
import classes from './AdminCategory.module.scss';

class AdminCategory extends React.Component {
    constructor () {
        super();
        this.state = {
            showModal: false,
            type: null,
            categoryId: null,
            error: []
        }
        this.openModalHandler = this.openModalHandler.bind(this);
        this.closeModalHandler = this.closeModalHandler.bind(this);
        this.fetchCategory = this.fetchCategory.bind(this);
    }

    componentDidMount() {
        this._flag = true;
        this.fetchCategory();
    }

    componentWillUnmount() {
        this._flag = false;
    }

    openModalHandler(type, categoryId) {
        this.setState({
            showModal: true, 
            type,
            categoryId
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

    async fetchCategory(hasNew = false) {
        if (this.props.category.length < 1 || hasNew) {
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

    displayCategory() {
        const categories = this.props.category.map((e, i) => (
            <tr key={i}>
                <td>{e.title}</td>
                <td>{moment(new Date(e.createdAt)).format('MMMM Do YYYY')}</td>
                <td>
                    <button onClick={this.openModalHandler.bind(this, 'edit', e._id)}>View/Edit</button>
                    <button>Delete</button>
                </td>
            </tr>
        ));

        return  <CategoryContent categories={categories} />;
    }

    render() {
        const error = errorHelper(this.state);
        return (
            <div className={classes.AdminCategory}>
                <h1>Categories</h1>
                <div className={classes.AdminCategory__content}>
                    <button className={classes.AdminCategory__btn} onClick={this.openModalHandler.bind(this, 'add', null)}>Create New</button>

                    {error}

                    {this.displayCategory()}

                    {this.state.showModal && 
                        <AdminModal 
                            close={this.closeModalHandler} 
                            content={<CategoryForm 
                                        action={this.fetchCategory} 
                                        type={this.state.type} 
                                        categoryId={this.state.categoryId}
                                        title={this.state.type === 'add' ? 'Create Category' : 'Update Category'} />} />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        adminToken: state.admin.token,
        category: state.admin.category
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveCategory: (category) => {dispatch(saveCategory(category))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminCategory);