import "../styles/Home.scss";
import GlobeAnimation from "../components/GlobeAnimation";

import { ProfileButton } from "../components/Buttons";
import Header from "../components/header";
import { useSelector } from "react-redux";
import {
    selectCurrentToken,
    selectCurrentUserId,
} from "../redux/reducers/auth";
import { LogOutButton, MyRecipesButton } from "../components/Buttons";
import { useGet10RandomRecipesQuery } from "../redux/slices/recipes";
import { useEffect, useState } from "react";
import MediaCard from "../components/recipe";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
const Home = () => {
    const navigate = useNavigate();
    const currentToken =
        localStorage.getItem("token") || useSelector(selectCurrentToken);

    const currentUserId =
        localStorage.getItem("userId") || useSelector(selectCurrentUserId);

    const userId = currentUserId;
    const userLoggedIn = currentUserId && currentToken ? true : false;
    const [recipes, setRecipes] = useState<any[]>([]);
    const userName = localStorage.getItem("name");
    const { data, isSuccess, isLoading } = useGet10RandomRecipesQuery({
        skip: false,
    });

    useEffect(() => {
        if (isSuccess && data) {
            setRecipes(data);
            console.log(data);
        }
    }, [data]);

    return (
        <div className="home">
            <header className="home-header-container">
                <Header />
                {userLoggedIn ? (
                    <div className="home-logout">
                        <ProfileButton />
                        <MyRecipesButton userId={userId} />
                        <LogOutButton />
                        <Avatar
                            sx={{ ml: 2 }}
                            onClick={() => navigate(`/profile/`)}
                        >
                            {userName && userName[0]}
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
            <div className="home-page">
                <div className="home-page-hero">
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-3"></div>
                    <div className="circle circle-4"></div>
                    <h1 className="home-page-heading">
                        Share Your Culinary Creations with the{" "}
                        <GlobeAnimation />
                        <span className="world">
                            <span className="world-globe">
                                <svg viewBox="0 0 512 512">
                                    <path d="M45.1 224C29 224 16 211 16 194.9c0-1.9 .2-3.7 .6-5.6C21.9 168.3 62.8 32 240 32s218.1 136.3 223.4 157.3c.5 1.9 .6 3.7 .6 5.6c0 16.1-13 29.1-29.1 29.1H45.1zM128 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm240 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32zM256 96a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM0 304c0-26.5 21.5-48 48-48H432c26.5 0 48 21.5 48 48s-21.5 48-48 48H48c-26.5 0-48-21.5-48-48zm16 96c0-8.8 7.2-16 16-16H448c8.8 0 16 7.2 16 16v16c0 35.3-28.7 64-64 64H80c-35.3 0-64-28.7-64-64V400z" />
                                </svg>
                            </span>
                            <span className="world-globe">
                                <svg viewBox="0 0 512 512">
                                    <path d="M151.6 2.4c4.7-2.9 10.6-3.2 15.6-.7l64 32c5.4 2.7 8.8 8.3 8.8 14.3V266.4c-8.5 2.4-19 4.3-32 5.1V57.9l-32-16V271.5c-13-.9-23.5-2.7-32-5.1V16c0-5.5 2.9-10.7 7.6-13.6zM279.1 233.8c-1 4-2.9 9-7.1 14.1V208.6L299.1 84.5 272 89.9V57.3l44.9-9c5.3-1.1 10.8 .6 14.6 4.5s5.4 9.4 4.2 14.6l-28.4 130c-15.5 8-24.9 23.6-28 36.4zM362.6 192H332.5l19.8-99.1c1.7-8.7 10.2-14.3 18.8-12.6s14.3 10.2 12.6 18.8l-18.6 92.9c-.8 0-1.7-.1-2.5-.1zM21.4 192c-.9 0-1.7 0-2.5 .1L.3 99.1C-1.4 90.5 4.2 82 12.9 80.3s17.1 3.9 18.8 12.6L51.5 192H21.4zm98.8 63.6c-10.3-7.4-13.9-15.8-15.4-21.7c-3-12.1-11.4-26.5-25.2-34.9L56.2 58.6c-1.2-6.9 2.3-13.8 8.6-16.9L112 18.1V53.9L89.7 65l31.9 191.5c-.5-.3-1-.7-1.4-1zM89.2 480H294.8l54.3-224h-9.8c-5.3 16.4-16.3 35.8-38.2 51.6C276.4 325.3 241.1 336 192 336s-84.4-10.7-109.1-28.4C61 291.8 50 272.4 44.7 256H34.9L89.2 480zm-31.1 7.5L.6 250.5c-.4-1.7-.6-3.3-.6-5.1C0 233.6 9.6 224 21.4 224H54.3c9.5 0 17.2 8.3 19.5 17.5C79.6 265 102.7 304 192 304s112.4-39 118.2-62.5c2.3-9.2 10-17.5 19.5-17.5h32.9c11.8 0 21.4 9.6 21.4 21.4c0 1.7-.2 3.4-.6 5.1l-57.5 237c-3.5 14.4-16.3 24.5-31.1 24.5H89.2c-14.8 0-27.6-10.1-31.1-24.5z" />
                                </svg>
                            </span>
                            <span className="world-word">world</span>
                        </span>
                        .
                    </h1>
                    <h2 className="home-page-subheading">
                        Join a Community of Home Cooks and Food Enthusiasts and
                        Share Your Recipes Today!
                    </h2>
                </div>
                <div className="home-page-featured-recipes">
                    {isLoading ? (
                        <div className="loader">
                            <Loader />
                        </div>
                    ) : (
                        <div className="featured-recipes">
                            {recipes.map((recipe: any) => (
                                <div
                                    className="card"
                                    key={recipe._id}
                                    onClick={() => {
                                        navigate(`/recipe/${recipe._id}`);
                                    }}
                                >
                                    <MediaCard
                                        _id={recipe._id}
                                        name={recipe.name}
                                        description={recipe.description}
                                        instructions={recipe.instructions}
                                        imageUrl={recipe.imageUrl}
                                        isPublic={!recipe.isPublic}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="shadow-transition"></div>
                    <a className="home-browse-all-button" href="/recipeList">
                        Browse all the recipes!
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Home;
