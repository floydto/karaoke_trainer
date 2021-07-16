import express from 'express';
import expressSession from 'express-session';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import Knex from 'knex';
import { tornadoPort } from './config'
import { tornadoPath } from './config'
import grant from 'grant';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080 //port config

export const pythonPort = tornadoPort
export const pythonPath = tornadoPath

//  Configuring multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads", file.fieldname));
    },
    filename: (req, file, cb) => {
        let filename = `${Date.now()}.${file.mimetype.split('/')[1]}`;
        req.body[file.fieldname] = filename
        cb(null, filename);
    }
})
export const upload = multer({ storage });

const knexConfig = require('./knexfile');
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development'])

//  Initialise service and controller instances
import AudioController from './controllers/audioControllers'
import AudioService from './services/audioServices'
const audioService = new AudioService(knex);
export const audioController = new AudioController(audioService);

// Login Route
import { loginRoute } from './routes/loginRoutes';
import LoginService from './services/loginServices';
import LoginController from './controllers/loginController';

let loginService = new LoginService(knex);
let loginController = new LoginController(loginService)
let loginRoutes = loginRoute(loginController);


// Register Route
import { registerRoute } from './routes/registerRoutes';
import RegisterService from './services/registerService';
import RegisterController from './controllers/registerController';

let registerService = new RegisterService(knex);
let registerController = new RegisterController(registerService)
let registerRoutes = registerRoute(registerController);


// UploadPicture Routes
// import { uploadPictureRouter } from './routes/;
// import UploadPictureController from './uploadPicture.controller';
// import UploadPictureService from './service/uploadPicture.service';

// let uploadPictureService = new UploadPictureService(knex);
// let uploadPictureController = new UploadPictureController(uploadPictureService);
// let uploadPictureRoutes = uploadPictureRouter(uploadPictureController, upload);
// app.use("/", uploadPictureRoutes)



//  Importing routers
import { audioRoutes } from './routes/audioRoutes';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//  Session middleware
const sessionMiddleware = expressSession({
    secret: 'thANks tO tEnsORf1ow HuB fOr thE piTcH anAlysIs m0deL uSEd in thE aI KAraokE trAinEr',
    resave: true,
    saveUninitialized: true
});
app.use(sessionMiddleware)

//Google Oauth
const grantExpress = grant.express({
    "defaults":{
        "origin": "http://localhost:8080",
        "transport": "session",
        "state": true,
    }, 
    "google":{
        "key": process.env.GOOGLE_CLIENT_ID || "",
        "secret": process.env.GOOGLE_CLIENT_SECRET || "",
        "scope": ["profile","email"],
        "callback": "/login/google"
    },
});
app.use(grantExpress as express.RequestHandler)



//  Serving static files
app.use(express.static('./public'));

//  Routers
app.use('/', audioRoutes);

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})

