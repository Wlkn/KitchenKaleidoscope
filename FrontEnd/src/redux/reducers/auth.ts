import { createSlice } from "@reduxjs/toolkit";

// Hydrate from localStorage so that auth survives a page reload. Without this
// the store always starts empty and RequireAuth would bounce logged-in users
// back to the login page after every refresh.
const initialState = {
    user: localStorage.getItem("email") || null,
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || null,
    name: localStorage.getItem("name") || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { email, token, userId, name } = action.payload;
            state.user = email;
            state.token = token;
            state.userId = userId;
            state.name = name
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("name", name);
            localStorage.setItem("email", email);
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            state.userId = null;
            state.name = null;
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("name");
            localStorage.removeItem("email");
            localStorage.removeItem("user");
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: any) => state.auth.user
export const selectCurrentToken = (state: any) => state.auth.token
export const selectCurrentUserId = (state: any) => state.auth.userId
export const selectCurrentName = (state: any) => state.auth.name