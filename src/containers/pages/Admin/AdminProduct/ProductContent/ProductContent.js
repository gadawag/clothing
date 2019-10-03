import React from 'react';
import classes from './ProductContent.module.scss';

const ProductContent = (props) => {
    return (
        <table className={classes.ProductContent}>
            <thead>
                <tr>
                    <th width="25%">Title</th>
                    <th width="25%">Category</th>
                    <th width="25%">Date created</th>
                    <th width="25%">Actions</th>
                </tr>
            </thead>
            <tbody>
                {props.products}
            </tbody>
        </table>
    );
}

export default ProductContent;