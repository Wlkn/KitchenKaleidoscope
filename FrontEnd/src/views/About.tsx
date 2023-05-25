import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect } from "react";
import "../styles/about.scss";
import Header from "../components/header";
import { LogOutButton } from "../components/Buttons";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { Helmet } from "react-helmet";
const About = () => {
    const userLoggedIn = localStorage.getItem("token") ? true : false;
    const navigate = useNavigate();
    const name = localStorage.getItem("name");
    const darkModeLocal =
        localStorage.getItem("darkMode") == "enabled" ? true : false;

    console.log(darkModeLocal);

    let [darkMode, setDarkMode] = useState(darkModeLocal);

    useEffect(() => {
        const bodyClassList = document.body.classList;
        const isDarkMode =
            bodyClassList.contains("darkMode") ||
            localStorage.getItem("darkMode") == "enabled"
                ? true
                : false;
        console.log(isDarkMode);
        setDarkMode(isDarkMode);

        const observer = new MutationObserver((mutations) => {
            const isDarkMode = bodyClassList.contains("darkmode");
            setDarkMode(isDarkMode);
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => {
            observer.disconnect();
        };
    }, []);
    return (
        <div className="about-container">
            <Helmet>
                <title>KKaleido | About</title>
            </Helmet>
            <header className="home-header-container">
                <Header />
                {userLoggedIn ? (
                    <div className="home-logout">
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
            <div className="about-text">
                <h1>About Our Recipe Sharing Website</h1>
                <p>
                    Welcome to our recipe sharing website, where you can find
                    and share delicious recipes with other food enthusiasts! Our
                    website is designed to be user-friendly and intuitive,
                    making it easy for you to find new recipes to try and share
                    your own favorite recipes with others. Whether you are a
                    professional chef or a home cook, our website is the perfect
                    platform for sharing your culinary creations with others.
                    You can easily upload your recipes, complete with
                    ingredients and step-by-step instructions, and share them
                    with our community of food lovers. We also offer a wide
                    range of features to help you discover new recipes and
                    connect with other foodies.
                </p>
                <h2>About the Developer</h2>
                <p>
                    This website was developed by Mohamed Ali Bachar, a
                    passionate Full-Stack developer. If you have any questions
                    or feedback about the website, feel free to contact me at
                    alibachar27@gmail.com. You can also connect with me on
                    LinkedIn or/and Github using the links below:
                </p>
                <div>
                    <a
                        href="https://www.linkedin.com/in/mohamedalibachar/"
                        className="linkedin-icon"
                    >
                        <FontAwesomeIcon
                            icon={faLinkedin}
                            size="2x"
                            {...(darkMode
                                ? { color: "white" }
                                : { color: "black" })}
                        />
                    </a>

                    <a href="https://github.com/Wlkn" className="github-icon">
                        <FontAwesomeIcon
                            icon={faGithub}
                            size="2x"
                            {...(darkMode
                                ? { color: "white" }
                                : { color: "black" })}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default About;
