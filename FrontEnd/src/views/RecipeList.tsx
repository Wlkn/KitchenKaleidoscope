import "../styles/recipes.scss";
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

                {userLoggedIn ? (
                    <div className="home-logout">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder=" "
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div>
                                <svg>
                                    <path
                                        d="M32.9418651,-20.6880772 C37.9418651,-20.6880772 40.9418651,-16.6880772 40.9418651,-12.6880772 C40.9418651,-8.68807717 37.9418651,-4.68807717 32.9418651,-4.68807717 C27.9418651,-4.68807717 24.9418651,-8.68807717 24.9418651,-12.6880772 C24.9418651,-16.6880772 27.9418651,-20.6880772 32.9418651,-20.6880772 L32.9418651,-29.870624 C32.9418651,-30.3676803 33.3448089,-30.770624 33.8418651,-30.770624 C34.08056,-30.770624 34.3094785,-30.6758029 34.4782612,-30.5070201 L141.371843,76.386562"
                                        transform="translate(83.156854, 22.171573) rotate(-225.000000) translate(-83.156854, -22.171573)"
                                    ></path>
                                </svg>
                            </div>
                        </div>
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
                        <div className="favoritePage-card" key={recipe._id}>
                            <MediaCard
                                _id={recipe._id}
                                name={recipe.name}
                                description={recipe.description}
                                instructions={recipe.instructions}
                                imageUrl={recipe.imageUrl}
                                isPublic={!recipe.isPublic}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
