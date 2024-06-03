import { Router } from "express";
import {
    getDeposits,
    getMyDeposits,
    postDeposit,
    reverseDeposit,
} from "./deposit.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { haveRol } from "../middlewares/validate-role.js";
import { existsAccounts, existsMyAccount } from "../helpers/db-validator.js";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
const router = Router();

router.post(
    "/",
    [
        validateJWT,
        haveRol("ADMIN_ROLE", "USER_ROLE"),
        check(
            "noDestinationAccount",
            "The destination account is required",
        ).isNumeric(),
        check(["noDestinationAccount"]).custom(existsAccounts),
        check("amount", "The amount is required").isNumeric(),
        validateFields,
    ],
    postDeposit,
);

router.get("/allDeposits", [validateJWT, haveRol("ADMIN_ROLE")], getDeposits);

router.get(
    "/myDeposits",
    [
        validateJWT,
        haveRol("ADMIN_ROLE", "USER_ROLE"),
        check("noAccount", "The account is required").not().isEmpty(),
        existsMyAccount,
        validateFields,
    ],
    getMyDeposits,
);

router.delete(
    "/",
    [
        validateJWT,
        haveRol("ADMIN_ROLE"),
        check("idDeposit", "The account is required").not().isEmpty(),
        validateFields,
    ],
    reverseDeposit,
);

export default router;
