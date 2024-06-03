import { Router } from "express";
import { postDeposit } from "./deposit.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { haveRol } from "../middlewares/validate-role.js";
import { existsAccounts } from "../helpers/db-validator.js";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
const router= Router();

router.post('/',[validateJWT,
    haveRol('ADMIN_ROLE','USER_ROLE'),
    check('noDestinationAccount','The destination account is required').isNumeric(),
    check(['noDestinationAccount']).custom(existsAccounts),
    check('amount','The amount is required').isNumeric(),
    validateFields
],postDeposit);

export default router;