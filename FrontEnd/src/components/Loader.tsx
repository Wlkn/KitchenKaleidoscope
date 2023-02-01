import "../styles/Loader.scss";
const Loader = () => {
    return (
        <div className="loader-container">
            <svg className="circle-svg" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" />
            </svg>
        </div>
    );
};
export default Loader;
