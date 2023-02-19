import { useParams } from "react-router-dom";
import { useGetUserRecipesQuery } from "../redux/slices/recipes";
import { useGetUserNameQuery } from "../redux/slices/auth";
import MediaCard from "../components/recipe";
import "../styles/usersPageRecipes.scss";
import Header from "../components/header";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

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
    console.log(userName);

    useEffect(() => {
        if (isSuccess && data) {
            setUsersRecipes(data.recipes);
        }
    }, [data, isSuccess]);

    const usersRecipesFiltered = usersRecipes.filter(
        (usersRecipes: UserRecipesProps) => usersRecipes.isPublic === true
    );

    if (isLoading) return <Loader />;
    if (isError) return <div>Error</div>;

    return (
        <div className="userPageRecipes-container">
            <header className="RecipeList-header-container">
                <Header />
                <div className="home-logout">
                    {/* <MyRecipesButton userId={userId} />
                    <CreateNewRecipeButton />
                    {userLoggedIn ? (
                        <LogOutButton />
                    ) : (
                        <div>You aren't supposed to be here...</div>
                    )} */}
                </div>
            </header>
            <h1>More from {} </h1>
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
    );
}
