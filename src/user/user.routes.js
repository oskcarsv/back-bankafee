import { Router } from "express";

import { check } from "express-validator";

import { validateFields } from "../middlewares/validate-fields.js";

import { existentUsername_User, existentUsername_ClientPetition, existentEmail_User, existentEmail_ClientPetition } from "../helpers/db-validator.js";

import { nameCharactersLimit ,usernameCharactersLimit, DPICharactersLimit, phoneNumberCharactersLimit, workPlaceCharactersLimit, miniumMonthyIncome} from "../helpers/data-validator.js";

import {addUser} from "./user.controller.js";

import { validateJWT } from "../middlewares/validate-jwt.js";

import { haveRol } from "../middlewares/validate-role.js";

const router = Router();

router.post(

    "/",

    [

        validateJWT,

        haveRol('ADMIN_ROLE'),

        check("name", "Name is required").not().isEmpty(),

        check("name").custom(nameCharactersLimit),

        check("username", "Username is required").not().isEmpty(),

        check("username").custom(existentUsername_User),

        check("username").custom(usernameCharactersLimit),

        check("DPI", "DPI is required").not().isEmpty(),

        check("DPI").custom(DPICharactersLimit),

        check("adress", "Adress is required").not().isEmpty(),

        check("email", "This is not a valid email").isEmail(),

        check("email").custom(existentEmail_User),

        check("phoneNumber", "Phone number is required").not().isEmpty(),

        check("phoneNumber").custom(phoneNumberCharactersLimit),

        check("workPlace", "Work place is required").not().isEmpty(),

        check("workPlace").custom(workPlaceCharactersLimit),

        check("monthlyIncome", "Monthly income is required").not().isEmpty(),

        check("monthlyIncome").custom(miniumMonthyIncome),

        validateFields

    ], addUser

);

export default router;