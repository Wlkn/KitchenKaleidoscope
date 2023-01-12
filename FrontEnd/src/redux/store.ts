import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./actions/auth";
import authReducer from "./reducers/auth";


export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});
