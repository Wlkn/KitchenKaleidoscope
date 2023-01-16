import jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    interface JwtPayload {
        userId: string;
    }
    try {
        const token = req.headers.authorization.split("Bearer ")[1];
        //TODO fix this any.
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken as JwtPayload;
        req.auth = { userId };

        const user_id = userId.userId;

        if (req.body.user_id && req.body.user_id !== user_id) {
            throw "Invalid user ID";
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({
            error: "Invalid request, from auth.ts.",
        });
        console.log(error);
    }
};
