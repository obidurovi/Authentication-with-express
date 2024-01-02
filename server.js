import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import session from 'express-session';
import ejslaouts from 'express-ejs-layouts';
import { mongoDBConnection } from './config/db.js';
import { localsMiddleware } from './middlewares/localsMiddleware.js';
import userRoute from './routes/user.js';
import cookieParser from 'cookie-parser';

// environment variable
dotenv.config();
const PORT = process.env.PORT || 9000 


// express init 
const app = express();

// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(cookieParser());

// setup session
app.use(session({
    secret : "I love mern",
    saveUninitialized: true,
    resave : false
}));

// local middlewares
app.use(localsMiddleware);


// static folder
app.use(express.static('public'));

// ejs template
app.set('view engine', 'ejs');
app.set('layout', 'layouts/app');
app.use(ejslaouts);

// route
app.use('/', userRoute)

// server engine
app.listen(PORT, () => {
    mongoDBConnection();
    console.log(`Server in running on post ${ PORT }`.green);
});