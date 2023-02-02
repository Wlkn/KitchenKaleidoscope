import MediaCard from "../components/recipe";
import { useEffect, useState } from "react";
import "../styles/recipes.css";

import { Link } from "react-router-dom";
import { useGetAllRecipesQuery } from "../redux/slices/recipes";
import { HomeButton } from "../components/Buttons";
import Loader from "../components/Loader";

export default function RecipeList() {
    const [recipes, setRecipes] = useState<Array<any>>([]);
    const { data, isLoading, isSuccess, isError, error } =
        useGetAllRecipesQuery({
            skip: false,
        });

    useEffect(() => {
        if (isSuccess && data) {
            setRecipes(data);
        }
    }, [data, isSuccess]);

    return (
        <div>
            <HomeButton />
            <br></br>
            <br></br>
                
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
