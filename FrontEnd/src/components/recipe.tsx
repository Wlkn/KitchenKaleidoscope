import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUserId } from "../redux/reducers/auth";
import { useLikeRecipeMutation } from "../redux/slices/recipes";
import { changeLike } from "../redux/reducers/recipes";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useGetUserLikesQuery } from "../redux/slices/recipes";
import { StyledEngineProvider } from "@mui/styled-engine-sc";
import { useGetCreatorOfRecipeQuery } from "../redux/slices/recipes";
export default function MediaCard(Recipe: {
    _id: any;
    name: string;
    description: string;
    instructions: string;
    imageUrl: string;
    isPublic: boolean;
}) {
    //==================================================================================================

    const [isLiked, setIsLiked] = useState(false);
    const [likeData, setLikeData] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUserId =
        useSelector(selectCurrentUserId) || localStorage.getItem("userId");
    const [likeRecipe, { data, error, isSuccess }] = useLikeRecipeMutation();

    if (data && isSuccess && data !== likeData) {
        setLikeData(data);
    } else if (error) {
        //console.log(error);
    }

    const { data: userLikedData, isLoading } = useGetUserLikesQuery(
        currentUserId,
        {
            skip: !currentUserId,
        }
    );

    //for each recipe fetch the creator of the recipe and display it
    const { data: CreatorOfRecipe } = useGetCreatorOfRecipeQuery(Recipe._id, {
        skip: !Recipe._id,
    });

    console.log(CreatorOfRecipe);

    useEffect(() => {
        if (!isLoading && userLikedData) {
            const likedRecipes =
                userLikedData.length > 0
                    ? userLikedData.map((like: any) => like.recipe_id)
                    : [];
            if (likedRecipes.includes(Recipe._id)) {
                setIsLiked(true);
            }
        }
    }, [userLikedData]);

    const handleLike = async (e: any) => {
        e.preventDefault();

        if (isLiked) {
            try {
                const unlikedData = await likeRecipe({
                    recipe_id: Recipe._id,
                    user_id: currentUserId,
                    liked: false,
                }).unwrap();
                dispatch(changeLike({ ...unlikedData, recipe_id: Recipe._id }));
                setIsLiked(false);

                //console.log(unlikedData);
            } catch (error) {
                //console.log(error);
            }
        }
        if (!isLiked) {
            try {
                const likedData = await likeRecipe({
                    recipe_id: Recipe._id,
                    user_id: currentUserId,
                    liked: true,
                }).unwrap();
                dispatch(changeLike({ ...likedData, recipe_id: Recipe._id }));
                setIsLiked(true);

                //console.log(likedData);
            } catch (error) {
                console.log(error);
            }
        }
    };

    function handleComments() {
        navigate(`/recipe/${Recipe._id}/comments`);
    }
    //==================================================================================================

    //=======================================HANDLE COMMENTS============================================
    //==================================================================================================
    function handleLearnMore() {
        navigate(`/recipe/${Recipe._id}`);
    }

    //==================================================================================================
    const userLoggedIn = localStorage.getItem("userId") ? true : false;

    //==================================================================================================
    const darkModeLocal =
        localStorage.getItem("darkMode") == "enabled" ? true : false;

    console.log(darkModeLocal);

    let [darkMode, setDarkMode] = useState(darkModeLocal);

    useEffect(() => {
        const bodyClassList = document.body.classList;
        const isDarkMode =
            bodyClassList.contains("darkMode") ||
            localStorage.getItem("darkMode") == "enabled"
                ? true
                : false;
        console.log(isDarkMode);
        setDarkMode(isDarkMode);

        const observer = new MutationObserver((mutations) => {
            const isDarkMode = bodyClassList.contains("darkmode");
            setDarkMode(isDarkMode);
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    //make the darkmode change if the user changes the darkmode in the settings

    return (
        <StyledEngineProvider injectFirst>
            <Card
                sx={{
                    width: 350,
                    height: 380, // set a fixed height for the card
                    background:
                        darkMode == false ? "#f5f5f5" : "rgb(30, 41, 59)",
                    border: Recipe.isPublic ? "4px solid lightblue  " : "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between", // align content to bottom
                }}
                className="recipe-item"
            >
                <CardMedia
                    sx={{
                        height: 200,
                        // set a fixed aspect ratio for the image
                    }}
                    image={Recipe.imageUrl}
                    title={Recipe.name}
                    component="img"
                    className="MuiCardMediaCustom"
                />
                <CardContent
                    className="MuiCardContentCustom"
                    sx={{ flexGrow: 1 }}
                >
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{
                            color: darkMode == false ? "#171717" : "#f5f5f5",
                            textOverflow: "ellipsis", // truncate long text
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {Recipe.name}
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: darkMode == false ? "#171717" : "#f5f5f5",
                            textOverflow: "ellipsis", // truncate long text
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                        }}
                    >
                        by {CreatorOfRecipe ? CreatorOfRecipe.OwnerName : " "}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: darkMode == false ? "#171717" : "#f5f5f5",
                            textOverflow: "ellipsis", // truncate long text
                            overflow: "hidden",
                            whiteSpace: "wrap",
                        }}
                    >
                        {Recipe.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    {userLoggedIn ? (
                        <Button
                            size="small"
                            onClick={handleLike}
                            style={{
                                border: "2px dashed rgba(173, 216, 230, 0.7)",
                            }}
                        >
                            {isLoading ? "  " : isLiked ? "Unlike" : "Like"}
                        </Button>
                    ) : null}

                    <Button
                        size="small"
                        onClick={handleComments}
                        style={{
                            border: "2px dashed rgba(173, 216, 230, 0.7)",
                        }}
                    >
                        Comments
                    </Button>
                    <Button
                        size="small"
                        onClick={handleLearnMore}
                        style={{
                            border: "2px dashed rgba(173, 216, 230, 0.7)",
                        }}
                    >
                        Learn more
                    </Button>
                </CardActions>
            </Card>
        </StyledEngineProvider>
    );
}
