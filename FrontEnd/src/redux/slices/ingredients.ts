import { apiSlice } from "../apiSlice";

export const ingredientsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        ingredients: builder.mutation({
            query: (ingredients) => ({
                url: "/api/ingredients",
                method: "POST",
                body: { ...ingredients },
            }),
        }),
    }),
});

export const {
    useIngredientsMutation
} = ingredientsApiSlice