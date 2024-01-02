import express from 'express';
import multer from 'multer';
import path from 'path';
import { editPage, findFriendsPage, followUser, loginPage, loginUser, logoutUser, passwordPage, profileGalleryChange, profileGalleryPage, profilePage, profilePhotoChange, profilePhotoPage, registerPage, registerUser, unfollowUser, userAccountActivation, userProfileData } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authRedirectMiddleware } from '../middlewares/authRedirectMiddlewares.js';


// router
const router = express.Router();
const __dirname = path.resolve();

// multer config
const storage = multer.diskStorage({
    destination : (req, file, cb) => {

        if (file.fieldname == 'gallery') {
            cb(null, path.join(__dirname, '/public/media/gallery'));
        }

        if (file.fieldname == 'profile') {
            cb(null, path.join(__dirname, '/public/media/users'));
        }

    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname)
    }
});

// Create multer middleware
const profilePhotoUpdate = multer({
    storage
}).single('profile');

const galleryPhotoUpdate = multer({
    storage
}).array('gallery', 5);

// routing 
router.get('/', authRedirectMiddleware, profilePage);

// Photo update
router.get('/photo-update', authRedirectMiddleware, profilePhotoPage);
router.post('/photo-update', profilePhotoUpdate, profilePhotoChange);

// Gallery update
router.get('/gallery-update', authRedirectMiddleware, profileGalleryPage);
router.post('/gallery-update', galleryPhotoUpdate, profileGalleryChange);

router.get('/password-change', authRedirectMiddleware, passwordPage);
router.get('/profile-change', authRedirectMiddleware, editPage);

// follow unfollow
router.get('/follow/:id', authRedirectMiddleware, followUser);
router.get('/unfollow/:id', authRedirectMiddleware, unfollowUser);


router.get('/login', authMiddleware, loginPage);
router.get('/register', authMiddleware, registerPage);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/activate/:token', userAccountActivation);

// find friend
router.get('/find-friends', authRedirectMiddleware, findFriendsPage);
router.get('/:id', authRedirectMiddleware, userProfileData);

// export default
export default router;