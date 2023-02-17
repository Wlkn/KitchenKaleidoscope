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
                <div className="home-links">
                    <a className="hover-underline-animation" href="/">
                        Home
                    </a>
                    <a className="hover-underline-animation" href="#">
                        About (coming soon)
                    </a>
                    <a className="hover-underline-animation" href="#">
                        Contact (coming soon)
                    </a>
                    <a className="hover-underline-animation" href="/recipeList">
                        Recipes
                    </a>
                    <button
                        id="dark-mode-toggle"
                        className="dark-mode-toggle"
                        onClick={darkModeToggleClick}
                    >
                        <svg
                            width="10%"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 496 496"
                        >
                            <path
                                fill="currentColor"
                                d="M8,256C8,393,119,504,256,504S504,393,504,256,393,8,256,8,8,119,8,256ZM256,440V72a184,184,0,0,1,0,368Z"
                                transform="translate(-8 -8)"
                            />
                        </svg>
                    </button>
                </div>
            </nav>
        </header>
    );
}
