import { apiSlice } from "../apiSlice";

export const RecipeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        recipe: builder.mutation({
            query: (recipeInfo) => ({
                url: "/api/recipes",
                method: "POST",
                body: { ...recipeInfo },
            }),
        }),
    }),
    
});
export const RecipeGetApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRecipes: builder.query({
            query: (currentRecipeId) => ({
                url: `/api/recipes/${currentRecipeId}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetRecipesQuery } = RecipeGetApiSlice;

export const { useRecipeMutation } = RecipeApiSlice;
