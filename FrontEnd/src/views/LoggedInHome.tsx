import "../styles/_base.scss";
import {
    ProfileButton,
    VisitRecipeListButton,
    CreateNewRecipeButton,
} from "../components/Buttons";
export default function LoggedInHome() {
    return (
        <div className="LoggedInHome-container">
            <h1>Home</h1>
            <ProfileButton />
            <VisitRecipeListButton />
            <CreateNewRecipeButton />
        </div>
    );
}
