import { Router } from "express";

import { check } from "express-validator";

import { login, clientPetition } from "./auth.controller.js";

import { validateFields } from "../middlewares/validate-fields.js";

import { existentUsername_User, existentUsername_ClientPetition, existentEmail_User, existentEmail_ClientPetition } from "../helpers/db-validator.js";

import { nameCharactersLimit ,usernameCharactersLimit, DPICharactersLimit, phoneNumberCharactersLimit, workPlaceCharactersLimit, miniumMonthyIncome} from "../helpers/data-validator.js";

const router = Router();

router.post(

    "/login",

    [

        check("username", "Username is required").not().isEmpty(),

        check("password", "Password is required").not().isEmpty(),

        validateFields

    ], login

);

router.post(

    "/clientPetition",

    [

        check("name", "Name is required").not().isEmpty(),

        check("name").custom(nameCharactersLimit),

        check("username", "Username is required").not().isEmpty(),

        check("username").custom(existentUsername_ClientPetition),

        check("username").custom(existentUsername_User),

        check("username").custom(usernameCharactersLimit),

        check("DPI", "DPI is required").not().isEmpty(),

        check("DPI").custom(DPICharactersLimit),

        check("email", "This is not a valid email").isEmail(),

        check("email").custom(existentEmail_ClientPetition),

        check("email").custom(existentEmail_User),

        check("phoneNumber", "Phone number is required").not().isEmpty(),

        check("phoneNumber").custom(phoneNumberCharactersLimit),

        check("workPlace", "Work place is required").not().isEmpty(),

        check("workPlace").custom(workPlaceCharactersLimit),

        check("monthlyIncome", "Monthly income is required").not().isEmpty(),

        check("monthlyIncome").custom(miniumMonthyIncome),

        validateFields

    ], clientPetition

);

export default router;