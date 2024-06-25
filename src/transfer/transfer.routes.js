import { Router } from "express";
import {
  postTransfer,
  putTransfer,
  getTransfersForAccount,
  getMyTransfers,
  getTransfersCanceled,
  getTransfersCompleted,
  getAllTransfers,
  reverseTransfer,
  getAllPendingTransfer,
} from "./transfer.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import {
  existsAccountDestination,
  existsAccounts,
  existsMyAccount,
  existsTransfer,
  existsTransferPending,
  validateAmountMaxTransfer,
  validateAmountTransfer,
  verifyNoAccountDeleteTransfer,
} from "../helpers/db-validator.js";
import {
  maxTransfer
} from '../helpers/data-validator.js'
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { haveRol } from "../middlewares/validate-role.js";
import { accountTrasnferLimit, properAccount } from "../middlewares/validate-transfer.js";
const router = Router();

router.post(
  "/",
  [
    validateJWT,
    haveRol("ADMIN_ROLE", "USER_ROLE"),
    check("amount").custom(maxTransfer),
    accountTrasnferLimit,
    properAccount,
    check(["noOwnerAccount", "noDestinationAccount"], "error").custom(
      existsAccounts
    ),
    validateAmountTransfer,
    check(
      "description",
      "The description is mandatory and must be a maximum of 50 characters",
    )
      .not()
      .isEmpty()
      .isLength({ max: 50 }),
    existsAccountDestination,
    validateAmountMaxTransfer,
    validateFields,
  ],
  postTransfer,
);

router.get(
  "/",
  [validateJWT, haveRol("ADMIN_ROLE"), validateFields],
  getAllTransfers,
);

router.get( 
  "/pending",
  [
    validateJWT,
    haveRol("ADMIN_ROLE")
  ],
  getAllPendingTransfer,
);

router.get(
  "/transferForAccount",
  [
    validateJWT,
    haveRol("ADMIN_ROLE"),
    check("noAccount", "The idAccount is required").not().isEmpty(),
    validateFields,
  ],
  getTransfersForAccount,
);

router.get(
  "/myTransfersForAccount",
  [
    validateJWT,
    haveRol("USER_ROLE", "ADMIN_ROLE"),
    existsMyAccount,
    check("noAccount", "The idAccount is required").not().isEmpty(),
    validateFields,
  ],
  getMyTransfers,
);

router.get(
  "/myTransfersCompleted",
  [
    validateJWT,
    haveRol("USER_ROLE", "ADMIN_ROLE"),
    existsMyAccount,
    check("noAccount", "The idAccount is required").not().isEmpty(),
    validateFields,
  ],
  getTransfersCompleted,
);

router.get(
  "/myTransfersCanceled",
  [
    validateJWT,
    haveRol("USER_ROLE", "ADMIN_ROLE"),
    existsMyAccount,
    check("noAccount", "The idAccount is required").not().isEmpty(),
    validateFields,
  ],
  getTransfersCanceled,
);

router.put(
  "/",
  [
    validateJWT,
    haveRol("ADMIN_ROLE", "USER_ROLE"),
    check(
      "description",
      "The description is mandatory and must be a maximum of 50 characters",
    )
      .not()
      .isEmpty()
      .isLength({ max: 50 }),
    check("idTransfer", "The idTransfer is required").not().isEmpty(),
    check("idTransfer", "The idTransfer is not valid").custom(existsTransfer),
    validateFields,
  ],
  putTransfer,
);

router.delete(
  "/",
  [
    validateJWT,
    haveRol("ADMIN_ROLE", "USER_ROLE"),
    check("idTransfer", "The idTransfer is required").not().isEmpty(),
    check("idTransfer", "The idTransfer is not valid").custom(
      existsTransferPending,
    ),
    verifyNoAccountDeleteTransfer,
  ],
  reverseTransfer,
);

export default router;
