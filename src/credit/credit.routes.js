import { Router } from "express";

import { check } from "express-validator";

import { validateFields } from "../middlewares/validate-fields.js";

import { validateJWT } from "../middlewares/validate-jwt.js";

import { haveRol } from "../middlewares/validate-role.js";

import {generateCreditPetition} from "./credit.controller.js";

import {validationSalary} from "../middlewares/validate-credit.js";

import {maxCredit} from "../helpers/data-validator.js";
import { existsAccounts } from "../helpers/db-validator.js";

const router = Router();

router.post(

    "/",
    [

        //Ayudame a testearlo segun yo si funciona pero igual

        validateJWT,

        haveRol("ADMIN_ROLE", "USER_ROLE"),

        check("no_Account", "The No Account is required").not().isEmpty(),

        check('no_Account').custom(existsAccounts),

        check("creditAmount", "The Amount is required").not().isEmpty(),

        check("creditAmount").custom(maxCredit),

        check("creditTime", "The Time is required").not().isEmpty(),

        check("reazon", "The Reazon is required").not().isEmpty(),

        haveRol("ADMIN_ROLE", "USER_ROLE"),

        validateFields,

        validationSalary

    ], generateCreditPetition
    
)

export default router;