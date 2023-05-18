import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/views/Home";
import Login from "../src/views/Login";
import SignUp from "../src/views/Signup";
import Profile from "../src/views/Profile";
import RecipeList from "../src/views/RecipeList";
import ErrorPage from "../src/views/ErrorPage";
import LoggedInHome from "../src/views/LoggedInHome";
import RequireAuth from "../src/components/requireAuth";
import Layout from "../src/components/Layout";
import CreateRecipe from "./views/CreateRecipe";
import RecipeDetails from "./components/recipeDetails";
import Comments from "./components/Comments";
import UserRecipes from "./views/UserRecipes";
import About from "./views/About";
import UserPublicRecipes from "./views/UserPublicRecipes";
import FavoritePage from "./views/FavoritePage";
function App() {
    return (
        <Router basename="/">
            <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Layout />}>
                    <Route path="/*" element={<ErrorPage />} />
                    <Route index element={<Home />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/signup" element={<SignUp />} />

                    <Route path="/newRecipe" element={<CreateRecipe />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/recipe/:id" element={<RecipeDetails />} />
                    <Route path="/recipe/:id/comments" element={<Comments />} />
                    <Route path="/myrecipes/:id" element={<UserRecipes />} />
                    <Route path="/recipelist" element={<RecipeList />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/user/:id" element={<UserPublicRecipes />} />

                    {/* PRIVATE ROUTES */}
                    <Route
                        path="/favorites/:id"
                        element={<FavoritePage />}
                    ></Route>
                    <Route element={<RequireAuth />}></Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
