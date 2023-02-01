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

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/*" element={<ErrorPage />} />
                    {/* PUBLIC ROUTES */}
                    <Route index element={<Home />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/signup" element={<SignUp />} />
                    <Route path="/newRecipe" element={<CreateRecipe />} />
                    <Route path="/home" element={<LoggedInHome />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/recipelist" element={<RecipeList />} />
                    <Route path="/recipe/:id" element={<RecipeDetails />} />
                    <Route path="/recipe/:id/comments" element={<Comments />} />
                    <Route path="/myrecipes/:id" element={<UserRecipes />} />
                    {/* PRIVATE ROUTES */}
                    <Route element={<RequireAuth />}></Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
