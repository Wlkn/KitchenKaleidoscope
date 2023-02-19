import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../styles/MUI.scss";
import { logOut } from "../redux/reducers/auth";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export const VisitRecipeListButton = () => {
    return (
        <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/recipeList"
        >
            Visit Recipe List
        </Button>
    );
};

export const HomeButton = () => {
    return (
        <Button variant="contained" color="primary" component={Link} to="/home">
            Home
        </Button>
    );
};

export const CreateNewRecipeButton = () => {
    return (
        <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/newRecipe"
            sx={{ ml: "1rem" }}
        >
            Create a new recipe
        </Button>
    );
};

export const LogInButton = () => {
    return (
        <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/auth/login"
        >
            Log In
        </Button>
    );
};

export const SignUpButton = () => {
    return (
        <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/auth/signup"
        >
            Sign up
        </Button>
    );
};

export const ProfileButton = () => {
    return (
        <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/profile"
        >
            Profile
        </Button>
    );
};

export const EditButton = () => {
    return (
        <Button variant="contained" color="primary" component={Link} to="/edit">
            Edit
        </Button>
    );
};

export const DeleteButton = () => {
    return (
        <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/delete"
        >
            Delete
        </Button>
    );
};

export const TakemeBackButton = () => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };
    return (
        <Button onClick={goBack} variant="contained" color="primary">
            Take me back!
        </Button>
    );
};

export const SubmitButton = () => {
    return (
        <Button variant="contained" color="primary" type="submit">
            Submit
        </Button>
    );
};

export const LogOutButton = () => {
    const dispatch = useDispatch();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("user");

        dispatch(logOut);

        MySwal.fire({
            title: <p>Logged Out!</p>,
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
        });

        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };
    return (
        <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            onClick={handleLogout}
            sx={{ ml: "1rem" }}
        >
            Log Out
        </Button>
    );
};

export const MyRecipesButton = (userId: any) => {
    return (
        <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/myrecipes/${userId.userId}`}
            sx={{ ml: "1rem" }}
        >
            Your Recipes
        </Button>
    );
};
