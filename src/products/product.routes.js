import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { existsProductById } from "../helpers/db-validator.js";
import {
  productGet,
  getProductByName,
  productPost,
  productDelete,
} from "./product.controller.js";
const router = Router();

router.get("/", productGet);

router.post(
  "/create",
  [
    check('name', 'The name is required').not().isEmpty(),
    check('description', 'The description is required').not().isEmpty(),
    check('price', 'The price is required').not().isEmpty(),
    check('category', 'The category is required').not().isEmpty(),
    check('stock', 'The stock is required').not().isEmpty(),
    check('img', 'The img is required').not().isEmpty(),
    validateFields,
  ],
  productPost,
);

router.get(
  "/searchProductName/:name",
  getProductByName,
);

router.delete(
  "/delete/:id",
  [
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(existsProductById),
    validateFields,
  ],
  productDelete,
);

export default router;
