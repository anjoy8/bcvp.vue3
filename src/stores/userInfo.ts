import { defineStore } from 'pinia';
import piniaPersistConfig from "@/stores/config/piniaPersist";

export const useUserInfoStore = defineStore({
  id: 'userinfo',
  state: (): { user: User.UserResponse | null } => ({
    user: null
  }),
  actions: {
    setUser(user: User.UserResponse) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
      localStorage.removeItem('userinfo');
    }
  },
  persist: piniaPersistConfig("userinfo")
});