// src/store/index.js

import { parseJwt } from "../utils/utils";

export class AuthStore {
    static data = {
        status: "unset",
        token: null,
        isAuthenticated: false,
        tokenInfo: '',
    };

    static getState() {
        if (AuthStore.data.status === "set") {
            return AuthStore.data;
        }
        const stored = localStorage.getItem("state");
        return stored ? JSON.parse(stored) : { ...AuthStore.data };
    }

    static setToken(token) {
        AuthStore.data.status = "set";
        AuthStore.data.isAuthenticated = true;
        AuthStore.data.token = token;
        AuthStore.data.tokenInfo = parseJwt(token);
        localStorage.setItem("state", JSON.stringify(AuthStore.data));
    }

    static logout() {
        AuthStore.data.status = "unset";
        AuthStore.data.isAuthenticated = false;
        AuthStore.data.token = null;
        AuthStore.data.tokenInfo = null;
        localStorage.removeItem("state");
        localStorage.clear();
    }
}


/*export const useUIStore = create((set) => ({
    loading: false,
    setLoading: (value) => set({ loading: value }),
}));*/
