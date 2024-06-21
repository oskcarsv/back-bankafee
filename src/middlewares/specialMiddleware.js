import { check } from "express-validator";
import {
    existentEmail_User,
    existentUsername_User,
    existsUserDPI_Number,
    notExistentNo_Petition
} from "../helpers/db-validator.js";

import {
    DPICharactersLimit,
    miniumMonthyIncome,
    nameCharactersLimit,
    phoneNumberCharactersLimit,
    usernameCharactersLimit,
    workPlaceCharactersLimit,
} from "../helpers/data-validator.js";

export const specialMiddleware = async (req, res, next) => {
    const { clientNo_Petition } = req.body;
    console.log('hola no estamos',clientNo_Petition);

    if (clientNo_Petition != null || clientNo_Petition == '') {
        check("name", "Name is required").not().isEmpty(),

            check("name").custom(nameCharactersLimit),

            check("username", "Username is required").not().isEmpty(),

            check("username").custom(existentUsername_User),

            check("username").custom(usernameCharactersLimit),

            check("DPI", "DPI is required").not().isEmpty(),

            check("DPI").custom(DPICharactersLimit),

            check("DPI").custom(existsUserDPI_Number)

        check("adress", "Adress is required").not().isEmpty(),

            check("email", "This is not a valid email").isEmail()

        check("email").custom(existentEmail_User)

        check("phoneNumber", "Phone number is required").not().isEmpty()

        check("phoneNumber").custom(phoneNumberCharactersLimit)

        check("workPlace", "Work place is required").not().isEmpty()

        check("workPlace").custom(workPlaceCharactersLimit)

        check("monthlyIncome", "Monthly income is required").not().isEmpty(),

            check("monthlyIncome").custom(miniumMonthyIncome)

        check("type", "Type of account is required").not().isEmpty()

        check("type", "The account type must be SAVINGS, CURRENT, or CREDIT.").isIn(
            ["SAVINGS", "CURRENT", "CREDIT"],
        )
        check(
            "alias",
            "Alias of the account is required and maximum 50 characters"
        ).isLength({ max: 50, min: 10 });
    } else {
        
        check("clientNo_Petition").custom(notExistentNo_Petition);
    }
    next()
}