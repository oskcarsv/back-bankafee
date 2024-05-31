import { Router } from 'express';
import { check } from 'express-validator';
import { postAccount } from './account.controller.js';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { DPICharactersLimit, existsUserDPI, miniumMonthyIncome } from '../helpers/data-validator.js';
import { haveRol } from '../middlewares/validate-role.js';
const router = Router();

router.post('/', [validateJWT,
    haveRol('ADMIN_ROLE'),
    check('type', 'Type of account is required').not().isEmpty(),
    check('type', 'The account type must be SAVINGS, CURRENT, or CREDIT.').isIn(['SAVINGS', 'CURRENT', 'CREDIT']),
    check('DPI_Owner', 'DPI of the owner is required').not().isEmpty(),
    check('DPI_Owner').custom(DPICharactersLimit),
    check('DPI_Owner').custom(existsUserDPI),
    check('amount').custom(miniumMonthyIncome),
    check('alias', 'Alias of the account is required and maximum 50 characters').isLength({ max: 50 }),
    validateFields
], postAccount);

// router.put('/',[],);
// router.delete('/',[],);
// router.get('/',[],);
// router.get('/',[],);

export default router;