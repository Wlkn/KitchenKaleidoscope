import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import "../styles/signup.scss";
import { Helmet } from "react-helmet";
function Copyright(props: any) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link
                color="inherit"
                href="https://kitchenkaleidoscopewebapp.onrender.com/"
            >
                KitchenKaleidoscope
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

export default function Signup() {
    //get the data from the password and email fields

    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [PasswordNotMatch, setPasswordNotMatch] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [emailError, setEmailError] = React.useState(false);
    const navigate = useNavigate();
    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get("name") as string;
        const email = data.get("email") as string;
        const password = data.get("password") as string;
        const confirm = data.get("confirmPassword") as string;
        let myHeaders = new Headers();
        const urlencoded = new URLSearchParams();
        urlencoded.append("name", name);
        urlencoded.append("email", email);
        urlencoded.append("password", password);

        let requestOptions: object = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow",
        };

        if (password === confirm) {
            try {
                const response = await fetch(
                    "https://kitchenkaleidoscope-server.onrender.com/auth/signup",
                    requestOptions
                );
                if (response.ok) {
                    // const json = await response.json();
                    alert("Signup successful!");
                    navigate("/auth/login");
                    //console.log(json);
                } else {
                    console.error(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("Passwords do not match!");
        }
    };
    let darkMode = localStorage.getItem("darkMode");

    if (darkMode === "enabled") {
        document.body.classList.add("darkMode");
    }

    return (
        <div className="signupContainer">
            <Helmet>
                <title>KKaleidp | SignUp</title>
            </Helmet>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={
                            darkMode === "enabled"
                                ? { color: "#f5f5f5" }
                                : {
                                      color: "#171717",
                                  }
                        }
                    >
                        Sign up
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSignup}
                        noValidate
                        sx={{ mt: 1, color: "#f5f5f5" }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="Name"
                            label="Full name"
                            name="name"
                            autoComplete="name"
                            autoFocus
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
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            sx={{
                                input: {
                                    color:
                                        darkMode === "enabled"
                                            ? "#f5f5f5"
                                            : "#171717",
                                },
                            }}
                            onChange={(e) => {
                                setEmail(e.target.value);

                                if (
                                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                                        e.target.value
                                    )
                                ) {
                                    setEmailError(false);
                                } else {
                                    setEmailError(true);
                                }
                            }}
                            error={emailError}
                            helperText={
                                emailError ? "Please enter a valid email" : ""
                            }
                            focused
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
                            sx={{
                                input: {
                                    color:
                                        darkMode === "enabled"
                                            ? "#f5f5f5"
                                            : "#171717",
                                },
                            }}
                            focused
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="current-password"
                            sx={{
                                input: {
                                    color:
                                        darkMode === "enabled"
                                            ? "#f5f5f5"
                                            : "#171717",
                                },
                            }}
                            error={PasswordNotMatch}
                            helperText={
                                PasswordNotMatch ? "Passwords do not match" : ""
                            }
                            focused
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);

                                password !== e.target.value
                                    ? setPasswordNotMatch(true)
                                    : setPasswordNotMatch(false);
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/auth/login" variant="body2">
                                    {"Already have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4, color: "#1976d2" }} />
            </Container>
        </div>
    );
}
