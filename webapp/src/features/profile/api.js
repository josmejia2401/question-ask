import { axiosInstance } from '../../services/fetch';
export const findById = async (id) => {
    try {
        const res = await axiosInstance.get(`/api/v1/users/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*'
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}


export const updateById = async (id, payload) => {
    try {
        const res = await axiosInstance.put(`/api/v1/users/${id}`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*'
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}