//REACT

import { useNavigate } from "react-router-dom";

//MUI
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "../styles/signin.scss";
//MUI

//BREAK

//REDUX

import { useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { setCredentials } from "../redux/reducers/auth";
import { useLoginMutation } from "../redux/slices/auth";
import Loader from "../components/Loader";
import { Helmet } from "react-helmet";

//REDUX

function Copyright(props: any) {
    return (
        <Typography color={"#1976d2"} variant="body2" align="center" {...props}>
            {"Copyright © "}
            <Link href="https://kitchenkaleidoscopewebapp.onrender.com/">
                KitchenKaleidoscope
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

function SignIn() {
    const navigate = useNavigate();
    const userRef: any = useRef();
    const errRef: any = useRef();
    const [email, setUser] = useState("");
    const [password, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        setErrMsg("");
    }, [email, password]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const userData = await login({ email, password }).unwrap();

            //console.log(userData);
            dispatch(setCredentials({ ...userData, email }));
            setUser("");
            setPwd("");
            navigate("/profile");
        } catch (err: any) {
            if (!err?.status) {
                // isLoading: true until timeout occurs
                setErrMsg("No Server Response");
            } else if (err.status === 400) {
                setErrMsg("Missing Username or Password");
            } else if (err.status === 401) {
                setErrMsg("Wrong password");
            } else if (err.status === 404) {
                setErrMsg("User not found");
            } else if (err.status === 500) {
                setErrMsg("Server issue");
            } else {
                setErrMsg("Login Failed");
            }
        }
    };

    const handleUserInput = (e: any) => {
        setUser(e.target.value);
        //console.log(email);
    };

    const handlePwdInput = (e: any) => {
        setPwd(e.target.value);
        //console.log(password);
    };
    let darkMode = localStorage.getItem("darkMode");

    if (darkMode === "enabled") {
        document.body.classList.add("darkMode");
    }

    const content = isLoading ? (
        <Loader />
    ) : (
        <div className="loginContainer">
            <Helmet>
                <title>KKaleido | Login</title>
            </Helmet>
            {/* <Header /> */}
            <Container
                component="main"
                maxWidth="xs"
                className="Login-container"
            >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: "#f5f5f5",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "error.main", mt: "64px" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography
                        component="h1"
                        variant="h5"
                        className="sign-in-text"
                        sx={{}}
                    >
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1, color: "#f5f5f5" }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            ref={userRef}
                            autoFocus
                            value={email}
                            onChange={handleUserInput}
                            className="sign-in-form"
                            sx={{
                                input: {
                                    color:
                                        darkMode === "enabled"
                                            ? "#f5f5f5"
                                            : "#171717",
                                },
                            }}
                            color="primary"
                            focused
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            required
                            focused
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handlePwdInput}
                            sx={{
                                input: {
                                    color:
                                        darkMode === "enabled"
                                            ? "#f5f5f5"
                                            : "#171717",
                                },
                            }}
                            error={errMsg ? true : false}
                            helperText={errMsg}
                            variant="outlined"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="remember"
                                    color="primary"
                                    style={{
                                        color:
                                            darkMode === "enabled"
                                                ? "#f5f5f5"
                                                : "#171717",
                                    }}
                                />
                            }
                            label="Remember me"
                            className="sign-in-remember"
                            sx={
                                darkMode === "enabled"
                                    ? { color: "#f5f5f5" }
                                    : {
                                          color: "#171717",
                                      }
                            }
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/auth/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </div>
    );
    return content;
}
export default SignIn;
