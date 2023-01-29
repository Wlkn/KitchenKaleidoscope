import "../styles/recipes.css";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../redux/reducers/auth";
import { useLikeRecipeMutation } from "../redux/slices/recipes";
export default function MediaCard(Recipe: {
    _id: any;
    name: string;
    description: string;
    instructions: string;
    imageURL: string;
}) {
    const navigate = useNavigate();
    const currentUserId = useSelector(selectCurrentUserId) || localStorage.getItem("userId");
    const [likeRecipe] = useLikeRecipeMutation();
    async function handleLike() {
        //for the post request of the like you need: recipe_id, user_id and the liked which is a boolean True or false.
        try {
           await likeRecipe({
                recipe_id: Recipe._id,
                user_id: currentUserId,
                liked: true,
            });

            console.log("Liked");
        }
        catch (error) {
            console.log(error);
        }

    }

    function handleComments() {
        console.log("Comments");
    }

    function handleLearnMore() {
        navigate(`/recipe/${Recipe._id}`);
    }

    return (
        <Card sx={{ maxWidth: 345 }} className="recipe-item">
            <CardMedia
                sx={{ height: 140 }}
                image={Recipe.imageURL}
                title={Recipe.name}
                component="img"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {Recipe.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {Recipe.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleLike}>
                    LIKE
                </Button>
                <Button size="small" onClick={handleComments}>
                    Comments
                </Button>
                <Button size="small" onClick={handleLearnMore}>
                    Learn more
                </Button>
            </CardActions>
        </Card>
    );
}
