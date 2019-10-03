import * as actionTypes from '../actionTypes';

const initialState = {
    category: []
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.USER_FETCH_CATEGORY:
            return {
                ...state,
                category: action.category
            }
        
        default: return state;
    }
}

export default reducer;
