import {Router} from 'express';
import {postTransfer} from './transfer.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { existsAccountDestination,existsAccounts, validateAmountTransfer } from '../helpers/db-validator.js';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
const router = Router();

router.post('/',[validateJWT,
    check(['noOwnerAccount','noDestinationAccount'],'error').custom(existsAccounts),
    validateAmountTransfer,
    check('description','The description is mandatory and must be a maximum of 50 characters').not().isEmpty().isLength({max:50}),
    existsAccountDestination,
    validateFields
],postTransfer)

export default router;
