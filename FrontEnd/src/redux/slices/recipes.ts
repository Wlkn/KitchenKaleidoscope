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
export const GetRecipeCreatorApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCreatorOfRecipe: builder.query({
            query: (currentRecipeId) => ({
                url: `/api/recipes/user/${currentRecipeId}`,
                method: "GET",
            }),
        }),
    }),
});
export const GetAllRecipesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllRecipes: builder.query({
            query: () => ({
                url: "/api/recipes",
                method: "GET",
            }),
        }),
    }),
});
export const LikesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        likeRecipe: builder.mutation({
            query: () => ({
                url: "/api/recipes/likes",
                method: "POST",
            }),
        }),
    }),
});
export const GetAllLikesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllLikes: builder.query({
            query: () => ({
                url: "/api/recipes/likes",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetAllLikesQuery } = GetAllLikesApiSlice;

export const { useLikeRecipeMutation } = LikesApiSlice;

export const { useGetAllRecipesQuery } = GetAllRecipesApiSlice;

export const { useGetCreatorOfRecipeQuery } = GetRecipeCreatorApiSlice;

export const { useGetRecipesQuery } = RecipeGetApiSlice;

export const { useRecipeMutation } = RecipeApiSlice;
