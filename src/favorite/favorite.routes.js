import { Router } from "express";

import { check } from "express-validator";

import { existsAccounts, existAccountFavorite } from "../helpers/db-validator.js";

import { validateFields } from "../middlewares/validate-fields.js";

import {
    getFavorite,
    addFavorite,
    deleteFavoriteByIdOwnerAccount,
    deleteAllFavorites
} from "./favorite.controller.js";

import { validateJWT } from "../middlewares/validate-jwt.js";

import { haveRol } from "../middlewares/validate-role.js";

const router = Router();

router.get(
    "/",
    // validateJWT,
    getFavorite,
);


router.post(
    "/",

    [
        // validateJWT,
        check("noOwnerAccount", "The Number of the Owner Account is required").not().isEmpty(),
        // check("noAccount", "The Number of the favorite Account is required").not().isEmpty(),
        check(["noOwnerAccount"], "error").custom(existAccountFavorite),
        check(["noAccount"], "error").custom(existAccountFavorite),
        validateFields
    ]
    , addFavorite
)


export default router;