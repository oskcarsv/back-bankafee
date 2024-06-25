import { Router } from "express";

import { check } from "express-validator";

import { existsAccounts } from "../helpers/db-validator.js";

import { validateFields } from "../middlewares/validate-fields.js";

import {
    getFavorite,
    addFavorite,
    deleteFavorite,
    clearFavorites
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
        check("favorites.*.noAccount", "The Number of the Account is required").not().isEmpty(),
        check("favorites.*.alias", "The Alias for the Account is required").not().isEmpty(),
        check(["noOwnerAccount"], "error").custom(existsAccounts),
        check(["favorites.*.noAccount"], "error").custom(existsAccounts),

        validateFields
    ]
    , addFavorite
)

router.delete(
    "/:deleteFavorite",
    // validateJWT,
    deleteFavorite
);


export default router;