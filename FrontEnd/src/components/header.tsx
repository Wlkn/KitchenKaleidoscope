import { useState, useEffect } from "react";
import "../styles/Home.scss";

export default function Header() {
    let darkMode = localStorage.getItem("darkMode");
    const [logo, setLogo] = useState(
        darkMode === "enabled" ? "/KKaleido.svg" : "/KKaleido-light.svg"
    );

    const enableDarkMode = () => {
        document.body.classList.add("darkmode");
        localStorage.setItem("darkMode", "enabled");
    };

    const disableDarkMode = () => {
        document.body.classList.remove("darkmode");
        localStorage.setItem("darkMode", "disabled");
    };

    if (darkMode === "enabled") {
        enableDarkMode();
    }

    const darkModeToggleClick = () => {
        darkMode = localStorage.getItem("darkMode");
        if (darkMode !== "enabled") {
            setLogo("/KKaleido.svg");
            enableDarkMode();
        } else {
            setLogo("/KKaleido-light.svg");
            disableDarkMode();
        }
    };

    return (
        <header className="home-header-container">
            <a className="home-logo-wrapper" href="/">
                <img
                    className="logo"
                    src={logo}
                    alt="Kitchen Kaleidoscope Logo"
                />
            </a>

            <nav className="home-navigation">
                <button
                    className="dark-mode-toggle"
                    onClick={darkModeToggleClick}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                        aria-labelledby="title"
                        aria-describedby="desc"
                        role="img"
                    >
                        <path
                            data-name="layer2"
                            d="M36.4 20.4a16 16 0 1 0 16 16 16 16 0 0 0-16-16zm0 28a12 12 0 0 1-10.3-5.8l2.5.3A13.7 13.7 0 0 0 42 25.8a12 12 0 0 1-5.6 22.6z"
                            fill="#202020"
                        ></path>
                        <path
                            data-name="layer1"
                            d="M36.4 16.4a2 2 0 0 0 2-2v-8a2 2 0 1 0-4 0v8a2 2 0 0 0 2 2zm-20 20a2 2 0 0 0-2-2h-8a2 2 0 0 0 0 4h8a2 2 0 0 0 2-2zm3-14.1a2 2 0 0 0 2.8-2.8l-5.7-5.7a2 2 0 0 0-2.8 2.8zM59 13.8a2 2 0 0 0-2.8 0l-5.7 5.7a2 2 0 1 0 2.8 2.8l5.7-5.7a2 2 0 0 0 0-2.8zM19.4 50.5l-5.7 5.7a2 2 0 1 0 2.9 2.8l5.7-5.7a2 2 0 1 0-2.8-2.8z"
                            fill="#202020"
                        ></path>
                    </svg>
                </button>
                <div className="home-links">
                    <a className="hover-underline-animation" href="/">
                        Home
                    </a>
                    <a className="hover-underline-animation" href="#">
                        About (coming soon)
                    </a>
                    <a className="hover-underline-animation" href="/recipeList">
                        Recipes
                    </a>
                </div>
            </nav>
            <button className="burger-button">
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" stroke="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M4 7C4 6.44771 4.44772 6 5 6H24C24.5523 6 25 6.44771 25 7C25 7.55229 24.5523 8 24 8H5C4.44772 8 4 7.55229 4 7Z"></path>
                        <path d="M4 13.9998C4 13.4475 4.44772 12.9997 5 12.9997L16 13C16.5523 13 17 13.4477 17 14C17 14.5523 16.5523 15 16 15L5 14.9998C4.44772 14.9998 4 14.552 4 13.9998Z"></path>
                        <path d="M5 19.9998C4.44772 19.9998 4 20.4475 4 20.9998C4 21.552 4.44772 21.9997 5 21.9997H22C22.5523 21.9997 23 21.552 23 20.9998C23 20.4475 22.5523 19.9998 22 19.9998H5Z"></path>
                    </g>
                </svg>
            </button>
        </header>
    );
}
