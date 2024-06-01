import { Router } from "express";
import { check } from "express-validator";

import { validateFields } from "../middlewares/validate-fields.js";
import { createService } from "./service-model.controller.js";



const router = Router();

router.post(
    '/createService',
    [
        validateFields,
    ],
    createService
);

export default router;