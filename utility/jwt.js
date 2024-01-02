import jwt from "jsonwebtoken"

// Create Token
export const createToken = (payload, exp = 86400000) => {
    const token =  jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn : exp
    });

    return token;
}
