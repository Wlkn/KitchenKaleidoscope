//REACT
import * as React from "react";
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

//MUI

//BREAK

//REDUX

import { useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { setCredentials } from "../redux/reducers/auth";
import { useLoginMutation } from "../redux/slices/auth";
//REDUX

function Copyright(props: any) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="http://localhost:3000/">
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
            console.log(userData);
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
                setErrMsg("Wrong password or email");
            } else if (err.status === 404) {
                setErrMsg("User not found");
            } else if (err.status === 500) {
                setErrMsg("Server issue");
            } else {
                setErrMsg("Login Failed");
            }
            errRef.current.focus();
        }
    };

    const handleUserInput = (e: any) => {
        setUser(e.target.value);
        console.log(email);
    };

    const handlePwdInput = (e: any) => {
        setPwd(e.target.value);
        console.log(password);
    };

    const content = isLoading ? (
        <h1>Loading...</h1>
    ) : (
        <Container component="main" maxWidth="xs">
            <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
            >
                {errMsg}
            </p>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "error.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        ref={userRef}
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={handleUserInput}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handlePwdInput}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
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
    );
    return content;
}
export default SignIn;
