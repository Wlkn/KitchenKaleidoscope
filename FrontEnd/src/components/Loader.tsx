import "../styles/Loader.scss";

const Loader = () => {
    const darkMode = localStorage.getItem("darkMode");
    return (
        <div
            className="loader-container"
            style={{
                backgroundColor: darkMode === "enabled" ? "#171717" : "#f5f5f5",
            }}
        >
            <svg className="circle-svg" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" />
            </svg>
        </div>
    );
};

export default Loader;
