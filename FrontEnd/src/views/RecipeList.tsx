import "../styles/recipes.css";
import Header from "../components/header";
import { useSelector } from "react-redux";
import {
    selectCurrentToken,
    selectCurrentUserId,
} from "../redux/reducers/auth";
import { useGetAllRecipesQuery } from "../redux/slices/recipes";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { LogOutButton } from "../components/Buttons";
import { MyRecipesButton } from "../components/Buttons";
import MediaCard from "../components/recipe";

export default function RecipeList() {
    const [recipes, setRecipes] = useState<Array<any>>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { data, isLoading, isSuccess, isError } = useGetAllRecipesQuery({
        skip: false,
    });

    useEffect(() => {
        if (isSuccess && data) {
            setRecipes(
                data.filter(
                    (recipe: any) =>
                        recipe.isPublic &&
                        recipe.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) // Only show recipes that are marked as public and match the search term
                )
            );
        }
    }, [data, isSuccess, searchTerm]);

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
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search for recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {userLoggedIn ? (
                    <div className="home-logout">
                        <MyRecipesButton userId={userId} />
                        <LogOutButton />
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
                    <div>
                        Sorry, the servers are very slow, please wait a
                        moment...
                        <Loader />
                    </div>
                ) : isError ? (
                    <div className="errorText">Error view console</div>
                ) : (
                    recipes.map((recipe: any) => (
                        <MediaCard
                            key={recipe._id}
                            _id={recipe._id}
                            name={recipe.name}
                            description={recipe.description}
                            instructions={recipe.instructions}
                            imageUrl={recipe.imageUrl}
                            isPublic={!recipe.isPublic}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
