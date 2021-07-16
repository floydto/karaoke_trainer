import express from 'express';
import registerController from '../controllers/registerController'
import { upload } from "../main"

export function registerRoute(
    registerController: registerController,
) {
    let registerRoutes = express.Router();
    registerRoutes.get('/signup', registerController.get);
    registerRoutes.post('/signup', upload.single("icon"),registerController.post);
    return registerRoutes;
}
