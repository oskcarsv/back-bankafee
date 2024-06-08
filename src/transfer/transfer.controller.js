import cron from 'node-cron'
import Account from "../account/account.model.js";
import HistoryPending from "./transferPending.model.js";
import Transfer from "./transfer.model.js";

cron.schedule('0 0-59 * * * *', async () => {
  const listPending = await HistoryPending.find();
  const date = new Date().getMinutes();
  if (listPending.length >= 0) {
    listPending.map(async (pending) => {
      // checking if the time of the pending transfer is greater than the current time
      if (pending.transfer.dateTime.getMinutes() + 1 > 60) {
        // if the time of the pending transfer is greater than the current time, the difference is calculated
        if (pending.transfer.dateTime.getMinutes() + 1  >= date) {
          await methodTransferCompleted(pending.transfer);
          await HistoryPending.deleteOne(pending._id);
        }
      } else {
        // if the time of the pending transfer is less than the current time, the difference is calculated
        if (pending.transfer.dateTime.getMinutes() + 1  >= date) {
          await methodTransferCompleted(pending.transfer);
          await HistoryPending.deleteOne(pending._id);
        }
      }
    });
  }
})

export const changeAmount = async (
  noOwnerAccount,
  noDestinationAccount,
  amount,
) => {
  const baseCode = "GT16BAAFGTQ";
  const accountOwner = await Account.findOne({
    noAccount: baseCode + noOwnerAccount,
  });
  const accountDestination = await Account.findOne({
    noAccount: baseCode + noDestinationAccount,
  });
  accountOwner.amount = accountOwner.amount - amount;
  accountDestination.amount = accountDestination.amount + amount;
  await Account.findByIdAndUpdate(accountOwner._id, {
    amount: accountOwner.amount,
  });
  await Account.findByIdAndUpdate(accountDestination._id, {
    amount: accountDestination.amount,
  });
};
// Function that will be executed when the transfer is completed
const methodTransferCompleted = async (objectTransfer) => {
  objectTransfer.status = "COMPLETED";
  const transfer = Transfer(objectTransfer);
  await transfer.save();
  await changeAmount(
    objectTransfer.noOwnerAccount,
    objectTransfer.noDestinationAccount,
    objectTransfer.amount,
  );
};

export const postTransfer = async (req, res) => {
  const {
    noOwnerAccount,
    noDestinationAccount,
    DPI_DestinationAccount,
    amount,
    description
  } = req.body;
  const dateTime = new Date();

  const objectTransfer = new Transfer({
    noOwnerAccount,
    noDestinationAccount,
    DPI_DestinationAccount,
    amount,
    description,
    dateTime,
    status: "PROCESSING",
  });
  await HistoryPending({ transfer: objectTransfer }).save();
  return res.status(200).json({ msg: `Transfer in process, the ID transfer is: ${objectTransfer._id}` });
};

export const getAllTransfers = async (req, res) => {
  const transfers = await Transfer.find();
  return res.status(200).json({ transfers });
};

export const getTransfersForAccount = async (req, res) => {
  const { noAccount } = req.body;
  const [transfersTo,    transfersReceive] = await Promise.all(
    Transfer.find({ noOwnerAccount: noAccount, status: "COMPLETED"}),
    Transfer.find({ noDestinationAccount: noAccount, status: "COMPLETED"})
  );
  return res.status(200).json({ 
    transfersTo,
    transfersReceive
  });
};

export const getMyTransfers = async (req, res) => {
  const { noAccount } = req.body;
  const [transfersTo,    transfersReceive] = await Promise.all([
    Transfer.find({ noOwnerAccount: noAccount, status: "COMPLETED"}),
    Transfer.find({ noDestinationAccount: noAccount, status: "COMPLETED"})
  ]);
  return res.status(200).json({ 
    transfersTo,
    transfersReceive
  });
};

export const getTransfersCompleted = async (req, res) => {
  const { noAccount } = req.body;
  const transfers = await Transfer.find({
    noOwnerAccount: noAccount,
    status: "COMPLETED",
  });
  return res.status(200).json({ transfers });
};

export const getTransfersCanceled = async (req, res) => {
  const { noAccount } = req.body;
  const transfers = await Transfer.find({
    noOwnerAccount: noAccount,
    status: "CANCELED",
  });
  return res.status(200).json({ transfers });
};

export const putTransfer = async (req, res) => {
  const { description, idTransfer } = req.body;
  const transfer = await Transfer.findOne({
    _id: idTransfer,
    status: "COMPLETED",
  });
  const pendingTransfer = await HistoryPending.findOne({ "transfer._id": idTransfer });
  let transferNew;
  if (!transfer && !pendingTransfer) {
    return res.status(400).json({ msg: "The transfer does not exist" });
  }

  if (transfer) {
    transfer.description = description;
    await Transfer.findByIdAndUpdate(transfer._id, {
      description: transfer.description,
    });

    transferNew = await Transfer.find({
      _id: idTransfer,
      status: "COMPLETED",
    });
  }
  if (pendingTransfer) {
    pendingTransfer.transfer.description = description;
    await HistoryPending.findByIdAndUpdate(pendingTransfer._id, {
      "transfer.description": pendingTransfer.transfer.description,
    });
    transfer = await HistoryPending.findOne({ "transfer._id": idTransfer });
  }

  return res.status(200).json({
    msg: "Transfer updated  successfully",
    transfer: transferNew,
  });
};

export const reverseTransfer = async (req, res) => {
  const { idTransfer } = req.body;
  let count = 0;
  const pendingTransfer = await HistoryPending.find();
  // checking if there are pending deposits
  if (pendingTransfer.length == 0) {
    res.status(404).json({ msg: "Not exists pending deposits" });
  } else {
    // if exists pending deposits, the deposit is searched and the status is changed to canceled
    pendingTransfer.map(async (pendingTransfer) => {
      // checking if the deposit exists
      if (pendingTransfer.transfer._id == idTransfer) {
        pendingTransfer.transfer.status = "CANCELED";
        // creating a new deposit with the data received
        const transfer = Transfer(pendingTransfer.transfer);
        await transfer.save();
        // saving the deposit in the pending deposit collection
        await HistoryPending.deleteOne(pendingTransfer._id)
        res.status(200).json({ msg: "Deposit canceled" });
      } else {
        // if the deposit does not exist, the count is increased to check if the deposit exists
        count++;
        if (count >= pendingTransfer.length) {
          res.status(404).json({ msg: "Deposit not found" });
        }
      }
    });
  }
};