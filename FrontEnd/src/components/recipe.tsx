import "../styles/_recipes.css";
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
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 140 }}
                image={Recipe.imageUrl}
                title={Recipe.name}
                className="recipe-item"
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
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}
