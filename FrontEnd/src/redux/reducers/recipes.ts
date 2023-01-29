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
    },
});

const likesSlice = createSlice({
    name: "likes",
    initialState: {
        likes: null,
        recipe_id: null,
        user_id: null,
    },
    reducers: {
        addLikes: (state, action) => {
            const { likes, recipe_id, user_id } = action.payload;
            state.likes = likes;
            state.recipe_id = recipe_id;
            state.user_id = user_id;
        },
    },
});


export const { addLikes } = likesSlice.actions;


export const { addRecipe } = recipeSlice.actions;

export const likeSliceReducer = likesSlice.reducer;
export const recipeSliceReducer =  recipeSlice.reducer;

export const selectCurrentRecipe = (state: any) => state.recipe.recipe;

export const selectCurrentRecipeId = (state: any) => state.recipe.recipeId;
