import { FETCH_PRODUCTS_SUCCESS, GET_ALL_PRODUCTS, GET_PRODUCTS_BY_ID, UPDATE_PRODUCT_SUCCESS } from "../actions/productActions";

const initState = {
  products: null,
  selectedProduct: null,
  loading: false,
  error: null
};

const productReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
      };
    case GET_ALL_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
      };
    case GET_PRODUCTS_BY_ID:
      return {
        ...state,
        selectedProduct: action.payload,
        loading: false,
        error: null,
      };
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        selectedProduct: action.payload,
        loading: false,
        error: null,
      };
    default:
      break;
  }

  return state;
};

export default productReducer;