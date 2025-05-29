import { axiosInstance } from '../../services/fetch';
import { AuthStore } from '../../store/index';

export const logout = async () => {
    try {
        const res = await axiosInstance.post(`/api/v1/auth/logout`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*'
            },
        });
        AuthStore.logout();
        return res.data;
    } catch (error) {
        AuthStore.logout();
        throw error;
    }
}
