import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore({
  id: 'userinfo',
  state: (): { user: User.UserResponse | null } => ({
    user: null
  }),
  actions: {
    setUser(user: User.UserResponse) {
      this.user = user;
      localStorage.setItem('userinfo', JSON.stringify(user));
    },
    getUser() {
      const user = localStorage.getItem('userinfo');
      if (user) {
        this.user = JSON.parse(user);
      }
    },
    clearUser() {
      this.user = null;
      localStorage.removeItem('userinfo');
    }
  }
});