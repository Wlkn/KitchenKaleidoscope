import MediaCard from "../components/recipe";
import { useEffect, useState } from "react";
import "../styles/recipes.css";

import { Link } from "react-router-dom";
import { useGetAllRecipesQuery } from "../redux/slices/recipes";
import { HomeButton } from "../components/Buttons";

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
            <HomeButton/>
            <div className="container">
                {isLoading ? (
                    //TODO add loader
                    <div>Loading...</div>
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
                            imageURL={recipe.imageUrl}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
