import React from 'react';
import {getUrl} from '../../../utilities/utilities';
import classes from './CategoryItem.module.scss';

const CategoryItem = (props) => {
    const largeClass = props.large ? classes.CategoryItem__large : '';
    const urlArr = props.image.split('\\');
    const newImgUrl = urlArr.join('/');
    const styleObj = {
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, .5), 
                          rgba(0, 0, 0, .5)), url(${getUrl()}/${newImgUrl})`
    }

    return (
        <div className={`${classes.CategoryItem} ${largeClass}`}>
            <div className={classes.CategoryItem__body} >
                <div className={classes.CategoryItem__content} style={styleObj} onClick={props.click.bind(null, props.slug)}>
                    <h2 className={classes.CategoryItem__title}>{props.title}</h2>
                </div>
            </div>
        </div>
    );
}

export default CategoryItem;