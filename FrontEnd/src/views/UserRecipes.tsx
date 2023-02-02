import React from "react";
import { useEffect, useState } from "react";
import { useGetUserRecipesQuery } from "../redux/slices/recipes";
import MediaCard from "../components/recipe";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../redux/reducers/auth";
import { useParams } from "react-router-dom";
import "../styles/recipes.css";
import { ProfileButton, TakemeBackButton } from "../components/Buttons";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
interface UserCreatedRecipesProps {
    _id: string;
    name: string;
    description: string;
    instructions: string;
    imageUrl: string;
}

const UserRecipes: React.FC = () => {
    // window.onbeforeunload = function() {
    //     window.setTimeout(function () {

    //     }, 0);
    //     window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser
    // }
    const navigate = useNavigate();

    const { id } = useParams();
    const user_id = id?.toString();
    console.log(user_id);
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
    console.log(UserCreatedRecipes);
    return (
        <div>
            <ProfileButton />
            <TakemeBackButton />
            <p className="h1-userRecipes">Theses are your recipes!</p>
            <p className="h2-LearnMore">
                Click on learn more to edit, or delete the recipes.
            </p>
            <div className="container">
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
