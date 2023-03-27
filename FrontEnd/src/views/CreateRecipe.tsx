import React, { useEffect, useState } from "react";
import { useIngredientsMutation } from "../redux/slices/ingredients";
import { useRecipeMutation } from "../redux/slices/recipes";
import { setIngredients } from "../redux/reducers/ingredients";
import { addRecipe } from "../redux/reducers/recipes";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectCurrentRecipeId } from "../redux/reducers/recipes";
import "../styles/_recipeForm.scss";
import { useNavigate } from "react-router-dom";
import { LogOutButton, TakemeBackButton } from "../components/Buttons";
import Loader from "../components/Loader";
import Header from "../components/header";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
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

const RecipeForm: React.FC = () => {
    const name = localStorage.getItem("name");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [recipeName, setRecipeName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [instructions, setInstructions] = useState<string>("");
    const [fetchUnits, setFetchUnits] = useState<Unit[]>([]);
    const [fetchIngredients, setFetchIngredients] = useState<
        IngredientOption[]
    >([]);
    // const [isPublic, setIsPublic] = useState<boolean>(false); //todo: add this to the form, and make it work
    //REDUX
    //====================================================================================================
    const currentRecipeId: string = useSelector(selectCurrentRecipeId);
    //postgreSql
    const [recipeIngredients, { isLoading }] = useIngredientsMutation();
    const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
    //mongoDb
    const [recipe] = useRecipeMutation();
    //====================================================================================================
    //====================================================================================================
    //====================================================================================================
    //FETCHING INGREDIENTS AND UNITS
    //====================================================================================================
    //====================================================================================================
    async function fetchUnitsFromApi() {
        try {
            const response = await fetch(
                "https://kitchenkaleidoscope-server.onrender.com/api/units",
                requestOptions
            );
            if (response.ok) {
                const unitsJSON = await response.json();
                //console.log(unitsJSON); //todo remove
                return unitsJSON;
            } else {
                console.error(response.statusText);
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        async function fetchData() {
            const unitsJSON: any = await fetchUnitsFromApi();
            const units: Unit[] = unitsJSON.map((unit: Unit) => ({
                id: unit.id,
                name: unit.name,
            }));
            setFetchUnits(units);
        }

        fetchData();
    }, []);
    //====================================================================================================
    //INGREDIENTS

    async function fetchIngredientsFromApi() {
        try {
            const response = await fetch(
                "https://kitchenkaleidoscope-server.onrender.com/api/IngredientNames",
                requestOptions
            );
            if (response.ok) {
                const ingredientsJSON = await response.json();
                //console.log(ingredientsJSON); //todo remove
                return ingredientsJSON;
            } else {
                console.error(response.statusText);
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        async function fetchData() {
            const ingredientsJSON: any = await fetchIngredientsFromApi();
            const ingredients: IngredientOption[] = ingredientsJSON.map(
                (ingredient: IngredientOption) => ({
                    id: ingredient.id,
                    name: ingredient.name,
                })
            );
            setFetchIngredients(ingredients);
        }
        fetchData();
    }, []);
    //====================================================================================================
    //====================================================================================================
    //FETCHING INGREDIENTS AND UNITS
    //====================================================================================================
    //====================================================================================================
    useEffect(() => {
        if (currentRecipeId) {
            navigate(`/recipe/${currentRecipeId}`);
        }
    }, [currentRecipeId, navigate]);
    //====================================================================================================

    async function handleSubmitIngredients(recipeData: any) {
        try {
            console.log(ingredientsList);
            const recipeIngredientsData = await recipeIngredients({
                ingredientsList,
                recipeId: recipeData.recipeId,
            }).unwrap();
            //console.log(recipeId);
            dispatch(
                setIngredients({
                    ...recipeIngredientsData,
                    ingredientsList,
                    recipeId: recipeData.recipeId,
                })
            );      
            //console.log(recipeId);
            setIngredientsList([]);
        } catch (error) {
            //console.log("error");
        }
        // Send ingredientsList to your backend here
        //console.log(ingredientsList);
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
                isPublic,
            }).unwrap();
            dispatch(
                addRecipe({
                    ...recipeData,
                    recipeName,
                    description,
                    instructions,
                    imageUrl,
                    isPublic,
                })
            );
            //console.log(recipeData.recipeId);
            setRecipeName("");
            setDescription("");
            setInstructions("");
            setImageUrl("");
            handleSubmitIngredients(recipeData);
            console.log(...recipeData);
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

    const handleIsPublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        console.log(checked);
        checked ? setIsPublic(false) : setIsPublic(true);
    };

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

    const handleIngredientChange = (value: any, index: number) => {
        console.log(value?.id);
        const newIngredientsList = [...ingredientsList];
        newIngredientsList[index].ingredientId = parseInt(value?.id);
        setIngredientsList(newIngredientsList);
    };

    const handleUnitChange = (value: any, index: number) => {
        console.log(value.id);
        console.log(index);
        const newIngredientsList = [...ingredientsList];
        newIngredientsList[index].unitId = parseInt(value.id);
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
        <Loader />
    ) : (
        <div className="CreateRecipe-container">
            <header className="home-header-container">
                <Header />
                <div className="home-logout">
                    <TakemeBackButton />
                    <LogOutButton />
                    <Avatar
                        sx={{ ml: 2 }}
                        onClick={() => navigate(`/profile/`)}
                    >
                        {name && name[0]}
                    </Avatar>
                </div>
            </header>
            <div className="form">
                <form className="formWrapper" onSubmit={handleSubmit}>
                    <label>
                        <span className="label-text">Recipe Name</span>
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
                        <span className="label-text">Description </span>
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
                        <span className="label-text">Instructions </span>
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
                        <span className="label-text">
                            {" "}
                            Recipe's picture URL{" "}
                        </span>

                        <input
                            className="formInput"
                            type="text"
                            placeholder="Enter a URL for an image of the recipe"
                            value={imageUrl}
                            onChange={handleImageUrlChange}
                        />
                    </label>
                    <br />
                    <div className="ingredient-title">Ingredients</div>
                    {ingredientsList.map((ingredient, index) => (
                        <div key={index}>
                            <label>
                                <span className="label-text">Ingredient </span>
                                <span className="required-star">*</span>
                            </label>
                            <label>
                                <Autocomplete
                                    options={[
                                        {
                                            id: -1,
                                            name: "New Ingredient",
                                        },
                                        ...fetchIngredients,
                                    ]}
                                    getOptionLabel={(option) =>
                                        option.name || ""
                                    }
                                    fullWidth
                                    sx={{ color: "black" }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                        />
                                    )}
                                    onChange={(event, value) =>
                                        handleIngredientChange(value, index)
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                        option.id === value.id ||
                                        option.name === value.name
                                    }
                                />
                                {ingredient.ingredientId === -1 && (
                                    <label>
                                        <span className="label-text">
                                            New ingredient
                                        </span>
                                        <input
                                            className="formInput"
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
                            <label>
                                <span className="label-text">Unit </span>
                                <span className="required-star">*</span>
                            </label>
                            <label>
                                <Autocomplete
                                    options={[
                                        {
                                            id: -1,
                                            name: "New Unit",
                                        },
                                        ...fetchUnits,
                                    ]}
                                    getOptionLabel={(option) =>
                                        option.name || ""
                                    }
                                    fullWidth
                                    sx={{ color: "black" }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                        />
                                    )}
                                    onChange={(event, value) =>
                                        handleUnitChange(value, index)
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                        option.id === value.id ||
                                        option.name === value.name
                                    }
                                />

                                {ingredient.unitId === -1 && (
                                    <label>
                                        <span className="label-text">
                                            New measuring unit
                                        </span>

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

                            <label>
                                <span className="label-text"> Quantity</span>

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
                    <div className="isPublic-checkbox">
                        <span className="label-text">
                            Make the recipe private?
                        </span>
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                onChange={handleIsPublicChange}
                            />
                            <svg viewBox="0 0 21 18">
                                <symbol
                                    id="tick-path"
                                    viewBox="0 0 21 18"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5.22003 7.26C5.72003 7.76 7.57 9.7 8.67 11.45C12.2 6.05 15.65 3.5 19.19 1.69"
                                        fill="none"
                                    />
                                </symbol>
                                <defs>
                                    <mask id="tick">
                                        <use
                                            className="tick mask"
                                            href="#tick-path"
                                        />
                                    </mask>
                                </defs>
                                <use
                                    className="tick"
                                    href="#tick-path"
                                    stroke="currentColor"
                                />
                                <path
                                    fill="white"
                                    mask="url(#tick)"
                                    d="M18 9C18 10.4464 17.9036 11.8929 17.7589 13.1464C17.5179 15.6054 15.6054 17.5179 13.1625 17.7589C11.8929 17.9036 10.4464 18 9 18C7.55357 18 6.10714 17.9036 4.85357 17.7589C2.39464 17.5179 0.498214 15.6054 0.241071 13.1464C0.0964286 11.8929 0 10.4464 0 9C0 7.55357 0.0964286 6.10714 0.241071 4.8375C0.498214 2.39464 2.39464 0.482143 4.85357 0.241071C6.10714 0.0964286 7.55357 0 9 0C10.4464 0 11.8929 0.0964286 13.1625 0.241071C15.6054 0.482143 17.5179 2.39464 17.7589 4.8375C17.9036 6.10714 18 7.55357 18 9Z"
                                />
                            </svg>

                            <svg className="lines" viewBox="0 0 11 11">
                                <path d="M5.88086 5.89441L9.53504 4.26746" />
                                <path d="M5.5274 8.78838L9.45391 9.55161" />
                                <path d="M3.49371 4.22065L5.55387 0.79198" />
                            </svg>
                        </label>
                    </div>

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
