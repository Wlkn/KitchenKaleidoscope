import { useParams } from "react-router-dom";
import { useGetUserRecipesByPageQuery } from "../redux/slices/recipes";
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
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
// interface UserRecipesProps {
//     _id: string;
//     name: string;
//     description: string;
//     instructions: string;
//     imageUrl: string;
//     isPublic: boolean;
// }

export default function UserPublicRecipes() {
    const name = localStorage.getItem("name");
    const navigate = useNavigate();
    const userId = useParams().id;
    const [usersRecipes, setUsersRecipes] = useState<any[]>([]);
    const [CreatorName, setCreatorName] = useState<string>("");
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);

    console.log(userId);
    let user_id = userId;
    const {
        data: userRecipesData,
        isSuccess,
        isLoading,
        isError,
    } = useGetUserRecipesByPageQuery(
        { page, user_id },
        {
            skip: false,
        }
    );

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
        if (isSuccess && userRecipesData) {
            const filteredRecipes = userRecipesData.recipes.filter(
                (recipe: any) => recipe !== null && recipe.isPublic === true
            );
            setUsersRecipes((prevRecipes) => [
                ...prevRecipes,
                ...filteredRecipes,
            ]);
            if (userRecipesData.length < 10) {
                setHasMore(false);
            }
        }
    }, [userRecipesData]);

    // const usersRecipesFiltered = usersRecipes?.filter(
    //     (usersRecipes: UserRecipesProps) => usersRecipes?.isPublic === true
    // );

    const userLoggedIn = userId ? true : false;

    if (isLoading) return <Loader />;
    if (isError) return <div>Error</div>;

    return (
        <div className="userPageRecipes-container">
            <header className="home-header-container">
                <Header />
                {userLoggedIn ? (
                    <div className="home-logout">
                        <MyRecipesButton userId={userId} />
                        <CreateNewRecipeButton />
                        <LogOutButton />
                        <Avatar
                            sx={{ ml: 2 }}
                            onClick={() => navigate(`/profile/`)}
                        >
                            {name && name[0]}
                        </Avatar>
                    </div>
                ) : (
                    <div className="home-login">
                        <a
                            className="hover-underline-animation"
                            href="/auth/login"
                        >
                            Login
                        </a>
                        <span className="or-text-home">or</span>
                        <a
                            className="hover-underline-animation"
                            href="/auth/signup"
                        >
                            Sign up
                        </a>
                    </div>
                )}
            </header>
            <div className="favoritePage-title">
                More from {userName?.name}{" "}
            </div>
            <div className="RecipeList-container">
                <InfiniteScroll
                    dataLength={usersRecipes.length}
                    next={() => setPage((prevPage) => prevPage + 1)}
                    hasMore={hasMore}
                    loader={<Loader />}
                    endMessage={
                        <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                    className="RecipeList-container"
                >
                    {usersRecipes.map((usersRecipes) => {
                        if (!usersRecipes) return null;
                        return (
                            <div
                                key={usersRecipes._id + page}
                                className="favoritePage-card"
                            >
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
                </InfiniteScroll>
            </div>
        </div>
    );
}
