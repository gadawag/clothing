import * as actionTypes from '../actionTypes';

export const authorizeAdmin = (token, name) => {
    return {
        type: actionTypes.ADMIN_AUTHORIZE,
        token,
        name
    }
}

export const logoutAdmin = () => {
    return {
        type: actionTypes.ADMIN_LOGOUT
    }
}

export const saveCategory = (category) => {
    return {
        type: actionTypes.ADMIN_SAVE_CATEGORY,
        category
    }
}

export const saveProduct = (product) => {
    return {
        type: actionTypes.ADMIN_SAVE_PRODUCT,
        product
    }
}