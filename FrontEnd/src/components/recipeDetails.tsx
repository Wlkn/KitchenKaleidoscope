import { useSelector } from "react-redux";
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
import { VisitRecipeListButton } from "../components/Buttons";
import Loader from "./Loader";
import RecipeList from "../views/RecipeList";
import DeleteEdit from "./DeleteEdit";
import { useEditRecipeMutation } from "../redux/slices/recipes";
import { useDeleteRecipeMutation } from "../redux/slices/recipes";
import { removeRecipe } from "../redux/reducers/recipes";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

interface DeleteDataType {
    success: boolean;
    message?: string;
}

export default function RecipeDetails() {
    let { id } = useParams();
    const navigate = useNavigate();
    const [removeRecipe] = useDeleteRecipeMutation();
    console.log(id);
    const currentRecipeId = useSelector(selectCurrentRecipeId);
    const currentToken =
        useSelector(selectCurrentToken) || localStorage.getItem("token");
    const recipe_id: string = currentRecipeId || id;
    // const currentToken = useSelector(selectCurrentToken);
    console.log(currentToken);
    const currentUserId =
        useSelector(selectCurrentUserId) || localStorage.getItem("userId");
    console.log(currentUserId);

    const { data: CreatorOfRecipe } = useGetCreatorOfRecipeQuery(id, {
        skip: !currentToken,
    });
    const [deleteData, setDeleteData] = useState<DeleteDataType | null>(null);
    // export const { useEditRecipeMutation } = RecipeApiSlice;

    // export const { useDeleteRecipeMutation } = RecipeApiSlice;
    //wrap everything inside an async function
    const {
        data: recipeData,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetRecipesQuery(id, {
        skip: !currentToken,
    });

    const sendDeleteRequest = async () => {
        // await removeRecipe(recipe_id);
        // setDeleteData(null);
    };

    const sendEditRequest = async () => {};

    useEffect(() => {
        if (deleteData && deleteData.success) {
            navigate(-1);
        }
    }, [deleteData]);

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
            </div>
        );
    } else if (isError) {
        throw error;
    }

    return (
        <div>
            <VisitRecipeListButton />
            {content}
            <DeleteEdit
                deleteFunc={sendDeleteRequest}
                editFunc={sendEditRequest}
                data={recipeData}
            />
        </div>
    );
}
