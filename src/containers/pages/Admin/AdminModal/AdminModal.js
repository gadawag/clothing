import React from 'react';
import classes from './AdminModal.module.scss';

const AdminModal = (props) => {
    return (
        <div className={classes.AdminModal}>
            <div className={classes.AdminModal__content}>
                <button className={classes.AdminModal__close} onClick={(e) => {props.close(e)}} data-role="close">X</button>
                {props.content}
            </div>
        </div>
    );
}

export default AdminModal;