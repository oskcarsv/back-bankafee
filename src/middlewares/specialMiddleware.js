import { body, validationResult } from "express-validator";
import {
  existentEmail_User,
  existentUsername_User,
  existsUserDPI_Number,
  notExistentNo_Petition,
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
  console.log("hola no estamos", clientNo_Petition);

  const validations = [];

  if (clientNo_Petition == "" || clientNo_Petition == undefined) {
    await body("name", "Name is required").notEmpty().run(req);

    await body("name").custom(nameCharactersLimit).run(req);

    await body("username", "Username is required").notEmpty().run(req);

    await body("username").custom(existentUsername_User).run(req);

    await body("username").custom(usernameCharactersLimit).run(req);

    await body("DPI", "DPI is required").notEmpty().run(req);

    await body("DPI").custom(DPICharactersLimit).run(req);

    await body("DPI").custom(existsUserDPI_Number).run(req);

    await body("adress", "Adress is required").notEmpty().run(req);

    await body("email", "This is not a valid email").isEmail().run(req);

    await body("email").custom(existentEmail_User).run(req);

    await body("phoneNumber", "Phone number is required").notEmpty().run(req);

    await body("phoneNumber").custom(phoneNumberCharactersLimit).run(req);

    await body("workPlace", "Work place is required").notEmpty().run(req);

    await body("workPlace").custom(workPlaceCharactersLimit).run(req);

    await body("monthlyIncome", "Monthly income is required")
      .notEmpty()
      .run(req);

    await body("monthlyIncome").custom(miniumMonthyIncome).run(req);

    await body("type", "Type of account is required").notEmpty().run(req);

    await body("type")
      .isIn(["SAVINGS", "CURRENT", "CREDIT"])
      .withMessage("The account type must be SAVINGS, CURRENT, or CREDIT.")
      .run(req);

    await body(
      "alias",
      "Alias of the account is required and maximum 50 characters",
    )
      .isLength({ max: 50, min: 10 })
      .run(req);
  } else {
    await body("clientNo_Petition").custom(notExistentNo_Petition).run(req);
  }

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  next();
};
