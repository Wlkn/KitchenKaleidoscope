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
                    {/* PRIVATE ROUTES */}
                    <Route element={<RequireAuth />}>
                        <Route path="/home" element={<LoggedInHome />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/recipelist" element={<RecipeList />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
