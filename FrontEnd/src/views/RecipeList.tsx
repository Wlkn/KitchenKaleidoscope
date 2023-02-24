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
import "../styles/recipes.scss";
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

    //
    //
    //
    //
    //
    const darkModeLocal =
        localStorage.getItem("darkMode") == "enabled" ? true : false;
    let [darkMode, setDarkMode] = useState(darkModeLocal);
    useEffect(() => {
        const bodyClassList = document.body.classList;
        const isDarkMode =
            bodyClassList.contains("darkMode") ||
            localStorage.getItem("darkMode") == "enabled"
                ? true
                : false;
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
    //
    //
    //
    //
    //
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

    const filterRecipes = async (
        categoriesChosen: any,
        areasChosen: any,
        searchTerm: any
    ) => {
        const query = new URLSearchParams({
            categories: categoriesChosen,
            areas: areasChosen,
            search: searchTerm,
        }).toString();

        const response = await fetch(
            `https://kitchenkaleidoscope-server.onrender.com/api/recipes/filter?${query}`
        );
        const data = await response.json();
        console.log(data);

        setRecipes(data);
    };

    useEffect(() => {
        if (isSuccess && data) {
            if (
                categoriesChosen.length > 0 ||
                areasChosen.length > 0 ||
                searchTerm
            ) {
                filterRecipes(categoriesChosen, areasChosen, searchTerm);
                setRecipes([]);
                // setHasMore(false);
            } else {
                setRecipes([]);
                setPage(1);

                const filteredData = data.filter(
                    (recipe: any) => recipe.isPublic === true
                );
                setRecipes((prevRecipes) => [...prevRecipes, ...filteredData]);

                // setHasMore(true);
                if (filteredData.length < 3) {
                    setHasMore(false);
                }
            }
        }
    }, [categoriesChosen, areasChosen, searchTerm, data]);

    const MemoizedMediaCard = memo(MediaCard);

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setSearchTerm(value);
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
            <div className="filters">
                <div className="RecipeList-container">
                    <div>
                        <FormControl
                            sx={{
                                m: 0,
                                width: 300,
                            }}
                            color="primary"
                            focused
                            variant="outlined"
                        >
                            <InputLabel
                                id="demo-multiple-chip-label"
                                className="label-text"
                            >
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
                                            <Chip
                                                key={value}
                                                label={value}
                                                sx={{
                                                    backgroundColor: "#F2F2F2",
                                                    color: "#657789",
                                                    border: "1px solid #657789",
                                                    borderRadius: "5px",
                                                    padding: "5px",
                                                }}
                                            />
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
                    <div className="Card-search">
                        <div className="CardInner-search">
                            <label>Search for your favourite food</label>
                            <div className="container-search">
                                <div className="Icon-search">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#657789"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-search"
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <line
                                            x1="21"
                                            y1="21"
                                            x2="16.65"
                                            y2="16.65"
                                        />
                                    </svg>
                                </div>
                                <div className="InputContainer-search">
                                    <input
                                        placeholder="The limit is the sky..."
                                        type="text"
                                        className="search-input"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        {" "}
                        <FormControl
                            sx={{ ml: 10, width: 300 }}
                            color="primary"
                            focused
                            variant="outlined"
                        >
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
