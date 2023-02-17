import MediaCard from "../components/recipe";
import { useEffect, useState } from "react";
import "../styles/recipes.css";
import Header from "../components/header";
import { useSelector } from "react-redux";
import {
    selectCurrentToken,
    selectCurrentUserId,
} from "../redux/reducers/auth";
import { useGetAllRecipesQuery } from "../redux/slices/recipes";
import { HomeButton } from "../components/Buttons";
import Loader from "../components/Loader";
import { LogOutButton } from "../components/Buttons";
import { MyRecipesButton } from "../components/Buttons";
import { colors } from "material-ui/styles";
export default function RecipeList() {
    const [recipes, setRecipes] = useState<Array<any>>([]);
    const { data, isLoading, isSuccess, isError } = useGetAllRecipesQuery({
        skip: false,
    });

    useEffect(() => {
        if (isSuccess && data) {
            setRecipes(data);
        }
    }, [data, isSuccess]);
    const currentToken =
        localStorage.getItem("token") || useSelector(selectCurrentToken);

    const currentUserId =
        localStorage.getItem("userId") || useSelector(selectCurrentUserId);

    const userId = currentUserId;
    const userLoggedIn = currentUserId && currentToken ? true : false;

    return (
        <div className="recipeListPage-container">
            <header className="RecipeList-header-container">
                <Header />
                {userLoggedIn ? (
                    <div className="home-logout">
                        <LogOutButton />
                        <MyRecipesButton userId={userId} />
                    </div>
                ) : (
                    <div className="home-login">
                        <a
                            className="hover-underline-animation"
                            href="/auth/login"
                        >
                            Login
                        </a>
                        <span>or</span>
                        <a
                            className="hover-underline-animation"
                            href="/auth/signup"
                        >
                            Sign up
                        </a>
                    </div>
                )}
            </header>
            <div className="RecipeList-container">
                {isLoading ? (
                    <Loader />
                ) : isError ? (
                    <div>error</div>
                ) : (
                    recipes.map((recipe: any) => (
                        <MediaCard
                        
                            key={recipe._id}
                            _id={recipe._id}
                            name={recipe.name}
                            description={recipe.description}
                            instructions={recipe.instructions}
                            imageUrl={recipe.imageUrl}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
