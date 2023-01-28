import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, token: null, userId: null, name: null },
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
        logOut: (state, action) => {
            state.user = null;
            state.token = null;
            state.userId = null;
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: any) => state.auth.user
export const selectCurrentToken = (state: any) => state.auth.token
export const selectCurrentUserId = (state: any) => state.auth.userId
export const selectCurrentName = (state: any) => state.auth.name