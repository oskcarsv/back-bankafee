import User from "../user/user.model.js";
import Account from "../account/account.model.js";
import { maxCredit } from "../credit/credit.controller.js";

export const validationSalary = async (req, res, next) => {
  const { no_Account, creditAmount, creditTime } = req.body;

  const accountOwner = await Account.findOne({
    noAccount: `${"GT16BAAFGTQ" + no_Account}`,
  });

  const userOwner = await User.findOne({ DPI: accountOwner.DPI_Owner });

  let time = creditTime.toLowerCase();

  if (time == "3" || time == "three") {
    time = 3;
  }

  if (time == "6" || time == "six") {
    time = 6;
  }

  if (time == "12" || time == "twelve") {
    time = 12;
  }

  const maxAmount = maxCredit(time, userOwner.DPI);

  if (creditAmount > maxAmount) {
    return res.status(400).json({
      msg: "With your Actual Salary you can't make this credit",
    });
  }

  next();
};
