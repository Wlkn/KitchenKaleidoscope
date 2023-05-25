import {
    useGetAllRecipesQuery,
    useGetUserLikesQuery,
} from "../redux/slices/recipes";
import { useEffect, useState } from "react";
import MediaCard from "../components/recipe";
import Header from "../components/header";
import "../styles/favoritePage.scss";
import { LogOutButton } from "../components/Buttons";
import Loader from "../components/Loader";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
export default function FavoritePage() {
    const navigate = useNavigate();
    const name = localStorage.getItem("name");
    const userId = localStorage.getItem("userId");
    const [favorites, setFavorites] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [NoFavorites, setNoFavorites] = useState(false);
    const { data: recipesData, isLoading: recipesIsLoading } =
        useGetAllRecipesQuery({});

    const {
        data: favoritesData,
        isLoading: favoritesIsLoading,
        error: favoritesError,
        isSuccess: favoritesIsSuccess,
    } = useGetUserLikesQuery(userId, {
        skip: !userId,
    });

    useEffect(() => {
        if (recipesData) {
            setRecipes(recipesData);
        }
    }, [recipesData]);

    useEffect(() => {
        if (favoritesData && favoritesIsSuccess && recipes) {
            console.log(favoritesData);
            if (favoritesData.message === "No liked recipes found") {
                console.log("no favorites");
                setFavorites([]);
                setNoFavorites(true);
            } else {
                const favorites = recipes.filter((recipe: any) =>
                    favoritesData.some(
                        (favorite: any) => favorite.recipe_id === recipe._id
                    )
                );
                setFavorites(favorites);
            }
        }
    }, [favoritesData, favoritesIsSuccess, recipes]);

    return favoritesError ? (
        <div className="home-header-container">
            <Header />
            <h1>Error loading favorites</h1>
        </div>
    ) : favoritesIsLoading || recipesIsLoading ? (
        <div>
            <Header />
            <Loader />
        </div>
    ) : (
        <div className="favoritePage-container">
            <Helmet>
                <title>KKaleido | Favorites</title>
            </Helmet>
            <div className="home-header-container">
                <Header />
                <div className="home-logout">
                    {/* <ProfileButton />
                    <MyRecipesButton userId={userId} /> */}
                    <LogOutButton />
                    <Avatar
                        sx={{ ml: 2 }}
                        onClick={() => navigate(`/profile/`)}
                    >
                        {name && name[0]}
                    </Avatar>
                </div>
            h</div>
            <div className="favoritePage-title">Favorite Recipes</div>
            <div className="RecipeList-container">
                {favorites?.length > 0 &&
                    favorites?.map((favorite: any) => (
                        <div className="favoritePage-card" key={favorite._id}>
                            <MediaCard
                                _id={favorite._id}
                                name={favorite.name}
                                description={favorite.description}
                                instructions={favorite.instructions}
                                imageUrl={favorite.imageUrl}
                                isPublic={!favorite.isPublic}
                            />
                        </div>
                    ))}
                {NoFavorites === true ? (
                    <div className="favoritePage-title">
                        You have no favorite recipes. Click on the heart icon on
                        a recipe to add it to your favorites.
                    </div>
                ) : null}
            </div>
        </div>
    );
}
