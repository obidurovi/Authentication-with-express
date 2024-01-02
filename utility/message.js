/**
 * validate message
 */

export const validate = (message, redirect, req, res) => {
    req.session.message = message;
    res.redirect(redirect);
}