// src/services/authService.js
import apiClient from './apiClient';

const AUTH_ENDPOINT = '/auth';

export const loginWithGoogle = async (googleToken) => {
    const response = await apiClient.post(`${AUTH_ENDPOINT}/google`, {
        token: googleToken,
    });
    localStorage.setItem('token', response.data.token);
    return response.data;
};

export const loginWithFacebook = async (facebookToken) => {
    const response = await apiClient.post(`${AUTH_ENDPOINT}/facebook`, {
        token: facebookToken,
    });
    localStorage.setItem('token', response.data.token);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const getUserProfile = async () => {
    const response = await apiClient.get(`${AUTH_ENDPOINT}/me`);
    return response.data;
};
