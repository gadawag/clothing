import React from 'react';
import classes from './CategoryContent.module.scss';

const CategoryContent = (props) => {
    return (
        <table className={classes.CategoryContent}>
            <thead>
                <tr>
                    <th width="40%">Title</th>
                    <th width="40%">Date created</th>
                    <th width="20%">Actions</th>
                </tr>
            </thead>
            <tbody>
                {props.categories}
            </tbody>
        </table>
    );
}

export default CategoryContent;