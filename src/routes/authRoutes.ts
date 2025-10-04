import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import AuthController from "../controllers/AuthController";

const router = Router();

router.post("/create-account",
    body('name')
        .notEmpty().withMessage('El nombre es requerido'),
    body('email')
        .isEmail().withMessage('El email no es válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body ('confirmedPassword')
        .notEmpty().withMessage('La confirmación de la contraseña es requerida')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        }),
    handleInputErrors,
    AuthController.createAccount

); 

router.post("/confirm-account",
    body('token')
        .notEmpty().withMessage('El token es requerido'),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post("/login",
    body('email')
        .isEmail().withMessage('El email no es válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida'),
    handleInputErrors,
    AuthController.login
);


export default router;