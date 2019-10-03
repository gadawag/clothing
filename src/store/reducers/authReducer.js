import * as actionTypes from '../actionTypes';

const initialState = {
    token: '',
    name: ''
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.USER_AUTHORIZE:
            return {
                ...state,
                token: action.token,
                name: action.name
            }

        case actionTypes.USER_LOGOUT:
            return {
                ...state,
                token: '',
                name: ''
            }

        default: return state;
    }
}

export default reducer;