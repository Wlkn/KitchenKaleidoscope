import express = require("express");
const router = express.Router();
import bcrypt = require("bcrypt");
import jwt = require("jsonwebtoken");
const User = require("../../models/User");
// /auth/signup

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
        });
        user.save()
            .then(() => {
                res.status(201).json({
                    message: "User added successfully!",
                });
            })
            .catch((error: Error) => {
                res.status(500).json({
                    error: error,
                });
            });
    });
});

// /auth/login
router.post("/login", (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    error: Error,
                    message: "User not found",
                });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: new Error("Incorrect password!"),
                            message: "Wrong password",
                        });
                    }
                    const token = jwt.sign(
                        { userId: user._id },
                        "RANDOM_TOKEN_SECRET",
                        { expiresIn: "24h" }
                    );
                    res.status(200).json({
                        userId: user._id,
                        token: token,
                        name: user.name,
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        error: error,
                        message: "Could not decrypt password",
                    });
                });
        })
        .catch((error: Error) => {
            res.status(500).json({
                error: error,
                message: "Something wrong happened.",
            });
        });
});



module.exports = router;
