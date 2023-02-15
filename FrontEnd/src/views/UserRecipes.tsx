import React from "react";
import { useEffect, useState } from "react";
import { useGetUserRecipesQuery } from "../redux/slices/recipes";
import MediaCard from "../components/recipe";
import "../styles/userRecipes.scss";
import Header from "../components/header";
import { useParams } from "react-router-dom";
import "../styles/recipes.css";
import {
    CreateNewRecipeButton,
    ProfileButton,
    LogOutButton,

} from "../components/Buttons";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    selectCurrentToken,
    selectCurrentUserId,
} from "../redux/reducers/auth";
interface UserCreatedRecipesProps {
    _id: string;
    name: string;
    description: string;
    instructions: string;
    imageUrl: string;
}

const UserRecipes: React.FC = () => {
    const currentToken =
        localStorage.getItem("token") || useSelector(selectCurrentToken);
    const currentUserId =
        localStorage.getItem("userId") || useSelector(selectCurrentUserId);
    const userLoggedIn = currentUserId && currentToken ? true : false;
    const { id } = useParams();
    const user_id = id?.toString();
    //console.log(user_id);
    const [UserCreatedRecipes, setUserRecipes] = useState<Array<any>>([]);
    const { data, isLoading, error, isSuccess } = useGetUserRecipesQuery(
        user_id,
        {
            skip: false,
        }
    );

    useEffect(() => {
        if (isSuccess && data) {
            setUserRecipes(data.recipes);
        }
    }, [data, isSuccess]);

    if (isLoading) return <Loader />;
    if (error) return <div>Error</div>;
    //console.log(UserCreatedRecipes);
    return (
        <div className="userRecipes-container">
            <div className="userRecipes-header-container">
                <Header />
                <div className="userRecipes-header-buttons">
                    <ProfileButton />
                    <CreateNewRecipeButton />
                    {userLoggedIn ? (
                        <LogOutButton />
                    ) : (
                        <div>You aren't supposed to be here...</div>
                    )}
                </div>
            </div>
            <p className="h1-userRecipes">Theses are your recipes!</p>
            <p className="h2-LearnMore">
                Click on learn more to edit, or delete the recipes.
            </p>
            <div className="userRecipes-recipes">
                {UserCreatedRecipes.map(
                    (UserCreatedRecipes: UserCreatedRecipesProps) => {
                        if (!UserCreatedRecipes) return null;
                        return (
                            <MediaCard
                                key={UserCreatedRecipes._id}
                                _id={UserCreatedRecipes._id}
                                name={UserCreatedRecipes.name}
                                description={UserCreatedRecipes.description}
                                instructions={UserCreatedRecipes.instructions}
                                imageUrl={UserCreatedRecipes.imageUrl}
                            />
                        );
                    }
                )}
            </div>
        </div>
    );
};

export default UserRecipes;
