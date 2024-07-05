import { create } from 'zustand';

export const useStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user })},
    token: localStorage.getItem("token") || null,
    setToken: (token) => {
        localStorage.setItem("token", token);
        set({token});
    },
    logout: ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({user: null});
        set({token: null});
    }
}))