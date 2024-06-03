import Desposit from "./deposit.model.js";
import Account from "../account/account.model.js";

export const postDeposit = async (req, res) => {
  const { noDestinationAccount, amount } = req.body;
  const baseCode = "GT16BAAFGTQ";
  const dateTime = new Date();
  const deposit = new Desposit({ noDestinationAccount, amount, dateTime });
  const destinationAccount = await Account.findOne({
    noAccount: `${baseCode}${noDestinationAccount}`,
  });
  destinationAccount.amount += amount;
  await Account.findByIdAndUpdate(destinationAccount._id, {
    amount: destinationAccount.amount,
  });
  await deposit.save();
  res.status(201).json({
    msg: "The deposit was made successfully",
    deposit,
  });
};

export const getDeposits = async (req, res) => {
  const deposits = await Desposit.find();
  res.status(200).json({ deposits });
};

export const getMyDeposits = async (req, res) => {
  const { noAccount } = req.body;
  const deposits = await Desposit.find({ noDestinationAccount: noAccount });
  res.status(200).json({ deposits });
};

export const reverseDeposit = async (req, res) => {
  const { idDeposit } = req.body;
  const codeBase = "GT16BAAFGTQ";
  const deposit = await Desposit.findById(idDeposit);
  const destinationAccount = await Account.findOne({
    noAccount: codeBase + deposit.noDestinationAccount,
  });
  destinationAccount.amount -= deposit.amount;
  await Account.findByIdAndUpdate(destinationAccount._id, {
    amount: destinationAccount.amount,
  });
  await Desposit.findByIdAndUpdate(idDeposit, { status: false });
  res.status(200).json({ msg: "The deposit was reversed successfully" });
};
