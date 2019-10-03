import * as actionTypes from '../actionTypes';

export const authorizeUser = (token, name) => {
    return {
        type: actionTypes.USER_AUTHORIZE,
        token,
        name
    }
}

export const logout = () => {
    return {
        type: actionTypes.USER_LOGOUT
    }
}