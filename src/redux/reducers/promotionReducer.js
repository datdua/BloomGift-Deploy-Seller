import { GET_ALL_PROMOTIONS } from "../actions/promotionActions";

const initState = {
    promotions: null,
    isAuthorized: false,
    loading: false,
    error: null
};

const promotionReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_ALL_PROMOTIONS:
            return {
                ...state,
                promotions: action.payload,
                isAuthorized: true,
                loading: false,
                error: null,
            };
        default:
            break;
    }

    return state;
};

export default promotionReducer;

