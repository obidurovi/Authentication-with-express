import { validate } from "../utility/message.js";

// auth redirect
export const authMiddleware = (req, res, next) => {

    const token = req.cookies.authToken;

    if ( token ) {
        validate('You already logggedin', '/', req, res );
    } else {
        next();
    }
}