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
        fetchIngredientsByRecipeId: builder.query({
            query: (recipeId) => ({
                url: `/api/ingredients/${recipeId}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useIngredientsMutation, useFetchIngredientsByRecipeIdQuery } =
    ingredientsApiSlice;
