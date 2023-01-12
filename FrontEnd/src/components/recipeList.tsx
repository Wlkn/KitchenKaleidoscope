import React, { useState } from "react";
import MediaCard from "./recipe";

function RecipeList() {
    const [recipes, setRecipes] = useState<Array<any>>([]);
    const apiUrl = "http://localhost:4000/api/recipes/";
    const fetchData = async () => {
        try {
            const response = await fetch(apiUrl);
            const json = await response.json();
            setRecipes(json);
        } catch (error) {
            console.log("error", error);
        }
    };
    fetchData();
    return (
        <div>
            {recipes.length === 0 ? (
                //TODO add loader
                <div>Loading...</div>
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
    );
}

export default RecipeList;
