import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/views/Home";
import Login from "../src/views/Login";
import SignUp from "./views/Signup";
import Profile from "../src/views/Profile";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;
