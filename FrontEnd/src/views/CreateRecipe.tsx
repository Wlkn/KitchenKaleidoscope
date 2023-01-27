import React, { useState } from "react";
import { useIngredientsMutation } from "../redux/slices/ingredients";
import { useRecipeMutation } from "../redux/slices/recipes";
import { setIngredients } from "../redux/reducers/ingredients";
import { addRecipe } from "../redux/reducers/recipes";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectCurrentRecipeId } from "../redux/reducers/recipes";
import "../styles/_recipeForm.scss";
import { Navigate, useNavigate } from "react-router-dom";

interface Ingredient {
    ingredientId: number;
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
// fetch units from databse
let myHeaders = new Headers();

let requestOptions: object = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
};

async function fetchIngredients() {
    try {
        const response = await fetch(
            "http://localhost:4000/api/ingredient_names",
            requestOptions
        );
        if (response.ok) {
            const ingredientsJSON = await response.json();
            console.log(ingredientsJSON);//todo remove
            return ingredientsJSON;
        } else {
            console.error(response.statusText);
        }
    } catch (error) {
        console.error(error);
    }
}

async function fetchUnits() {
    try {
        const response = await fetch(
            "http://localhost:4000/api/units",
            requestOptions
        );
        if (response.ok) {
            const unitsJSON = await response.json();
            console.log(unitsJSON);//todo remove
            return unitsJSON;
        } else {
            console.error(response.statusText);
        }
    } catch (error) {
        console.error(error);
    }
}

const unitsJSON: any = await fetchUnits();
const units: Unit[] = unitsJSON.map((unit: Unit) => ({
    id: unit.id,
    name: unit.name,
}));
console.log(units);

const ingredientsJSON: any = await fetchIngredients();
const ingredients: IngredientOption[] = ingredientsJSON.map((ingredient: IngredientOption) => ({
    id: ingredient.id,
    name: ingredient.name,
}));
console.log(ingredients);//todo remove

const RecipeForm: React.FC = () => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };
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

    async function handleSubmitIngredients(recipeData: any) {
        try {
            const recipeId = currentRecipeId;
            const recipeIngredientsData = await recipeIngredients({
                ingredientsList,
                recipeId: recipeData.recipeId,
            }).unwrap();
            console.log(recipeId);
            dispatch(
                setIngredients({
                    ...recipeIngredientsData,
                    ingredientsList,
                    recipeId: recipeData.recipeId,
                })
            );
            console.log(recipeId);
            setIngredientsList([]);
        } catch (error) {
            console.log("error");
        }
        // Send ingredientsList to your backend here
        console.log(ingredientsList);
        console.log(recipeName);
    }

    async function handleSubmitRecipeDetails() {
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
            handleSubmitIngredients(recipeData);

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
        handleSubmitRecipeDetails();
        //POSTGRESQL API, INGREDIENTS_NAMES, UNITS, NEW_INGREDIENTS? (IF NOT IN THE DB) AND QUANTITY
        navigate(`/recipe/${currentRecipeId}`);
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
            {
                ingredientId: 0,
                unitId: 0,
                quantity: 0,
                newIngredient: "",
                newUnit: "",
            },
        ]);
    };

    const handleIngredientChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        index: number
    ) => {
        const newIngredientsList = [...ingredientsList];
        newIngredientsList[index].ingredientId = parseInt(e.target.value);
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
        <div>
            <button onClick={goBack} className="take-me-back">
                Take me back!
            </button>
            <div className="form">
                <form className="formWrapper" onSubmit={handleSubmit}>
                    <label>
                        Recipe Name
                        <span className="required-star">*</span>
                        <input
                            className="formInput"
                            type="text"
                            placeholder="Enter recipe name here"
                            value={recipeName}
                            onChange={handleRecipeNameChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Description
                        <span className="required-star">*</span>
                        <textarea
                            placeholder="Enter a brief description of the recipe"
                            value={description}
                            onChange={handleDescriptionChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Instructions
                        <span className="required-star">*</span>
                        <textarea
                            placeholder="Enter step-by-step instructions for the recipe"
                            value={instructions}
                            onChange={handleInstructionsChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Recipe's picture URL
                        <input
                            className="formInput"
                            type="text"
                            placeholder="Enter a URL for an image of the recipe"
                            value={imageUrl}
                            onChange={handleImageUrlChange}
                        />
                    </label>
                    <br />
                    <h3>Ingredients</h3>
                    {ingredientsList.map((ingredient, index) => (
                        <div key={index}>
                            <label>
                                Ingredient
                                <span className="required-star">*</span>
                                <select
                                    value={ingredient.ingredientId}
                                    onChange={(e) =>
                                        handleIngredientChange(e, index)
                                    }
                                >
                                    <option value={0} disabled>
                                        Select an ingredient or enter a new one
                                    </option>
                                    {ingredients.map((ingredientName, i) => (
                                        <option
                                            key={i}
                                            value={ingredientName.id}
                                        >
                                            {ingredientName.name}
                                        </option>
                                    ))}
                                    <option value={-1}>
                                        Add a new Ingredient!
                                    </option>
                                </select>
                                {ingredient.ingredientId === -1 && (
                                    <label>
                                        New Ingredient
                                        <input
                                            className="newIngredient"
                                            type="text"
                                            value={ingredient.newIngredient}
                                            onChange={(e) =>
                                                handleNewIngredientChange(
                                                    e,
                                                    index
                                                )
                                            }
                                        />
                                    </label>
                                )}
                            </label>
                            <br />
                            <label>
                                Unit
                                <span className="required-star">*</span>
                                <select
                                    value={ingredient.unitId}
                                    onChange={(e) => handleUnitChange(e, index)}
                                >
                                    <option value={0} disabled>
                                        Select a unit or enter a new one
                                    </option>
                                    {units.map((unit, i) => (
                                        <option key={i} value={unit.id}>
                                            {unit.name}
                                        </option>
                                    ))}
                                    <option value={-1}>Add a new unit!</option>
                                </select>
                                {ingredient.unitId === -1 && (
                                    <label>
                                        New measuring unit
                                        <input
                                            className="formInput"
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
                                Quantity
                                <span className="required-star">*</span>
                                <input
                                    className="formInput"
                                    type="number"
                                    value={ingredient.quantity}
                                    onChange={(e) =>
                                        handleQuantityChange(e, index)
                                    }
                                />
                            </label>
                            <br />
                            <button
                                className="button"
                                type="button"
                                onClick={() => handleRemoveIngredient(index)}
                            >
                                Remove Ingredient
                            </button>
                            <br />
                        </div>
                    ))}
                    <button
                        className="button"
                        type="button"
                        onClick={handleAddIngredient}
                    >
                        Add Ingredient
                    </button>
                    <br />
                    <button
                        className="save-button"
                        type="submit"
                        value="Save Recipe"
                    >
                        Save Recipe
                    </button>
                </form>
            </div>
        </div>
    );
    return content;
};
export default RecipeForm;
