import React from "react";
import { useEffect, useState } from "react";
import { useGetUserRecipesQuery } from "../redux/slices/recipes";
import MediaCard from "../components/recipe";
import "../styles/userRecipes.scss";
import Header from "../components/header";
import { useParams } from "react-router-dom";
import "../styles/recipes.scss";
import {
    CreateNewRecipeButton,
    ProfileButton,
    LogOutButton,
} from "../components/Buttons";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import {
    selectCurrentToken,
    selectCurrentUserId,
} from "../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
interface UserCreatedRecipesProps {
    _id: string;
    name: string;
    description: string;
    instructions: string;
    imageUrl: string;
    isPublic: boolean;
}

const UserRecipes: React.FC = () => {
    const name = localStorage.getItem("name");
    const navigate = useNavigate();
    const currentToken =
        localStorage.getItem("token") || useSelector(selectCurrentToken);
    const currentUserId =
        localStorage.getItem("userId") || useSelector(selectCurrentUserId);
    const userLoggedIn = currentUserId && currentToken ? true : false;
    const { id } = useParams();
    const user_id = id?.toString();
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

    return (
        <div className="userRecipes-container">
            <div className="home-header-container">
                <Header />
                {userLoggedIn ? (
                    <div className="home-logout">
                        <ProfileButton />
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
            </div>
            <p className="h1-userRecipes">Theses are your recipes!</p>
            <p className="h2-LearnMore">
                Click on learn more to edit, delete or see the recipes.
            </p>

            <div
                style={{
                    position: "relative",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="lock-explanation">
                    This lock symbol means that the recipe is private. Only you
                    can see it. You can change this in the Learn More page.
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="coral"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-lock"
                >
                    <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>
            <div className="userRecipes-recipes">
                {UserCreatedRecipes.map(
                    (UserCreatedRecipes: UserCreatedRecipesProps) => {
                        if (!UserCreatedRecipes) return null;
                        return (
                            <div key={UserCreatedRecipes._id}>
                                <MediaCard
                                    _id={UserCreatedRecipes._id}
                                    name={UserCreatedRecipes.name}
                                    description={UserCreatedRecipes.description}
                                    instructions={
                                        UserCreatedRecipes.instructions
                                    }
                                    imageUrl={UserCreatedRecipes.imageUrl}
                                    isPublic={!UserCreatedRecipes.isPublic}
                                />
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
};

export default UserRecipes;
