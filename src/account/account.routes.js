import { Router } from "express";
import { check } from "express-validator";
import {
  postAccount,
  getAccount,
  getAccountById,
  putAccount,
  deleteAccount,
} from "./account.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { DPICharactersLimit } from "../helpers/data-validator.js";
import { existsUserDPI, existsAccount } from "../helpers/db-validator.js";
import { haveRol } from "../middlewares/validate-role.js";
const router = Router();

router.post(
  "/",
  [
    validateJWT,
    haveRol("ADMIN_ROLE"),
    check("type", "Type of account is required").not().isEmpty(),
    // The function isIn() is used to check if the value is in the array
    check("type", "The account type must be SAVINGS, CURRENT, or CREDIT.").isIn(
      ["SAVINGS", "CURRENT", "CREDIT"],
    ),
    check("DPI_Owner", "DPI of the owner is required").not().isEmpty(),
    check("DPI_Owner").custom(DPICharactersLimit),
    check("DPI_Owner").custom(existsUserDPI),
    check(
      "alias",
      "Alias of the account is required and maximum 50 characters",
    ).isLength({ max: 50 }),
    validateFields,
  ],
  postAccount,
);

router.get("/", [validateJWT, haveRol("ADMIN_ROLE")], getAccount);

router.get(
  "/getById",
  [
    validateJWT,
    haveRol("ADMIN_ROLE"),
    check("idAccount", "The idAccount is required").not().isEmpty(),
    check("idAccount").custom(existsAccount),
    validateFields,
  ],
  getAccountById,
);

router.put(
  "/",
  [
    validateJWT,
    haveRol("ADMIN_ROLE", "CLIENT_ROLE"),
    check(
      "alias",
      "Alias of the account is required and maximum 50 characters",
    ).isLength({ max: 50 }),
  ],
  putAccount,
);

router.delete(
  "/",
  [
    validateJWT,
    haveRol("ADMIN_ROLE"),
    check("idAccount", "The idAccount is required").not().isEmpty(),
    check("idAccount").custom(existsAccount),
  ],
  deleteAccount,
);

export default router;
