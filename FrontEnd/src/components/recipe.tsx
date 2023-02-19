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

export default function MediaCard(Recipe: {
    _id: any;
    name: string;
    description: string;
    instructions: string;
    imageUrl: string;
}) {
    //==================================================================================================
    //==================================================================================================
    //========================================HANDLE LIKES=============================================
    //==================================================================================================
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
    //==================================================================================================
    //==================================================================================================
    //========================================HANDLE LIKES==============================================
    //==================================================================================================
    //==================================================================================================
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //==================================================================================================
    //==================================================================================================
    //=======================================HANDLE COMMENTS============================================
    //==================================================================================================
    //==================================================================================================
    function handleComments() {
        navigate(`/recipe/${Recipe._id}/comments`);
    }
    //==================================================================================================
    //==================================================================================================
    //=======================================HANDLE COMMENTS============================================
    //==================================================================================================
    //==================================================================================================
    function handleLearnMore() {
        navigate(`/recipe/${Recipe._id}`);
    }
    //==================================================================================================
    //==================================================================================================
    //==========================================JSX=====================================================
    //==================================================================================================
    const userLoggedIn = localStorage.getItem("userId") ? true : false;

    //==================================================================================================
    const [darkMode, setDarkMode] = useState(true);
    console.log(darkMode);
    useEffect(() => {
        const bodyClassList = document.body.classList;
        const isDarkMode = bodyClassList.contains("darkMode");
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
                // sx={{ width: 350, background: "#a4a4a4" }}
                sx={{
                    width: 350,
                    background: darkMode == false ? "#f5f5f5" : "#171717",
                }}
                className="recipe-item"
            >
                <CardMedia
                    sx={{ height: 140 }}
                    image={Recipe.imageUrl}
                    title={Recipe.name}
                    component="img"
                    className="MuiCardMediaCustom"
                />
                <CardContent className="MuiCardContentCustom">
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={
                            darkMode == false
                                ? { color: "#171717" }
                                : { color: "#f5f5f5" }
                        }
                    >
                        {Recipe.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={
                            darkMode == false
                                ? { color: "#171717" }
                                : { color: "#f5f5f5" }
                        }
                    >
                        {Recipe.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    {userLoggedIn ? (
                        <Button size="small" onClick={handleLike}>
                            {isLoading ? "----" : isLiked ? "Unlike" : "Like"}
                        </Button>
                    ) : null}

                    <Button size="small" onClick={handleComments}>
                        Comments
                    </Button>
                    <Button size="small" onClick={handleLearnMore}>
                        Learn more
                    </Button>
                </CardActions>
            </Card>
        </StyledEngineProvider>
    );
}
