import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export const VisitRecipeListButton = () => {
    
    return (
        <Button variant="contained" color="primary">
            <Link to="/recipeList">Visit Recipe List</Link>
        </Button>
    );
};

export const HomeButton = () => {
    return (
        <Button variant="contained" color="primary">
            <Link to="/home">Home</Link>
        </Button>
    );
};

export const CreateNewRecipeButton = () => {
    return (
        <Button variant="contained" color="primary">
            <Link to="/newRecipe">Create a new recipe</Link>
        </Button>
    );
};

export const LogInButton = () => {
    return (
        <Button variant="contained" color="primary">
            <Link to="/auth/login">Log In</Link>
        </Button>
    );
};

export const SignUpButton = () => {
    return (
        <Button variant="contained" color="primary">
            <Link to="/auth/signup">Sign up</Link>
        </Button>
    );
};

export const ProfileButton = () => {
    return (
        <Button variant="contained" color="primary">
            <Link to="/profile">Profile</Link>
        </Button>
    );
};

export const EditButton = () => {
    return (
        <Button variant="contained" color="primary">
            <Link to="/edit">Edit</Link>
        </Button>
    );
};

export const DeleteButton = () => {
    return (
        <Button variant="contained" color="primary">
            <Link to="/delete">Delete</Link>
        </Button>
    );
};


export const TakemeBackButton = () => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };
    return (
        <button onClick={goBack} className="take-me-back">
            Take me back!
        </button>
    );
};
