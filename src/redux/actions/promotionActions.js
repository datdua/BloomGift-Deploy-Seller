import axios from "axios";

export const GET_ALL_PROMOTIONS = "GET_ALL_PROMOTIONS";
export const GET_PROMOTION_BY_ID = "GET_PROMOTION_BY_ID";
export const GET_PROMOTION_BY_STATUS = "GET_PROMOTION_BY_STATUS";


export const getAllPromotions = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('http://localhost:8080/api/seller/promotions/promotion-management/get-all', {
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

export const getPromotionByStatusFalse = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('http://localhost:8080/api/seller/promotions/promotion-management/get-by-status?promotionStatus=false', {
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