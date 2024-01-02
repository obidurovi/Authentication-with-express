import { validate } from "../utility/message.js";
import  jwt  from "jsonwebtoken";
import user from "../models/user.js";

// auth redirect
export const authRedirectMiddleware = async (req, res, next) => {

    try {

        const token = req.cookies.authToken;
        

    if ( token ) {

        const tokenCheck = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenCheck) {

            const userData = await user.findById(tokenCheck.id);

            if ( userData ) {
                next();
            }else {
                delete req.session.user;
                res.clearCookie('authToken');
                validate('Token User Not Found!', '/login', req, res );
            }
        }
        
    } else {
        delete req.session.user;
        res.clearCookie('authToken');
        validate('You are not authorized!', '/login', req, res );
    }
    } catch (error) {
        delete req.session.user;
        res.clearCookie('authToken');
        validate('Invalid Token!!', '/login', req, res );
    }
}