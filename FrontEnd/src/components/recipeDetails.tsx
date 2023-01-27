// import React from "react";
// import { useSelector } from "react-redux";
// import { selectCurrentRecipeId } from "../redux/reducers/recipes";
// import { selectCurrentToken } from "../redux/reducers/auth";
// import { useGetRecipesQuery } from "../redux/slices/recipes";
// export default function RecipeDetail() {
//     const currentRecipeId = useSelector(selectCurrentRecipeId);
//     const currentToken = useSelector(selectCurrentToken);

//     const {
//         data: recipeData,
//         isLoading,
//         isSuccess,
//         isError,
//         error,
//     } = useGetRecipesQuery(currentRecipeId, {
//         skip: !currentToken,
//         selectFromResult: ({ data }) => data,
//     });

//     let content;
//     if (isLoading) {
//         content = <p>Loading...</p>;
//     } else if (isSuccess) {
//         content = JSON.stringify(recipeData);
//     } else if (isError) {
//         content = <p>{error}</p>;
//     }

//     return (
//         <div>
//             <h1>Recipe Id: {currentRecipeId}</h1>
//             {content}
//         </div>
//     );
// }
