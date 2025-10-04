import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { DeployController } from "../controllers/deployController";

const router = Router();

router.post("/",
  body("name").optional().isString(),
  body("repoUrl").optional().isString(),
  body("language")
    .notEmpty().withMessage("El lenguaje es requerido")
    .isIn(["python", "node"]).withMessage("Lenguaje no soportado"),
  body("framework")
    .optional()
    .isIn(["fastapi", "django", "express", "flask"])
    .withMessage("Framework no soportado"),
  handleInputErrors,
  DeployController.deployProject
);

export default router;
