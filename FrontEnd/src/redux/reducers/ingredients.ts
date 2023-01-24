import { createSlice } from "@reduxjs/toolkit";

const ingredientsSlice = createSlice({
    name: "ingredients",
    initialState: { ingredients: null },
    reducers: {
        setIngredients: (state, action) => {
            const { ingredients } = action.payload;
            state.ingredients = ingredients;
            
        },
        removeIngredients: (state) => {
            state.ingredients = null;
        },
    },
});

export const { setIngredients, removeIngredients } = ingredientsSlice.actions;

export default ingredientsSlice.reducer;

export const selectCurrentIngredients = (state: any) => 
    state.ingredients.ingredients;

