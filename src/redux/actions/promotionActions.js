import axios from "axios";

export const GET_ALL_PROMOTIONS = "GET_ALL_PROMOTIONS";
export const GET_PROMOTION_BY_ID = "GET_PROMOTION_BY_ID";
export const GET_PROMOTION_BY_STATUS = "GET_PROMOTION_BY_STATUS";
export const CREATE_PROMOTION = "CREATE_PROMOTION";
export const UPDATE_PROMOTION = "UPDATE_PROMOTION";
export const DELETE_PROMOTION = "DELETE_PROMOTION";


export const getAllPromotions = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('https://bloomgift-bloomgift.azuremicroservices.io/api/seller/promotions/promotion-management/get-all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            if (response.status !== 200) {
                throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
            }
            const promotions = response.data;
            dispatch({
                type: GET_ALL_PROMOTIONS,
                payload: promotions
            });
            return promotions;
        } catch (error) {
            console.error("Fetch all promotions failed:", error);
            return Promise.reject(error);
        }
    }
}

export const getPromotionByStatus = (promotionStatus) => {
    return async (dispatch) => {
        try {
            const response = await axios.get('https://bloomgift-bloomgift.azuremicroservices.io/api/seller/promotions/promotion-management/get-by-promotion-status', {
                params: { promotionStatus: promotionStatus },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            if (response.status !== 200) {
                throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
            }
            const promotions = response.data;
            dispatch({
                type: GET_PROMOTION_BY_STATUS,
                payload: promotions
            });
            return promotions;
        } catch (error) {
            console.error("Fetch all promotions failed:", error);
            return Promise.reject(error);
        }
    }
}

export const getPromotionById = (promotionId) => {
    return async (dispatch) => {
        try {
            const response = await axios.get('https://bloomgift-bloomgift.azuremicroservices.io/api/seller/promotions/promotion-management/get-by-id', {
                params: { promotionID: promotionId },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            if (response.status !== 200) {
                throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
            }
            const promotion = response.data;
            dispatch({
                type: GET_PROMOTION_BY_ID,
                payload: promotion
            });
            return promotion;
        } catch (error) {
            console.error("Fetch promotion by id failed:", error);
            return Promise.reject(error);
        }
    }
}

export const createPromotion = (promotionInfo) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('https://bloomgift-bloomgift.azuremicroservices.io/api/seller/promotions/promotion-management/create', promotionInfo, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            if (response.status !== 200) {
                throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
            }
            const promotion = response.data;
            dispatch({
                type: CREATE_PROMOTION,
                payload: promotion
            });
            return promotion;
        } catch (error) {
            console.error("Create promotion failed:", error);
            return Promise.reject(error);
        }
    }
}

export const updatePromotion = (promotionId, promotionInfo) => {
    return async (dispatch) => {
        try {
            const response = await axios.put(`https://bloomgift-bloomgift.azuremicroservices.io/api/seller/promotions/promotion-management/update/${promotionId}`, promotionInfo, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            if (response.status !== 200) {
                throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
            }
            const promotion = response.data;
            dispatch({
                type: UPDATE_PROMOTION,
                payload: promotion
            });
            return promotion;
        } catch (error) {
            console.error("Update promotion failed:", error);
            return Promise.reject(error);
        }
    }
}

export const deletePromotion = (promotionId) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`https://bloomgift-bloomgift.azuremicroservices.io/api/seller/promotions/promotion-management/delete/${promotionId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            if (response.status !== 200) {
                throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
            }
            dispatch({
                type: DELETE_PROMOTION,
                payload: promotionId
            });
            return promotionId;
        } catch (error) {
            console.error("Delete promotion failed:", error);
            return Promise.reject(error);
        }
    }
}