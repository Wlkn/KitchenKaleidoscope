import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../redux/reducers/auth";
import { Link } from "react-router-dom";

const Profile = () => {
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);

    const welcome = user ? `Welcome ${user}!` : "Welcome!";
    const tokenAbbr = `${token.slice(0, 9)}...`;

    const content = (
        <section className="welcome">
            <h1>{welcome}</h1>
            <p>Token: {token}</p>
            <p>
                <Link to="/recipelist">Go to the Users List</Link>
                <Link to="/home">Go to the Home Page</Link>
            </p>
        </section>
    );

    return content;
};
export default Profile;
