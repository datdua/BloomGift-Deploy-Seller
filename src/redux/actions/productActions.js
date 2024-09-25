import axios from "axios";

export const GET_ALL_PRODUCTS = "GET_ALL_PRODUCTS";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const CREATE_PRODUCT_SUCCESS = "CREATE_PRODUCT_SUCCESS";
export const CREATE_PRODUCT_FAILURE = "CREATE_PRODUCT_FAILURE";


const fetchProductsSuccess = products => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products
});

// Create product success action
const createProductSuccess = (message) => ({
  type: CREATE_PRODUCT_SUCCESS,
  payload: message,
});

// Create product failure action
const createProductFailure = (error) => ({
  type: CREATE_PRODUCT_FAILURE,
  payload: error,
});

// fetch products
export const fetchProducts = products => {
  return dispatch => {
    dispatch(fetchProductsSuccess(products));
  };
};

export const getAllProducts = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:8080/api/product/get-all');
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const products = response.data;
      dispatch({
        type: GET_ALL_PRODUCTS,
        payload: products
      });
      console.log(products);
      return products;
    } catch (error) {
      console.error("Fetch all products failed:", error);
      return Promise.reject(error);
    }
  }
}

export const getProductByStatusTrue = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:8080/api/product/products/status?productStatus=true');
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const products = response.data;
      dispatch({
        type: GET_ALL_PRODUCTS,
        payload: products
      });
      return products;
    } catch (error) {
      console.error("Fetch all products failed:", error);
      return Promise.reject(error);
    }
  }
}

export const getProductByStatusFalse = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:8080/api/product/products/status?productStatus=false');
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const products = response.data;
      dispatch({
        type: GET_ALL_PRODUCTS,
        payload: products
      });
      return products;
    } catch (error) {
      console.error("Fetch all products failed:", error);
      return Promise.reject(error);
    }
  }
}

export const createProduct = (productRequest, imageFiles) => {
  return async (dispatch) => {
    try {
      // Tạo FormData để đính kèm JSON và file ảnh
      const formData = new FormData();

      // Thêm productRequest dưới dạng JSON string
      formData.append('productRequest', JSON.stringify(productRequest));

      imageFiles.forEach((file) => {
        formData.append('imageFiles', file);
      });

      const response = await axios.post(
        'http://localhost:8080/api/product/create',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 201) {
        dispatch(createProductSuccess('Product created successfully'));
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Create product failed:', error);
      dispatch(createProductFailure(error.message));
      return Promise.reject(error);
    }
  };
};