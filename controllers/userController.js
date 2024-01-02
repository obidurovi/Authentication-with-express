import User from '../models/user.js';
import { makeHash } from '../utility/hash.js';
import { validate } from '../utility/message.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../utility/jwt.js';
import { accountActivationMail } from '../utility/mail.js';
import jwt from 'jsonwebtoken';

// Show Profile Page
export const profilePage = (req, res) => {
    res.render('profile');
}

// Show Profile Page
export const loginPage = (req, res) => {
    res.render('login');
}

// Show Profile Page
export const registerPage = (req, res) => {
    res.render('register');
}


// Register User
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body
    // validation
    if (!name || !email || !password) {
        validate('All fields are required', '/register', req, res);
    }else {

        const emailCheck = await User.findOne().where('email').equals(email);
        if (emailCheck) {
            validate('Email Already Exist!', '/register', req, res)
        }else {

            const user = await User.create({name, email, password : makeHash(password)});
            const token = createToken({ id : user._id}, (1000*60*60*24*3));
            const activationLink = `${process.env.APP_URL}:${process.env.PORT}/activate/${token}`;

            accountActivationMail(email, {
                name : name,
                link : activationLink
            });

            validate('User register successful', '/login', req, res);
        }

    }
    } catch (error) {
        validate(error.message, '/register', req, res)
    }
}

// login user
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
    // validation
    if (!email || !password) {
        validate('All fields are required', '/login', req, res);
    }else {

        const loginUser = await User.findOne().where('email').equals(email);
        

        if ( !loginUser ) {
            validate('Email not exist!', '/login', req, res)
        }else {
            
            if (!loginUser.isActivate) {
                validate('Please activate your account', '/login', req, res);
            } else {
                const userPass = bcrypt.compareSync(password, loginUser.password);
            if (!userPass) {
                validate('Password Incorrect', '/login', req, res);
            }else {
                
                const token = createToken({ id : loginUser._id}, (1000*60*60*24*365));
                req.session.user = loginUser;
                res.cookie('authToken', token);
                validate('Login Successfully', '/', req, res);

            }
            }
        }

    }
    } catch (error) {
        validate(error.message, '/register', req, res)
    }
}

// logout user
export const logoutUser = (req, res) => {
    delete req.session.user;
    res.clearCookie('authToken');
    validate('Logout Successful', '/login', req, res);
}

// Account Activation 
export const userAccountActivation = async(req, res) => {
    try {
        const { token } = req.params;
        const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);

        if ( !tokenVerify ) {
            validate('Invalid Activation Link', '/login', req, res);
        }else {

            const activationUser = await User.findOne({ _id : tokenVerify.id });
            if ( activationUser.isActivate ) {
                validate('Account Already Activate', '/login', req, res);
            }else {
                await User.findByIdAndUpdate(tokenVerify.id, {
                    isActivate : true
                });
                validate('Your activate successfully. Login Now', '/login', req, res);
            }

        }

    } catch (error) {
        console.log(error.message);
    }
}

// Update profile photo
export const profilePhotoPage = async(req, res) => {
    res.render('photo');
}
// Update password
export const passwordPage = async(req, res) => {
    res.render('change');
}
// Update profile
export const editPage = async(req, res) => {
    res.render('edit');
}

// upload profile photo
export const profilePhotoChange = async (req, res) => {

    try {
    
        await User.findByIdAndUpdate(req.session.user._id, {
            photo : req.file.filename
        });

        req.session.user.photo = req.file.filename;
        validate('Profile Photo Uploaded', '/photo-update', req, res);

    } catch (error) {
        validate(error.message, '/login', req, res);
    }

}

// Gallery page
export const profileGalleryPage = (req, res) => {
    res.render('gallery');
}

// GAllery update
export const profileGalleryChange = async (req, res) => {

    try {
            
        // create file name array
        let file_arr = [];
        req.files.forEach(item => {
            file_arr.push(item.filename);
            req.session.user.gallery.push(item.filename);
        });
        await User.findByIdAndUpdate(req.session.user._id, {
            $push : {
                gallery : { $each : file_arr },
            }
        });

        validate('Gallery Photo Updated Successfully', '/gallery-update', req, res)
    } catch (error) {
        validate(error.message, '/gallery-update', req, res);
    }

}

// Find friends
export const findFriendsPage = async ( req, res) => {
    try {

        const friends = await User.find().where('email').ne(req.session.user.email);

        res.render('friends', {
            friends,
        });
    } catch (error) {
        validate(error.message, '/gallery-update', req, res);
    }
}

// User Data
export const userProfileData = async (req, res) => {
    try {

        const {id} = req.params;
        const profile = await User.findById(id);

        res.render('single', {
            profile,
        });
    } catch (error) {
        validate(error.message, '/gallery-update', req, res);
    }
}

// follow user
export const followUser = async ( req, res ) => {
    try {
        
        const { id } = req.params;

        const follow = await User.findByIdAndUpdate(req.session.user._id, {
            $push : {
                following : id,
            }
        });

         await User.findByIdAndUpdate(id, {
            $push : {
                follower : req.session.user._id,
            }
        });

        req.session.user.following.push(id);
        validate('You are following', '/find-friends', req, res);

    } catch (error) {
        validate(error.message, '/find-friends', req, res);
    }
}

// unfollow user
export const unfollowUser = async ( req, res ) => {
    try {
        
        const { id } = req.params;

        const unfollow = await User.findByIdAndUpdate(req.session.user._id, {
            $pull : {
                following : id,
            }
        });


        await User.findByIdAndUpdate(req.session.user._id, {
            $pull : {
                follower : req.session.user._id,
            }
        });
        let updated_list = req.session.user.following.filter(data => data != id);
        req.session.user.following = updated_list;
        validate('You are not following', '/find-friends', req, res);

    } catch (error) {
        validate(error.message, '/find-friends', req, res);
    }
}