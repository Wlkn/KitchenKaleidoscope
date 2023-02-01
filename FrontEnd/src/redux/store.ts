import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authReducer from "./reducers/auth";
import ingredientsReducer from "./reducers/ingredients";
import {recipeSliceReducer,likeSliceReducer } from "./reducers/recipes";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        ingredients: ingredientsReducer,
        recipe: recipeSliceReducer,
        likes: likeSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});
