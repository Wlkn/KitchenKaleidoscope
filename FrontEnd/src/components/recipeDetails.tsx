import { useDispatch, useSelector } from "react-redux";
import { selectCurrentRecipeId } from "../redux/reducers/recipes";
import { selectCurrentUserId } from "../redux/reducers/auth";
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
import { useState, useEffect } from "react";
import { editRecipe } from "../redux/reducers/recipes";
import Header from "./header";
import "../styles/recipeDetails.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useFetchIngredientsByRecipeIdQuery } from "../redux/slices/ingredients";

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

export default function RecipeDetails(formData: any) {
    const MySwal = withReactContent(Swal);
    let { id } = useParams();
    const currentRecipeId = useSelector(selectCurrentRecipeId);
    const recipe_id: string = currentRecipeId || id;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [removeRecipe] = useDeleteRecipeMutation();
    const [editRecipeMutation] = useEditRecipeMutation();
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
    //DATA FETCHING
    //DATA FETCHING
    //DATA FETCHING
    //DATA FETCHING
    //DATA FETCHING
    //DATA FETCHING
    const {
        data: recipeData,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetRecipesQuery(id, {});

    console.log(recipeData);

    const { data: ingredientsData } = useFetchIngredientsByRecipeIdQuery(
        id,
        {}
    );

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
            const ingredients: IngredientOption[] = ingredientsJSON?.map(
                (ingredient: IngredientOption) => ({
                    id: ingredient.id,
                    name: ingredient.name,
                })
            );
            setFetchIngredients(ingredients);
        }
        fetchData();
    }, []);
    //DATA FETCHING
    //DATA FETCHING
    //DATA FETCHING
    //DATA FETCHING
    //DATA FETCHING
    //DATA FETCHING
    //
    //
    //
    //
    //
    //HANDLING
    //HANDLING
    //HANDLING
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
            }, 500);
        }
    };

    const sendEditRequest = async (data: any) => {
        if (currentUserId) {
            try {
                const recipeData = await editRecipeMutation({
                    ...data,
                    recipe_id: data._id,
                }).unwrap();
                // console.log(data);
                // console.log(recipeData);

                dispatch(editRecipe({ recipeData }));
            } catch (error) {
                console.error(error);
            }
            setTimeout(() => {
                navigate(`/myrecipes/${currentUserId}`);
                window.location.reload();
            }, 500);
        }
    };

    const handleChangeIsPublic = (e: any) => {
        const isPublic = !recipeData?.isPublic;
        MySwal.fire({
            title: (
                <p>
                    The Recipe has been successfully made{" "}
                    {isPublic ? "Public" : "Private"}!
                </p>
            ),
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
        });

        const data = { ...recipeData, isPublic };

        sendEditRequest(data);
    };
    //HANDLING
    //HANDLING
    //HANDLING

    let content;
    if (isLoading) {
        content = <Loader />;
    } else if (isSuccess && recipeData && CreatorOfRecipe && ingredientsData) {
        const {
            name,
            description,
            instructions,
            imageUrl,
            isPublic,
            area,
            category,
        } = recipeData;
        const { userId, OwnerName } = CreatorOfRecipe;
        const ingredientList = ingredientsData.map((ingredient: any) => {
            const { quantity, unit_id, ingredient_id } = ingredient;
            const unit = fetchUnits.find((unit) => unit.id === unit_id);
            const ingredientName = fetchIngredients.find(
                (ingredient) => ingredient?.id === ingredient_id
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
                <div className="category-area-text">
                    {category}, {area}
                </div>
                {currentUserId === userId ? (
                    <div className="recipe-public">
                        {isPublic ? (
                            <span className="recipe-private">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        width: "100%",
                                        height: "100%",
                                        marginBottom: "2px",
                                    }}
                                >
                                    <div className="private-text">
                                        The recipe is public, everyone can see
                                        it.
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="coral"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-lock"
                                    >
                                        <rect
                                            x="3"
                                            y="11"
                                            width="18"
                                            height="11"
                                            rx="2"
                                            ry="2"
                                        ></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0"></path>
                                    </svg>
                                </div>
                                <div
                                    className="changeIsPublic"
                                    onClick={handleChangeIsPublic}
                                >
                                    Make the recipe private
                                </div>
                            </span>
                        ) : (
                            <span className="recipe-private">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        width: "100%",
                                        height: "100%",
                                        marginBottom: "2px",
                                    }}
                                >
                                    <div className="private-text">
                                        The recipe is private, only you can see
                                        it.
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="coral"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-lock"
                                    >
                                        <rect
                                            x="3"
                                            y="11"
                                            width="18"
                                            height="11"
                                            rx="2"
                                            ry="2"
                                        ></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                                <div
                                    className="changeIsPublic"
                                    onClick={handleChangeIsPublic}
                                >
                                    Make the recipe public
                                </div>
                            </span>
                        )}
                    </div>
                ) : null}

                <a href={`/user/${userId}`} className="recipe-author">
                    Made By: {OwnerName}
                </a>
                <div className="recipe-description">{description}</div>
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
                            recipeData={recipeData}
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
            <div className="home-header-container">
                <Header />
                {/* <div className="recipeDetails-header-buttons">
                    {currentUserId && (
                        <MyRecipesButton userId={currentUserId} />
                    )}

                </div> */}
            </div>
            {/* <TakemeBackButton /> */}
            {content}
        </div>
    );
}
