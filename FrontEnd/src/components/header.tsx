import "../styles/Home.scss";
export default function Header() {
    return (
        <header className="home-header-container">
            <a className="home-logo-wrapper" href="/">
                <img
                    className="logo"
                    src="/./src/assets/KKaleido.svg"
                    alt="logo"
                ></img>
            </a>
            <nav className="home-navigation">
                <div className="home-links">
                    <a className="hover-underline-animation" href="/">
                        Home
                    </a>
                    <a className="hover-underline-animation" href="#">
                        About
                    </a>
                    <a className="hover-underline-animation" href="#">
                        Contact
                    </a>
                    <a className="hover-underline-animation" href="/recipeList">
                        Recipes
                    </a>
                </div>
            </nav>
        </header>
    );
}
