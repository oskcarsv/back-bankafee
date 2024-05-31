import { Router } from 'express';
import { check } from 'express-validator';

import { validateFields } from '../middlewares/validate-fields.js';
import { existsCategoryName, nonExistentCategoryService, nonExistentCategoryServiceStatus } from '../helpers/category-service-validators.js';

import {
    createCategoryService,
    deleteCategoryService,
    getCategoryService,
    getCategoryServiceById,
    updateCategoryService
} from './category-service-model.controller.js';

const router = Router();

router.post(
    '/createCategory',
    [
        check('Name', 'Name is required').not().isEmpty(),
        check('Name').custom(existsCategoryName),
        check('Description', 'Description is required').not().isEmpty(),
        validateFields,
    ], createCategoryService
);

router.get(
    '/getCategory',
    getCategoryService
);

router.get(
    '/getCategoryById/:id',
    [
        check('id').custom(nonExistentCategoryService),
        check('id').custom(nonExistentCategoryServiceStatus),
        validateFields,
    ],
    getCategoryServiceById
);

router.put(
    '/updateCategoryService/:id',
    [
        check('id').custom(nonExistentCategoryService),
        check('id').custom(nonExistentCategoryServiceStatus),
        check('Name').custom(existsCategoryName),
        validateFields,
    ], updateCategoryService
);

router.delete(
    '/deleteCategoryService/:id',
    [
        check('id').custom(nonExistentCategoryService),
        check('id').custom(nonExistentCategoryServiceStatus),
        validateFields,
    ], deleteCategoryService
);

export default router;