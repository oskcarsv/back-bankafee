import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { existsProductById } from "../helpers/db-validator.js";
import { productGet, productImg, productPut, productDelete} from "./product.controller.js";
import { existsProductByName } from "../middlewares/validate-product.js";
const router = Router();

router.get('/', productGet);

router.post('/create',
    [
        // check('name', 'The name is required').not().isEmpty(),
        // check('description', 'The description is required').not().isEmpty(),
        // check('price', 'The price is required').not().isEmpty(),
        // check('category', 'The category is required').not().isEmpty(),
        // check('stock', 'The stock is required').not().isEmpty(),
        existsProductByName,
        validateFields
    ],
    productImg
);

router.put('/update/:id',
    [
        check('id', 'The id is not valid').isMongoId(),
        check('id').custom(existsProductById),
        validateFields
    ],
    productPut
);

router.delete('/delete/:id',
    [
        check('id', 'The id is not valid').isMongoId(),
        check('id').custom(existsProductById),
        validateFields
    ],
    productDelete
);

export default router;