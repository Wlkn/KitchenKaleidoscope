import { useParams } from "react-router-dom";
import { useGetUserRecipesQuery } from "../redux/slices/recipes";
import { useGetUserNameQuery } from "../redux/slices/auth";
import MediaCard from "../components/recipe";
import "../styles/UsersPageRecipes.scss";
import Header from "../components/header";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import {
    LogOutButton,
    MyRecipesButton,
    CreateNewRecipeButton,
} from "../components/Buttons";
interface UserRecipesProps {
    _id: string;
    name: string;
    description: string;
    instructions: string;
    imageUrl: string;
    isPublic: boolean;
}

export default function UserPublicRecipes() {
    const userId = useParams().id;
    const [usersRecipes, setUsersRecipes] = useState<Array<any>>([]);
    const [CreatorName, setCreatorName] = useState<string>("");
    console.log(userId);
    const { data, isLoading, isSuccess, isError, error } =
        useGetUserRecipesQuery(userId, {
            skip: false,
        });
    const { data: userName, isLoading: userNameLoading } = useGetUserNameQuery(
        userId,
        {
            skip: false,
        }
    );

    useEffect(() => {
        if (userNameLoading === false) {
            setCreatorName(userName?.name);
        }
    }, [userNameLoading, userName]);

    useEffect(() => {
        if (isSuccess && data) {
            setUsersRecipes(data.recipes);
        }
    }, [data, isSuccess]);

    const usersRecipesFiltered = usersRecipes?.filter(
        (usersRecipes: UserRecipesProps) => usersRecipes?.isPublic === true
    );

    const userLoggedIn = userId ? true : false;

    if (isLoading) return <Loader />;
    if (isError) return <div>Error</div>;

    return (
        <div className="userPageRecipes-container">
            <header className="home-header-container">
                <Header />
                <div className="home-logout">
                    <MyRecipesButton userId={userId} />
                    <CreateNewRecipeButton />
                    {userLoggedIn ? (
                        <LogOutButton />
                    ) : (
                        <div>You aren't supposed to be here...</div>
                    )}
                </div>
            </header>
            <div className="favoritePage-title">
                More from {userName?.name}{" "}
            </div>
            <div className="RecipeList-container">
                {usersRecipesFiltered?.map((usersRecipes: UserRecipesProps) => {
                    if (!usersRecipes) return null;
                    return (
                        <div key={usersRecipes._id}>
                            <MediaCard
                                _id={usersRecipes._id}
                                name={usersRecipes.name}
                                description={usersRecipes.description}
                                instructions={usersRecipes.instructions}
                                imageUrl={usersRecipes.imageUrl}
                                isPublic={!usersRecipes.isPublic}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
