import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '',  // 初始化时从 localStorage 读取 token
    }),
    actions: {
        setToken(newToken: string) {
            this.token = newToken;
            localStorage.setItem('token', newToken);  // 保存 token 到 localStorage
        },
        clearToken() {
            this.token = '';
            localStorage.removeItem('token');  // 清除 localStorage 中的 token
        },
    },
});