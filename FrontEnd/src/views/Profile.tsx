import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken, selectCurrentName } from "../redux/reducers/auth";
import { Link } from "react-router-dom";
import { VisitRecipeListButton, HomeButton, CreateNewRecipeButton } from "../components/Buttons";
const Profile = () => {
    const email = useSelector(selectCurrentUser) || localStorage.getItem("email");
    const name = useSelector(selectCurrentName) || localStorage.getItem("name");
    //if you cant get token thru useSelector you can get it from local storage
    const token: string =
        useSelector(selectCurrentToken) || localStorage.getItem("token");

    const showUser: string = name ? `${name}` : "Could not fetch the name of the user";
    const showEmail: string = email ? `${email}` : "Could not fetch the email of the user";
    // const tokenAbbr: string = `${token.slice(0, 9)}...`;

    const content = (
        <section className="welcome">
            <h1>Welcome to your profile page!</h1>
            <h3>Here you can see your profile information and manage your recipes.</h3>
            <h2><span>Your name: </span> {showUser} </h2>
            <h2><span>Your email: </span>{showEmail}</h2>
            <p>Token: {token}</p>
            <p>
                <VisitRecipeListButton/>
                <HomeButton/>
                <CreateNewRecipeButton/>
            </p>
        </section>
    );

    return content;
};
export default Profile;
