"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split("Bearer ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken;
        req.auth = { userId };
        const user_id = userId.userId;
        if (req.body.user_id && req.body.user_id !== user_id) {
            throw "Invalid user ID";
        }
        else {
            next();
        }
    }
    catch (error) {
        res.status(401).json({
            error: "Invalid request, from auth.ts.",
        });
        // console.log(error);
    }
};
