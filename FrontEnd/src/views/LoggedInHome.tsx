import Navbar from "../components/navbar";
import "../styles/_base.scss"
import { ProfileButton, VisitRecipeListButton, CreateNewRecipeButton } from "../components/Buttons";
export default function LoggedInHome() {
    return (
        <div className="LoggedInHome-container">
            <Navbar />
            <h1>Home</h1>
            <ProfileButton/>
            <VisitRecipeListButton/>
            <CreateNewRecipeButton/>
        </div>
    );
}
