import * as actionTypes from '../actionTypes';

const initialState = {
    cart: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CART_SAVE_TO_STORE:
            return {
                ...state,
                cart: action.cart
            }

        default: return state;
    }
}

export default reducer;