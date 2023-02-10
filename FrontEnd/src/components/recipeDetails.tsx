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
import React, { useState } from "react";

import { editRecipe } from "../redux/reducers/recipes";

interface DeleteDataType {
    success: boolean;
    message?: string;
}

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
    // const currentToken = useSelector(selectCurrentToken);
    // console.log(currentToken);
    const currentUserId =
        useSelector(selectCurrentUserId) || localStorage.getItem("userId");
    // console.log(currentUserId);

    const { data: CreatorOfRecipe } = useGetCreatorOfRecipeQuery(id, {
        skip: !currentToken,
    });
    const [deleteData, setDeleteData] = useState<DeleteDataType | null>(null);
    // const [formData, setFormData] = useState({})
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

    // console.log("deleteData", deleteData);
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
        return (
            <div>
                <MyRecipesButton userId={currentUserId} />
                <TakemeBackButton />
                {content}
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
}
