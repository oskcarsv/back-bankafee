import {Router} from 'express';
import {postTransfer, putTransfer} from './transfer.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { existsAccountDestination,existsAccounts, existsTransfer, validateAmountTransfer } from '../helpers/db-validator.js';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import { haveRol } from '../middlewares/validate-role.js';
const router = Router();

router.post('/',[validateJWT,
    haveRol('ADMIN_ROLE','USER_ROLE'),
    check(['noOwnerAccount','noDestinationAccount'],'error').custom(existsAccounts),
    validateAmountTransfer,
    check('description','The description is mandatory and must be a maximum of 50 characters').not().isEmpty().isLength({max:50}),
    existsAccountDestination,
    validateFields
],postTransfer)

router.put('/',[validateJWT,
    haveRol('ADMIN_ROLE','USER_ROLE'),
    check('description','The description is mandatory and must be a maximum of 50 characters').not().isEmpty().isLength({max:50}),
    check('idTransfer','The idTransfer is required').not().isEmpty(),
    check('idTransfer','The idTransfer is not valid').custom(existsTransfer),
    validateFields
],putTransfer);

export default router;
