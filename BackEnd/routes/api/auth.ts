import jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    interface JwtPayload {
        _id: string;
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        //TODO fix this any.
        const decodedToken = jwt.verify(token, "THISISMYRANDOMSECRETKEY");
        const { _id } = decodedToken as JwtPayload;
        const userId = { _id };
        if (req.body.userId && req.body.userId !== userId) {
            throw "Invalid user ID";
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({
            error: new Error("Invalid request!"),
        });
    }
};
