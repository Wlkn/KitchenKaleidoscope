import React, { useState } from "react";
import { useIngredientsMutation } from "../redux/slices/ingredients";
import { useRecipeMutation } from "../redux/slices/recipes";
import { setIngredients } from "../redux/reducers/ingredients";
import { addRecipe } from "../redux/reducers/recipes";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectCurrentRecipeId } from "../redux/reducers/recipes";

interface Ingredient {
    id: number;
    unitId: number;
    quantity: number;
    newIngredient?: string;
    newUnit?: string;
}

interface Unit {
    id: number;
    name: string;
}

interface IngredientOption {
    id: number;
    name: string;
}

const units: Unit[] = [
    { id: 1, name: "tsp" },
    { id: 2, name: "tbsp" },
    { id: 3, name: "cup" },
    { id: 4, name: "oz" },
    { id: 5, name: "g" },
    { id: 6, name: "kg" },
    { id: 7, name: "mL" },
    { id: 8, name: "L" },
];
const ingredients: IngredientOption[] = [
    { id: 1, name: "flour" },
    { id: 2, name: "sugar" },
    { id: 3, name: "salt" },
    { id: 4, name: "butter" },
    { id: 5, name: "eggs" },
    { id: 6, name: "milk" },
];

const RecipeForm: React.FC = () => {
    const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
    //

    //
    const [imageUrl, setImageUrl] = useState<string>("");
    const [recipeName, setRecipeName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [instructions, setInstructions] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(false); //todo: add this to the form, and make it work
    //REDUX
    //====================================================================================================
    //postgreSql
    const [recipeIngredients, { isLoading }] = useIngredientsMutation();
    //mongoDb
    const [recipe] = useRecipeMutation();
    const dispatch = useDispatch();
    const currentRecipeId: string = useSelector(selectCurrentRecipeId);

    //====================================================================================================

    async function handleSubmitPostGreSql() {
        try {
            const recipeIngredientsData = await recipeIngredients({
                ingredientsList,
                recipeId: currentRecipeId,
            }).unwrap();
            console.log(recipeIngredientsData);
            dispatch(
                setIngredients({
                    ...recipeIngredientsData,
                    ingredientsList,
                    recipeId: currentRecipeId,
                })
            );
            setIngredientsList([]);
        } catch (error) {
            console.log("error");
        }
        // Send ingredientsList to your backend here
        console.log(ingredientsList);
        console.log(recipeName);
        
    }

    async function handleSubmitMongoDb() {
        //todo refactor this like the ingredients one.
        try {
            const recipeData = await recipe({
                recipeName,
                description,
                instructions,
                imageUrl,
                // isPublic,
            }).unwrap();
            dispatch(
                addRecipe({
                    ...recipeData,
                    recipeName,
                    description,
                    instructions,
                    imageUrl,
                })
            );
            console.log(recipeData.recipeId);
            setRecipeName("");
            setDescription("");
            setInstructions("");
            setImageUrl("");

            // setIsPublic(false);
        } catch (error) {
            console.log("error");
        }
    }

    //====================================================================================================
    //HANDLE SUBMIT
    //====================================================================================================
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //RECIPE INFOS FORM THIS WILL USE THE MANGODB API TO CREATE A NEW RECIPE
        handleSubmitMongoDb();
        //POSTGRESQL API, INGREDIENTS_NAMES, UNITS, NEW_INGREDIENTS? (IF NOT IN THE DB) AND QUANTITY
        handleSubmitPostGreSql();
    };
    //====================================================================================================

    //----------------------------------------------------------------------------------------------------
    //HANDLE CHANGES
    //----------------------------------------------------------------------------------------------------

    //====================================================================================================
    //MANGO DB API HANDLERS
    //====================================================================================================
    const handleRecipeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecipeName(e.target.value);
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setDescription(e.target.value);
    };

    const handleInstructionsChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setInstructions(e.target.value);
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrl(e.target.value);
    };

    // const handleIsPublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setIsPublic(e.target.checked);
    // };
    //todo
    //

    //====================================================================================================
    //-ADD NEW THING HANDLERS-
    //====================================================================================================
    const handleNewUnitChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const newIngredientsList = [...ingredientsList];
        newIngredientsList[index].newUnit = e.target.value;
        setIngredientsList(newIngredientsList);
    };

    const handleNewIngredientChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const newIngredientsList = [...ingredientsList];
        newIngredientsList[index].newIngredient = e.target.value;
        setIngredientsList(newIngredientsList);
    };
    //====================================================================================================
    //POSTGRESQL API HANDLERS
    //====================================================================================================

    const handleAddIngredient = () => {
        setIngredientsList([
            ...ingredientsList,
            { id: 0, unitId: 0, quantity: 0, newIngredient: "", newUnit: "" },
        ]);
    };

    const handleIngredientChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        index: number
    ) => {
        const newIngredientsList = [...ingredientsList];
        newIngredientsList[index].id = parseInt(e.target.value);
        setIngredientsList(newIngredientsList);
    };

    const handleUnitChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        index: number
    ) => {
        const newIngredientsList = [...ingredientsList];
        newIngredientsList[index].unitId = parseInt(e.target.value);
        setIngredientsList(newIngredientsList);
    };

    const handleQuantityChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const newIngredientsList = [...ingredientsList];
        newIngredientsList[index].quantity = parseFloat(e.target.value);
        setIngredientsList(newIngredientsList);
    };

    //====================================================================================================

    //====================================================================================================
    //OTHER HANDLERS
    //====================================================================================================

    const handleRemoveIngredient = (index: number) => {
        setIngredientsList(ingredientsList.filter((_, i) => i !== index));
    };
    //
    //====================================================================================================
    //

    //====================================================================================================
    //====================================================================================================

    const content = isLoading ? (
        <h1>Loading...</h1>
    ) : (
        <form onSubmit={handleSubmit}>
            <h1>id: {currentRecipeId}</h1>
            <label>
                Recipe Name:
                <input
                    type="text"
                    placeholder="Recipe Name"
                    value={recipeName}
                    onChange={handleRecipeNameChange}
                    required
                />
            </label>
            <br />
            <label>
                Description:
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                    required
                />
            </label>
            <br />
            <label>
                Instructions:
                <textarea
                    placeholder="Instructions"
                    value={instructions}
                    onChange={handleInstructionsChange}
                    required
                />
            </label>
            <br />
            <label>
                Image URL:
                <input
                    type="text"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                />
            </label>
            <br />
            <h3>Ingredients:</h3>
            {ingredientsList.map((ingredient, index) => (
                <div key={index}>
                    <label>
                        Ingredient:
                        <select
                            value={ingredient.id}
                            onChange={(e) => handleIngredientChange(e, index)}
                        >
                            <option value={0} disabled>
                                Select an ingredient
                            </option>
                            {ingredients.map((ingredientName, i) => (
                                <option key={i} value={ingredientName.id}>
                                    {ingredientName.name}
                                </option>
                            ))}
                            <option value={-1}>Other</option>
                        </select>
                        {ingredient.id === -1 && (
                            <label>
                                New Ingredient:
                                <input
                                    type="text"
                                    value={ingredient.newIngredient}
                                    onChange={(e) =>
                                        handleNewIngredientChange(e, index)
                                    }
                                />
                            </label>
                        )}
                    </label>
                    <br />
                    <label>
                        Unit:
                        <select
                            value={ingredient.unitId}
                            onChange={(e) => handleUnitChange(e, index)}
                        >
                            <option value={0} disabled>
                                Select a unit
                            </option>
                            {units.map((unit, i) => (
                                <option key={i} value={unit.id}>
                                    {unit.name}
                                </option>
                            ))}
                            <option value={-1}>Other</option>
                        </select>
                        {ingredient.unitId === -1 && (
                            <label>
                                New measuring unit:
                                <input
                                    type="text"
                                    value={ingredient.newUnit}
                                    onChange={(e) =>
                                        handleNewUnitChange(e, index)
                                    }
                                />
                            </label>
                        )}
                    </label>
                    <br />
                    <label>
                        Quantity:
                        <input
                            type="number"
                            value={ingredient.quantity}
                            onChange={(e) => handleQuantityChange(e, index)}
                        />
                    </label>
                    <br />
                    <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                    >
                        Remove Ingredient
                    </button>
                    <br />
                </div>
            ))}
            <button type="button" onClick={handleAddIngredient}>
                Add Ingredient
            </button>
            <br />
            <input type="submit" value="Save Recipe" />
        </form>
    );
    return content;
};
export default RecipeForm;
