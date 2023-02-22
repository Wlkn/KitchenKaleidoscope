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
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";

import Loader from "./Loader";
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
    const [likeRecipe, { data, error, isSuccess, isLoading: recipeisLoading }] =
        useLikeRecipeMutation();

    if (data && isSuccess && data !== likeData) {
        setLikeData(data);
    } else if (error) {
        //console.log(error);
    }

    const { data: userLikedData, isLoading: userLikesIsLoading } =
        useGetUserLikesQuery(currentUserId, {
            skip: !currentUserId,
        });

    //for each recipe fetch the creator of the recipe and display it
    const { data: CreatorOfRecipe, isLoading: creatorOfRecipeIsLoading } =
        useGetCreatorOfRecipeQuery(Recipe._id, {
            skip: !Recipe._id,
        });

    // console.log(CreatorOfRecipe);

    useEffect(() => {
        if (!userLikesIsLoading && userLikedData) {
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

    function handleCreator() {
        navigate(`/user/${CreatorOfRecipe.userId}`);
    }

    //==================================================================================================
    function handleComments() {
        navigate(`/recipe/${Recipe._id}/comments`);
    }

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

    // console.log(darkModeLocal);

    let [darkMode, setDarkMode] = useState(darkModeLocal);

    useEffect(() => {
        const bodyClassList = document.body.classList;
        const isDarkMode =
            bodyClassList.contains("darkMode") ||
            localStorage.getItem("darkMode") == "enabled"
                ? true
                : false;
        // console.log(isDarkMode);
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

    if (
        userLikesIsLoading &&
        recipeisLoading &&
        creatorOfRecipeIsLoading &&
        !data &&
        !error
    ) {
        return <Loader />;
    } else {
        return (
            <StyledEngineProvider injectFirst>
                <Card
                    sx={{
                        width: 350,
                        minHeight: 380,
                        maxHeight: 380,
                        height: 380, // set a fixed height for the card
                        background:
                            darkMode == false ? "#f5f5f5" : "rgb(30, 41, 59)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow:
                            darkMode === true
                                ? "0px 1px 2.22px rgb(0 0 0 / 22%)"
                                : "0px 1px 2.22px rgba(0, 0, 0, 0.16)", // align content to bottom
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
                                color:
                                    darkMode == false ? "#171717" : "#f5f5f5",
                                textOverflow: "ellipsis", // truncate long text
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {Recipe.name}
                        </Typography>

                        <Typography
                            variant="subtitle2"
                            onClick={handleCreator}
                            sx={{
                                color:
                                    darkMode == false ? "#2746E6" : "#2B4EFF",
                                textOverflow: "ellipsis", // truncate long text
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                cursor: "pointer",

                                textDecoration: "underline",
                                textDecorationColor: "lightblue",
                            }}
                        >
                            by{" "}
                            {CreatorOfRecipe ? CreatorOfRecipe.OwnerName : " "}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    darkMode == false ? "#171717" : "#f5f5f5",
                                textOverflow: "ellipsis", // truncate long text
                                overflow: "hidden",
                                whiteSpace: "line-clamp",
                                height: "38px",
                            }}
                        >
                            {Recipe.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {userLoggedIn ? (
                            // <Button
                            //     size="small"
                            //     onClick={handleLike}
                            //     sx={{
                            //         border: "none",
                            //         "&:hover": {
                            //             backgroundColor:
                            //                 darkMode == false
                            //                     ? "#d1d1d1"
                            //                     : "#3b5073",
                            //         },
                            //     }}
                            // >
                            //     {isLiked ? "Favorited ⭐" : "⭐"}
                            // </Button>
                            <IconButton onClick={handleLike}>
                                {isLiked ? (
                                    <FavoriteIcon
                                        sx={{
                                            color: "red",
                                        }}
                                    />
                                ) : (
                                    <FavoriteBorderIcon />
                                )}
                            </IconButton>
                        ) : null}

                        <Button
                            size="small"
                            onClick={handleComments}
                            sx={{
                                border: "1px solid rgba(173, 216, 230, 0.7)",
                                "&:hover": {
                                    backgroundColor:
                                        darkMode == false
                                            ? "#d1d1d1"
                                            : "#3b5073",
                                },
                            }}
                        >
                            Comments
                        </Button>
                        <Button
                            size="small"
                            onClick={handleLearnMore}
                            sx={{
                                border: "1px solid rgba(173, 216, 230, 0.7)",
                                "&:hover": {
                                    backgroundColor:
                                        darkMode == false
                                            ? "#d1d1d1"
                                            : "#3b5073",
                                },
                            }}
                        >
                            Learn more
                        </Button>
                        {Recipe.isPublic && (
                            <div
                                style={{
                                    position: "relative",
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="17"
                                    height="24"
                                    viewBox="0 0 22 29"
                                    fill="none"
                                    stroke="coral"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-lock"
                                >
                                    <rect
                                        x="3"
                                        y="11"
                                        width="18"
                                        height="11"
                                        rx="2"
                                        ry="2"
                                    ></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                        )}
                    </CardActions>
                </Card>
            </StyledEngineProvider>
        );
    }
}
