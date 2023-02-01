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
        getRecipes: builder.query({
            query: (currentRecipeId) => ({
                url: `/api/recipes/${currentRecipeId}`,
                method: "GET",
            }),
        }),
        getCreatorOfRecipe: builder.query({
            query: (currentRecipeId) => ({
                url: `/api/recipes/user/${currentRecipeId}`,
                method: "GET",
            }),
        }),
        getAllRecipes: builder.query({
            query: () => ({
                url: "/api/recipes",
                method: "GET",
            }),
        }),
        getUserRecipes: builder.query({
            query: (user_id) => ({
                url: `/api/recipes/myrecipes/${user_id}`,
                method: "GET",
            }),
        }),
        editRecipe: builder.mutation({
            query: (recipe_id, ...recipeInfo) => ({
                url: `/api/recipes/${recipe_id}`,
                method: "PUT",
                body: { ...recipeInfo },
            }),
        }),
        deleteRecipe: builder.mutation({
            query: (recipe_id) => ({
                url: `/api/recipes/${recipe_id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const LikesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        likeRecipe: builder.mutation({
            query: (recipeInfo) => ({
                url: "/api/likes",
                method: "POST",
                body: { ...recipeInfo },
            }),
        }),
        getAllLikes: builder.query({
            query: () => ({
                url: "/api/likes",
                method: "GET",
            }),
        }),
        getUserLikes: builder.query({
            query: (user_id) => ({
                url: `/api/likes/${user_id}`,
                method: "GET",
            }),
        }),
    }),
});

export const CommentsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addComment: builder.mutation({
            query: (commentInfo) => ({
                url: "/api/comments",
                method: "POST",
                body: { ...commentInfo },
            }),
        }),
        removeComment: builder.mutation({
            query: (commentInfo) => ({
                url: "/api/comments",
                method: "DELETE",
                body: { ...commentInfo },
            }),
        }),
        editComment: builder.mutation({
            query: (commentInfo) => ({
                url: "/api/comments",
                method: "PUT",
                body: { ...commentInfo },
            }),
        }),
        getAllComments: builder.query({
            query: () => ({
                url: "/api/comments",
                method: "GET",
            }),
        }),
        getCommentByRecipeId: builder.query({
            query: (recipe_id) => ({
                url: `/api/comments/${recipe_id}`,
                method: "GET",
            }),
        }),
    }),
});
//likes slices
export const { useGetUserLikesQuery } = LikesApiSlice;

export const { useGetAllLikesQuery } = LikesApiSlice;

export const { useLikeRecipeMutation } = LikesApiSlice;
//likes slices
//============================================
//recipes slices
export const { useGetAllRecipesQuery } = RecipeApiSlice;

export const { useGetCreatorOfRecipeQuery } = RecipeApiSlice;

export const { useGetRecipesQuery } = RecipeApiSlice;

export const { useRecipeMutation } = RecipeApiSlice;

export const { useGetUserRecipesQuery } = RecipeApiSlice;

export const { useEditRecipeMutation } = RecipeApiSlice;

export const { useDeleteRecipeMutation } = RecipeApiSlice;
//recipes slices
//============================================
//comments slices

export const { useGetCommentByRecipeIdQuery } = CommentsApiSlice;

export const { useGetAllCommentsQuery } = CommentsApiSlice;

export const { useAddCommentMutation } = CommentsApiSlice;

export const { useRemoveCommentMutation } = CommentsApiSlice;

export const { useEditCommentMutation } = CommentsApiSlice;

//comments slices
