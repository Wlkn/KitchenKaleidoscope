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

export const { addRecipe } = recipeSlice.actions;

export default recipeSlice.reducer;

export const selectCurrentRecipe = (state: any) => state.recipe.recipe;

export const selectCurrentRecipeId = (state: any) => state.recipe.recipeId;
