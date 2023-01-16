import "../styles/recipes.css";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function MediaCard(Recipe: {
    _id: any;
    name: string;
    description: string;
    instructions: string;
    imageUrl: string;
}) {
    function handleLike() {
        console.log(Recipe._id + " " + "= Recipe name");
    }

    function handleComments() {
        console.log("Comments");
    }

    function handleLearnMore() {
        console.log("Learn More");
    }

    return (
        <Card sx={{ maxWidth: 345 }}
        className="recipe-item"
    >
            <CardMedia
                sx={{ height: 140 }}
                image={Recipe.imageUrl}
                title={Recipe.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {Recipe.name}
                </Typography>
                <Typography variant="body2" color="text.secondary"
                >
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
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );
}
