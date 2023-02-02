import { createSlice } from "@reduxjs/toolkit";

const recipeSlice = createSlice({
    name: "recipe",
    initialState: {
        recipeName: null,
        description: null,
        instructions: null,
        imageUrl: null,
        recipeId: null,
    },
    reducers: {
        addRecipe: (state, action) => {
            const {
                recipeName,
                description,
                instructions,
                imageUrl,
                recipeId,
            } = action.payload;
            state.recipeName = recipeName;
            state.description = description;
            state.instructions = instructions;
            state.imageUrl = imageUrl;
            state.recipeId = recipeId;
        },
        removeRecipe: (state) => {
            state.recipeName = null;
            state.description = null;
            state.instructions = null;
            state.imageUrl = null;
            state.recipeId = null;
        },
        editRecipe: (state, action) => {
            const {
                recipeName,
                description,
                instructions,
                imageUrl,
                recipeId,
            } = action.payload;
            state.recipeName = recipeName;
            state.description = description;
            state.instructions = instructions;
            state.imageUrl = imageUrl;
            state.recipeId = recipeId;
        },
    },
});

const likesSlice = createSlice({
    name: "likes",
    initialState: {
        liked: false,
        recipe_id: null,
        user_id: null,
    },
    reducers: {
        changeLike: (state, action) => {
            const { liked, recipe_id, user_id } = action.payload;
            state.liked = liked;
            state.recipe_id = recipe_id;
            state.user_id = user_id;
        },
    },
});

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        comments: null,
        user_id: null,
        recipe_id: null,
    },
    reducers: {
        addComment: (state, action) => {
            const { comments, user_id, recipe_id } = action.payload;
            state.comments = comments;
            state.user_id = user_id;
            state.recipe_id = recipe_id;
        },
        removeComment: (state) => {
            state.comments = null;
            state.user_id = null;
            state.recipe_id = null;
        },
        editComment: (state, action) => {
            const { comments, user_id, recipe_id } = action.payload;
            state.comments = comments;
            state.user_id = user_id;
            state.recipe_id = recipe_id;
        },
    },
});

export const { changeLike } = likesSlice.actions;
export const { addComment, removeComment, editComment } = commentsSlice.actions;
export const { addRecipe } = recipeSlice.actions;
export const { removeRecipe } = recipeSlice.actions;
export const { editRecipe } = recipeSlice.actions;

export const likeSliceReducer = likesSlice.reducer;
export const recipeSliceReducer = recipeSlice.reducer;
export const commentsSliceReducer = commentsSlice.reducer;

export const selectCurrentRecipe = (state: any) => state.recipe.recipe;
export const selectCurrentRecipeId = (state: any) => state.recipe.recipeId;
