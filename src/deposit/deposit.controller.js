import Desposit from "./deposit.model.js";
import Account from "../account/account.model.js";

const pendingDeposit = [];

export const changeAmount = async (noAccount, amount) => {
  const baseCode = "GT16BAAFGTQ";
  const account = await Account.findOne({ noAccount: baseCode + noAccount });
  account.amount += amount;
  await Account.findByIdAndUpdate(account._id, { amount: account.amount });
};

export const methodDeposit = async (objectDeposit) => {
  setTimeout(
    () =>
      pendingDeposit.map((deposit) => {
        if (deposit._id == objectDeposit._id) {
          switch (deposit.status) {
            case "PROCESSING":
              changeAmount(deposit.noDestinationAccount, deposit.amount);
              deposit.status = "COMPLETED";
              break;
            case "CANCELED":
              deposit.status = "CANCELED";
              break;
          }
          deposit.save();
          pendingDeposit.splice(pendingDeposit.indexOf(deposit), 1);
        }
      }),
    20000,
  );
};

export const postDeposit = async (req, res) => {
  const { noDestinationAccount, amount } = req.body;
  const dateTime = new Date();
  const deposit = new Desposit({
    noDestinationAccount,
    amount,
    dateTime,
    status: "PROCESSING",
  });
  deposit.save();
  pendingDeposit.push(deposit);
  methodDeposit(deposit);
  res.status(201).json({
    msg: `Deposit created successfully the deposit ID is:${deposit._id}`,
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
  if (pendingDeposit.length == 0) {
    res.status(404).json({ msg: "Not exists pending deposits" });
  } else {
    pendingDeposit.map((deposit) => {
      if (deposit._id == idDeposit) {
        deposit.status = "CANCELED";
        res.status(200).json({ msg: "Deposit canceled" });
      } else {
        res.status(404).json({ msg: "Deposit not found" });
      }
    });
  }
};
