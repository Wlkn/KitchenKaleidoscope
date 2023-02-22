import {
    useGetAllRecipesQuery,
    useGetUserLikesQuery,
    useGetCreatorOfRecipeQuery,
} from "../redux/slices/recipes";
import { useEffect, useState } from "react";
import MediaCard from "../components/recipe";
import Header from "../components/header";
import "../styles/favoritePage.scss";
import { LogOutButton } from "../components/Buttons";
import Loader from "../components/Loader";

export default function FavoritePage() {
    const userId = localStorage.getItem("userId");
    const [favorites, setFavorites] = useState([]);
    const [recipes, setRecipes] = useState([]);

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
            const favorites = recipes.filter((recipe: any) =>
                favoritesData.some(
                    (favorite: any) => favorite.recipe_id === recipe._id
                )
            );
            setFavorites(favorites);
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
            <div className="home-header-container">
                <Header />
                <div className="home-logout">
                    {/* <ProfileButton />
                    <MyRecipesButton userId={userId} /> */}
                    <LogOutButton />
                </div>
            </div>
            <div className="favoritePage-title">Favorite Recipes</div>
            <div className="favoritePage-body">
                {favorites?.length > 0 ? (
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
                    ))
                ) : (
                    <div>No favorites found.</div>
                )}
            </div>
        </div>
    );
}
