import React from 'react';
import CategoryProduct from '../../../components/CategoryProduct/CategoryProduct';
import classes from './CategoryPage.module.scss';

class CategoryPage extends React.Component {
    render() {
        return (
            <div className={classes.CategoryPage}>
                <CategoryProduct />
            </div>
        );
    }
}

export default CategoryPage;