import { useSelector } from "react-redux";
import {
    selectCurrentUser,
    selectCurrentToken,
    selectCurrentName,
    selectCurrentUserId,
} from "../redux/reducers/auth";
import Header from "../components/header";
import "../styles/profile.scss";
import {
    VisitRecipeListButton,
    HomeButton,
    CreateNewRecipeButton,
    MyRecipesButton,
    LogOutButton,
    FavoriteRecipesButton,
} from "../components/Buttons";
import {
    useGetUserRecipesQuery,
    useGetUserLikesQuery,
} from "../redux/slices/recipes";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
const Profile = () => {
    const navigate = useNavigate();
    const SelectedUserId =
        useSelector(selectCurrentUserId) || localStorage.getItem("userId");
    const userId = SelectedUserId;
    const email =
        useSelector(selectCurrentUser) || localStorage.getItem("email");
    const name = useSelector(selectCurrentName) || localStorage.getItem("name");
    //if you cant get token thru useSelector you can get it from local storage

    const { data: Recipes } = useGetUserRecipesQuery(userId, {
        skip: false,
    });

    const { data: Likes } = useGetUserLikesQuery(userId, {
        skip: false,
    });

    const numberOfLikes = Likes?.length ? Likes.length : 0;
    //get number of recipes but ignore if null
    const filteredRecipes = Recipes?.recipes.filter(
        (Recipe: any) => Recipe !== null
    );

    const numberOfRecipes = filteredRecipes?.length || 0;
    const numberOfPrivateRecipes =
        filteredRecipes?.filter((Recipe: any) => Recipe.isPublic === false)
            .length || 0;
    const numberOfPublicRecipes = numberOfRecipes - numberOfPrivateRecipes;

    const token: string =
        useSelector(selectCurrentToken) || localStorage.getItem("token");

    const userLoggedIn = token && userId ? true : false;
    const showUser: string = name
        ? `${name}`
        : "Could not fetch the name of the user";
    const showEmail: string = email
        ? `${email}`
        : "Could not fetch the email of the user";

    const content = (
        <div className="home">
            <header className="home-header-container">
                <Header />
                {userLoggedIn ? (
                    <div className="home-logout">
                        <MyRecipesButton userId={userId} />
                        <CreateNewRecipeButton />
                        <FavoriteRecipesButton userId={userId} />
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
            <section className="welcome">
                <h1>Welcome to your profile page!</h1>
                <h2>
                    <span>Your name: </span> {showUser}{" "}
                </h2>
                <div>Recipes posted: {numberOfRecipes}</div>
                <div>Private recipes: {numberOfPrivateRecipes}</div>
                <div>Public recipes: {numberOfPublicRecipes}</div>
                <div>Likes given: {numberOfLikes}</div>
            </section>
        </div>
    );

    return content;
};

export default Profile;
