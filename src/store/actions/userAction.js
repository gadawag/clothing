import * as actionTypes from '../actionTypes';

export const fetchCategory = (category) => {
    return {
        type: actionTypes.USER_FETCH_CATEGORY,
        category
    }
}