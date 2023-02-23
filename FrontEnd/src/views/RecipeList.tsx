import Header from "../components/header";
import { useSelector } from "react-redux";
import {
    selectCurrentToken,
    selectCurrentUserId,
} from "../redux/reducers/auth";
import { useGetRecipeByPageQuery } from "../redux/slices/recipes";
import { useEffect, useState, memo } from "react";
import Loader from "../components/Loader";
import { LogOutButton } from "../components/Buttons";
import { MyRecipesButton } from "../components/Buttons";
import MediaCard from "../components/recipe";
import InfiniteScroll from "react-infinite-scroll-component";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

export default function RecipeList() {
    const navigate = useNavigate();
    const name = localStorage.getItem("name");
    const [recipes, setRecipes] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [categoryList, setCategoryList] = useState<any[]>([]);
    const [areaList, setAreaList] = useState<any[]>([]);
    const [categoriesChosen, setCategoriesChosen] = useState<any[]>([]);
    const [areasChosen, setAreasChosen] = useState<any[]>([]);

    useEffect(() => {
        fetch(
            "https://kitchenkaleidoscope-server.onrender.com/api/recipes/category/all"
        )
            .then((res) => res.json())
            .then((data) => {
                setCategoryList(data);
            });

        fetch(
            "https://kitchenkaleidoscope-server.onrender.com/api/recipes/area/all"
        )
            .then((res) => res.json())
            .then((data) => {
                setAreaList(data);
            });
    }, []);
    //categories come from the database
    const { data, isSuccess } = useGetRecipeByPageQuery(page, {
        skip: false,
    });
    console.log(page);

    const handleChangeCategory = (
        event: SelectChangeEvent<typeof categoriesChosen>
    ) => {
        const {
            target: { value },
        } = event;
        console.log(value);
        setCategoriesChosen(
            typeof value === "string" ? value.split(",") : value
        );
    };

    const handleChangeArea = (event: SelectChangeEvent<typeof areasChosen>) => {
        const {
            target: { value },
        } = event;
        console.log(value);
        setAreasChosen(typeof value === "string" ? value.split(",") : value);
    };

    const MemoizedMediaCard = memo(MediaCard);

    useEffect(() => {
        if (isSuccess && data) {
            setRecipes((prevRecipes) => [
                ...prevRecipes,
                ...data.filter((recipe: any) => recipe.isPublic === true),
            ]);
            if (data.length < 10) {
                setHasMore(false);
            }
        }
    }, [data]);

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 3) {
            const debouncedFn = debounce(async () => {
                if (value !== "") {
                    try {
                        const response = await fetch(
                            `https://kitchenkaleidoscope-server.onrender.com/api/recipes/search/${value}`
                        );
                        if (!response.ok) {
                            throw new Error("Failed to fetch recipes");
                        }
                        const data = await response.json();
                        setRecipes(data);
                        setHasMore(false);
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    setPage(1);
                    setRecipes([]);
                    setHasMore(true);
                }
            }, 1000);

            debouncedFn();
        }
    }

    const currentToken =
        localStorage.getItem("token") || useSelector(selectCurrentToken);

    const currentUserId =
        localStorage.getItem("userId") || useSelector(selectCurrentUserId);

    const userId = currentUserId;
    const userLoggedIn = currentUserId && currentToken ? true : false;

    return (
        <div className="recipeListPage-container">
            <header className="home-header-container">
                {" "}
                <Header />
                {userLoggedIn ? (
                    <div className="home-logout">
                        <MyRecipesButton userId={userId} />
                        <LogOutButton />
                        <Avatar
                            sx={{ ml: 2 }}
                            onClick={() => navigate(`/profile/`)}
                        >
                            {name && name[0]}
                        </Avatar>
                    </div>
                ) : (
                    <div className="home-login">
                        <a
                            className="hover-underline-animation"
                            href="/auth/login"
                        >
                            Login
                        </a>
                        <span>or</span>
                        <a
                            className="hover-underline-animation"
                            href="/auth/signup"
                        >
                            Sign up
                        </a>
                    </div>
                )}
            </header>
            <div className="RecipeList-container">
                <div className="filters">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder=" "
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <div>
                            <svg>
                                <path
                                    d="M32.9418651,-20.6880772 C37.9418651,-20.6880772 40.9418651,-16.6880772 40.9418651,-12.6880772 C40.9418651,-8.68807717 37.9418651,-4.68807717 32.9418651,-4.68807717 C27.9418651,-4.68807717 24.9418651,-8.68807717 24.9418651,-12.6880772 C24.9418651,-16.6880772 27.9418651,-20.6880772 32.9418651,-20.6880772 L32.9418651,-29.870624 C32.9418651,-30.3676803 33.3448089,-30.770624 33.8418651,-30.770624 C34.08056,-30.770624 34.3094785,-30.6758029 34.4782612,-30.5070201 L141.371843,76.386562"
                                    transform="translate(83.156854, 22.171573) rotate(-225.000000) translate(-83.156854, -22.171573)"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <FormControl sx={{ m: 0, width: 300 }}>
                            <InputLabel id="demo-multiple-chip-label">
                                Category
                            </InputLabel>
                            <Select
                                inputProps={{
                                    MenuProps: { disableScrollLock: true },
                                }}
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                value={categoriesChosen}
                                onChange={handleChangeCategory}
                                input={
                                    <OutlinedInput
                                        id="select-multiple-chip"
                                        label="Category"
                                    />
                                }
                                renderValue={(selected) => (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 1,
                                        }}
                                    >
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {categoryList.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        {" "}
                        <FormControl sx={{ m: 0, width: 300 }}>
                            <InputLabel id="demo-multiple-chip-label">
                                Area
                            </InputLabel>
                            <Select
                                inputProps={{
                                    MenuProps: { disableScrollLock: true },
                                }}
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                value={areasChosen}
                                onChange={handleChangeArea}
                                input={
                                    <OutlinedInput
                                        id="select-multiple-chip"
                                        label="Area"
                                    />
                                }
                                renderValue={(selected) => (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 1,
                                        }}
                                    >
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {areaList.map((area) => (
                                    <MenuItem key={area} value={area}>
                                        {area}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <InfiniteScroll
                    dataLength={recipes.length}
                    next={() => setPage((prevPage) => prevPage + 1)}
                    hasMore={hasMore}
                    loader={<Loader />}
                    endMessage={
                        <div style={{ textAlign: "center" }}>
                            <div>Yay! You have seen it all</div>
                        </div>
                    }
                    className="RecipeList-container"
                >
                    {recipes.map((recipe: any) => (
                        <div className="favoritePage-card" key={recipe._id}>
                            <MemoizedMediaCard
                                _id={recipe._id}
                                name={recipe.name}
                                description={recipe.description}
                                instructions={recipe.instructions}
                                imageUrl={recipe.imageUrl}
                                isPublic={!recipe.isPublic}
                            />
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    );
}
