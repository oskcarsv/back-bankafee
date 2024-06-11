import { Router } from "express";

import { check } from "express-validator";

import { validateFields } from "../middlewares/validate-fields.js";

import {
    getFavorite,
    addFavorite,
    deleteFavoriteByIdOwnerAccount,
    deleteAllFavorites
}from "./favorite.controller.js";

import { validateJWT } from "../middlewares/validate-jwt.js";

import { haveRol } from "../middlewares/validate-role.js";

const router = Router();

router.get(
    "/",
    // [validateJWT],
    getFavorite,
  );


router.post (
    "/",
    
    [
        validateJWT,
        check("noOwnerAccount", "The Number of the Owner Account is required").not().isEmpty(),
        alias,
        check("noAccount", "The Number of the Account is required").not().isEmpty(),
    ]
    ,addFavorite
)