import * as actionTypes from '../actionTypes';

const initialState = {
    token: '',
    name: '',
    category: [],
    product: []
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.ADMIN_AUTHORIZE:
            return {
                ...state,
                token: action.token,
                name: action.name
            }

        case actionTypes.ADMIN_LOGOUT:
            return {
                ...state,
                token: '',
                name: ''
            }

        case actionTypes.ADMIN_SAVE_CATEGORY:
            return {
                ...state,
                category: [...action.category]
            }

        case actionTypes.ADMIN_SAVE_PRODUCT:
            return {
                ...state,
                product: [...action.product]
            }

        default: return state;
    }
}

export default reducer;