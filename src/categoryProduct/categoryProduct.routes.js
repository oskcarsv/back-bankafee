import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import {
  existsCategoryProductById,
  existsCategoryProductByName,
} from "../helpers/db-validator.js";
import {
  getCategoryProductById,
  categoryProductGet,
  categoryProductPost,
  categoryProductPut,
  categoryProductDelete,
} from "./categoryProduct.controller.js";

const router = Router();

router.get("/", categoryProductGet);

router.get(
  "/:id",
  [
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(existsCategoryProductById),
    validateFields,
  ],
  getCategoryProductById,
);

router.post(
  "/create",
  [
    check("name").custom(existsCategoryProductByName),
    check("name", "The name is required").not().isEmpty(),
    check("description", "The description is required").not().isEmpty(),
    check("img", "The image is required").not().isEmpty(),
    validateFields,
  ],
  categoryProductPost,
);

router.put(
  "/update/:id",
  [check("id", "The id is not valid").isMongoId(), validateFields],
  categoryProductPut,
);

router.delete(
  "/delete/:id",
  [
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(existsCategoryProductById),
    validateFields,
  ],
  categoryProductDelete,
);

export default router;
