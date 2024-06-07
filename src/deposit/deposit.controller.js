import Deposit from "./deposit.model.js";
import Account from "../account/account.model.js";
import HistoryPending from './depositPendings.model.js';
import cron from 'node-cron'

// This function is used to change the amount of an account when a deposit is made
//its ejecuted a second, minute, hour, day of month,month, day of week in specific
cron.schedule('* 0-59 * * * *', async () => {
  const listPending = await HistoryPending.find();
  const date = new Date().getMinutes();
  if (listPending.length >= 0) {
    listPending.map(async (pending) => {
      if (pending.deposit.dateTime.getMinutes() + 30 > 60) {
        if (pending.deposit.dateTime.getMinutes() + 30 - 60 == date) {
          await methodDeposit(pending.deposit);
          await HistoryPending.deleteOne(pending._id);
        }
      } else {
        if (pending.deposit.dateTime.getMinutes() + 30 == date) {
          await methodDeposit(pending.deposit);
          await HistoryPending.deleteOne(pending._id);
        }
      }
    });
  }
})

export const changeAmount = async (noAccount, amount) => {
  const baseCode = "GT16BAAFGTQ";
  const account = await Account.findOne({ noAccount: baseCode + noAccount });
  account.amount += amount;
  await Account.findByIdAndUpdate(account._id, { amount: account.amount });
};

export const methodDeposit = async (objectDeposit) => {
  objectDeposit.status = "COMPLETED";
  await changeAmount(objectDeposit.noDestinationAccount, objectDeposit.amount);
  const deposit = Deposit(objectDeposit);
  await deposit.save();
  await HistoryPending.deleteOne(objectDeposit._id)
};

export const postDeposit = async (req, res) => {
  const { noDestinationAccount, amount } = req.body;
  // creating a new deposit with the data received
  const deposit = new Deposit({
    noDestinationAccount,
    amount,
    status: "PROCESSING"
  });
  await HistoryPending({ deposit: deposit }).save();//saving the deposit in the pending deposit collection
  res.status(201).json({
    msg: `Deposit created successfully the deposit ID is:${deposit._id}`,
  });
};

export const getDeposits = async (req, res) => {
  const deposits = await Deposit.find({ $or:{status:['COMPLETED','CANCELED'] }});
  res.status(200).json({ deposits });
};

export const getMyDeposits = async (req, res) => {
  const { noAccount } = req.body;
  const deposits = await Deposit.find({ noDestinationAccount: noAccount, status: "COMPLETED" });
  res.status(200).json({ deposits });
};

export const getPendingDeposits = async (req, res) => {
  const pendingDeposits = await HistoryPending.find({ "deposit.status": "PROCESSING"});
  res.status(200).json({ pendingDeposits });
}

export const reverseDeposit = async (req, res) => {
  const { idDeposit } = req.body;
  const pendingDeposit = await HistoryPending.find();
  // checking if there are pending deposits
  if (pendingDeposit.length == 0) {
    res.status(404).json({ msg: "Not exists pending deposits" });
  } else {
    // if exists pending deposits, the deposit is searched and the status is changed to canceled
    pendingDeposit.map(async (pendingDeposit) => {
      if (pendingDeposit.deposit._id == idDeposit) {
        pendingDeposit.deposit.status = "CANCELED";
        const deposit = Deposit(pendingDeposit.deposit);
        await deposit.save();
        await HistoryPending.deleteOne(pendingDeposit._id)
        res.status(200).json({ msg: "Deposit canceled" });
      } else {
        res.status(404).json({ msg: "Deposit not found" });
      }
    });
  }
};
