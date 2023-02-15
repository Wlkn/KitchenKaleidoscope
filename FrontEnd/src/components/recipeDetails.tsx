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

interface DeleteDataType {
    success: boolean;
    message?: string;
}

interface Unit {
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

    const { data: CreatorOfRecipe } = useGetCreatorOfRecipeQuery(id, {
        skip: !currentToken,
    });
    const [deleteData, setDeleteData] = useState<DeleteDataType | null>(null);

    const [fetchUnits, setFetchUnits] = useState<Unit[]>([]);
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
        },
    };

    const {
        data: recipeData,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetRecipesQuery(id, {
        skip: !currentToken,
    });

    const { data: ingredientsData } = useFetchIngredientsByRecipeIdQuery(id, {
        skip: !currentToken,
    });
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

    const sendDeleteRequest = async () => {
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
    };

    const sendEditRequest = async (data: any) => {
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
    };
    let content;
    if (isLoading) {
        content = <Loader />;
    } else if (isSuccess && recipeData && CreatorOfRecipe) {
        const { name, description, instructions } = recipeData;
        const { userId, OwnerName } = CreatorOfRecipe;

        content = (
            <div>
                <h2>Title</h2>
                <p>{name}</p>
                <h3>Description:</h3>
                <p>{description}</p>
                <h3>Instructions:</h3>
                <p>{instructions}</p>
                <h3>Author</h3>
                <p>{OwnerName}</p>
                <h3>Author ID</h3>
                <p>{userId}</p>
                {currentUserId === userId && (
                    <DeleteEdit
                        deleteFunc={sendDeleteRequest}
                        editFunc={sendEditRequest}
                        data={formData}
                    />
                )}
            </div>
        );
    } else if (isError) {
        throw error;
    }

    return (
        <div>
            <MyRecipesButton userId={currentUserId} />
            <TakemeBackButton />
            {content}
        </div>
    );
}
