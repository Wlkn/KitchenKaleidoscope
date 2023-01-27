import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container-homepage">
        <div className="home-container">
            <div className="home-text">
                <h1>Welcome to Our Recipe App</h1>
                <p>
                    Here you can find and share delicious recipes with others!
                </p>
            </div>
            <div className="home-buttons">
                <Link to="/auth/login">
                    <button>Log In</button>
                </Link>
                <Link to="/auth/signup">
                    <button>Sign Up</button>
                </Link>
            </div>
        </div>
        </div>
    );
};  

export default Home;
