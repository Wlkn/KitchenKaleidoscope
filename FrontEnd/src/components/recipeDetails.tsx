import { useDispatch, useSelector } from "react-redux";
import { selectCurrentRecipeId } from "../redux/reducers/recipes";
import {
    selectCurrentToken,
    selectCurrentUserId,
} from "../redux/reducers/auth";
import {
    useGetRecipesQuery,
    useGetCreatorOfRecipeQuery,
} from "../redux/slices/recipes";
import { useParams } from "react-router-dom";
import { MyRecipesButton, TakemeBackButton } from "../components/Buttons";
import Loader from "./Loader";

import DeleteEdit from "./DeleteEdit";
import { useEditRecipeMutation } from "../redux/slices/recipes";
import { useDeleteRecipeMutation } from "../redux/slices/recipes";

import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { editRecipe } from "../redux/reducers/recipes";
import Header from "./header";
import "../styles/recipeDetails.scss";
interface DeleteDataType {
    success: boolean;
    message?: string;
}

interface Unit {
    id: number;
    name: string;
}
interface IngredientOption {
    id: number;
    name: string;
}

import { useFetchIngredientsByRecipeIdQuery } from "../redux/slices/ingredients";

export default function RecipeDetails(formData: any) {
    let { id } = useParams();
    const currentRecipeId = useSelector(selectCurrentRecipeId);
    const recipe_id: string = currentRecipeId || id;
    // console.log(id);
    // console.log(formData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [removeRecipe] = useDeleteRecipeMutation();
    const [editRecipeMutation] = useEditRecipeMutation();

    const currentToken =
        useSelector(selectCurrentToken) || localStorage.getItem("token");
    const currentUserId =
        useSelector(selectCurrentUserId) || localStorage.getItem("userId");

    const { data: CreatorOfRecipe } = useGetCreatorOfRecipeQuery(id, {});
    const [deleteData, setDeleteData] = useState<DeleteDataType | null>(null);

    const [fetchUnits, setFetchUnits] = useState<Unit[]>([]);
    const [fetchIngredients, setFetchIngredients] = useState<
        IngredientOption[]
    >([]);
    const requestOptions = {
        method: "GET",
    };

    const {
        data: recipeData,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetRecipesQuery(id, {});

    const { data: ingredientsData } = useFetchIngredientsByRecipeIdQuery(
        id,
        {}
    );
    console.log(ingredientsData);

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
            console.log(units);
        }

        fetchData();
    }, []);

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
            console.log(ingredients);
        }
        fetchData();
    }, []);

    const sendDeleteRequest = async () => {
        if (currentUserId) {
            try {
                await removeRecipe(recipe_id);
                // console.log(deleteData);
            } catch (error) {
                console.error(error);
            }
            setTimeout(() => {
                navigate(`/myrecipes/${currentUserId}`);
                window.location.reload();
            }, 1600);
        }
    };

    const sendEditRequest = async (data: any) => {
        if (currentUserId) {
            try {
                const recipeData = await editRecipeMutation({
                    recipe_id,
                    ...data,
                }).unwrap();

                dispatch(editRecipe({ recipeData }));
            } catch (error) {
                console.error(error);
            }
            setTimeout(() => {
                navigate(`/myrecipes/${currentUserId}`);
                window.location.reload();
            }, 1600);
        }
    };
    let content;
    if (isLoading) {
        content = <Loader />;
    } else if (isSuccess && recipeData && CreatorOfRecipe && ingredientsData) {
        const { name, description, instructions, imageUrl } = recipeData;
        const { userId, OwnerName } = CreatorOfRecipe;
        const ingredientList = ingredientsData.map((ingredient: any) => {
            const { quantity, unit_id, ingredient_id } = ingredient;
            const unit = fetchUnits.find((unit) => unit.id === unit_id);
            const ingredientName = fetchIngredients.find(
                (ingredient) => ingredient.id === ingredient_id
            );
            return (
                <li key={ingredient_id}>
                    {quantity} {unit?.name} of {ingredientName?.name}
                </li>
            );
        });
        content = (
            <div className="recipeInfo-container">
                <div className="recipe-title">{name}</div>
                <div className="recipe-author">Made By: {OwnerName}</div>
                <div className="recipe-description">{description}</div>
                <div>ADD A LIKE NUMBER AND LIKE BUTTON</div>
                <img
                    className="recipe-image"
                    src={imageUrl}
                    alt="recipe image"
                />
                <div className="recipe-instructions-title">Directions</div>
                <div className="recipe-instructions">{instructions}</div>
                {currentUserId === userId && (
                    <div className="recipe-deleteEdit-buttons">
                        <DeleteEdit
                            deleteFunc={sendDeleteRequest}
                            editFunc={sendEditRequest}
                            data={formData}
                        />
                    </div>
                )}
                <div className="recipe-ingredients-title">Ingredients</div>
                <div className="recipe-ingredients">
                    <ul>{ingredientList}</ul>
                </div>
            </div>
        );
    } else if (isError) {
        throw error;
    }

    return (
        <div className="recipeDetails-container">
            <div className="recipeDetails-header-container">
                <Header />
                <div className="recipeDetails-header-buttons">
                    { currentUserId && <MyRecipesButton userId={currentUserId} />}
                    
                    <TakemeBackButton />
                </div>
            </div>
            {content}
        </div>
    );
}
