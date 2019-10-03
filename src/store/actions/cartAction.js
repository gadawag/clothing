import * as actionTypes from '../actionTypes';

export const saveCartToStore = (cart) => {
    return {
        type: actionTypes.CART_SAVE_TO_STORE,
        cart
    }
}