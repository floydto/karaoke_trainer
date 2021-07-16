import express from 'express';
import loginController  from '../controllers/loginController'

export function loginRoute(
    loginController: loginController,
) {
    let loginRoutes = express.Router();
    loginRoutes.get('/login', loginController.get);
    loginRoutes.post('/login', loginController.post);
    loginRoutes.get('/login/google', loginController.loginGoogle);
    loginRoutes.get('/logout', loginController.getLogout);
    loginRoutes.get('/fetch-user', loginController.fetchUserData);
    return loginRoutes;
}
