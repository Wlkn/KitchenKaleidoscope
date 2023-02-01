import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { LogInButton, SignUpButton } from "../components/Buttons";
const Home = () => {
    return (
        <div className="Home-container">
            <div className="home-container2">
                <div className="home-text">
                    <h1>Welcome to Our Recipe App</h1>
                    <p>
                        Here you can find and share delicious recipes with
                        others!
                    </p>
                </div>
                <div className="home-buttons">
                    <LogInButton />
                    <SignUpButton />
                </div>
            </div>
        </div>
    );
};

export default Home;
