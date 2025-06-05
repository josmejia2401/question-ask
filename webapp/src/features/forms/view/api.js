import { axiosInstance } from '../../../services/fetch';

export const findAll = async () => {
    try {
        const res = await axiosInstance.get(`/api/forms`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
                "access-control-allow-methods": "*"
            },
        });;
        return res.data;
    } catch (error) {
        throw error;
    }
}
