import Account from "../account/account.model.js";

export const accountTrasnferLimit = async (req, res, next) => {

  const { amount, noOwnerAccount } = req.body;

  const account = await Account.findOne({ noAccount: "GT16BAAFGTQ" + noOwnerAccount });

  if (amount > account.amount) {
    return res.status(400).json({
      msg: "The amount is greater than what the account has",
    });
  }

  next();
};

export const properAccount = async (req, res, next) => {

  const { noOwnerAccount } = req.body;

  const account = await Account.findOne({ noAccount: "GT16BAAFGTQ" + noOwnerAccount });

  if (req.user.DPI != account.DPI_Owner) {

    return res.status(400).json({
      msg: "You can't tranfer in a account that is not yours",
    });

  }
  next();

}
