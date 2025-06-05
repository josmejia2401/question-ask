import { axiosInstance } from '../../../services/fetch';
import { AuthStore } from '../../../store/index';

export const register = async (payload) => {
    try {
        const res = await axiosInstance.post(`/api/users`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*'
            },
        });
        AuthStore.logout();
        return res.data;
    } catch (error) {
        throw error;
    }
}
