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
import RecipeList from "../views/RecipeList";

export default function RecipeDetails() {
    let { id } = useParams();
    console.log(id);
    const currentRecipeId = useSelector(selectCurrentRecipeId);
    const currentToken =
        useSelector(selectCurrentToken) || localStorage.getItem("token");

    // const currentToken = useSelector(selectCurrentToken);
    console.log(currentToken);
    const currentUserId =
        useSelector(selectCurrentUserId) || localStorage.getItem("userId");
    console.log(currentUserId);

    const { data: CreatorOfRecipe } = useGetCreatorOfRecipeQuery(id, {
        skip: !currentToken,
    });

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
    let content;
    if (isLoading) {
        content = <p>Loading...</p>;
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
                {userId === currentUserId && (
                    <div>
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                )}
            </div>
        );
    } else if (isError) {
        throw error;
    }

    return (
        <div>
            <VisitRecipeListButton />
            {content}
        </div>
    );
}
