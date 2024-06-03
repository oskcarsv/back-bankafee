import User from "../user/user.model.js";
import Account from "../account/account.model.js";
import Transfer from "./transfer.model.js";
// Object that will hold the transfer posts
const pendingTransfers = {};

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
const methodTransferCompleted = (objectTransfer) => {
  objectTransfer.status = "COMPLETED";
  objectTransfer.save();
  delete pendingTransfers[objectTransfer.noOwnerAccount];
  changeAmount(
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
    description,
    canceled,
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
  // Save the transfer in the database and set a timeout to simulate the transfer process. validate if the transfer is canceled
  if (canceled) {
    // If the transfer is canceled, the timeout is cleared and the status of the transfer is changed to CANCELED
    if (pendingTransfers[noOwnerAccount]) {
      // clear the timeout of the transfer
      clearTimeout(pendingTransfers[noOwnerAccount]);
      objectTransfer.status = "CANCELED";
      await objectTransfer.save();
      // delete the transfer from the pendingTransfers object
      delete pendingTransfers[noOwnerAccount];
      return res.status(200).json({ msg: "Transfer canceled successfully" });
    } else {
      return res
        .status(400)
        .json({ msg: "No pending transfer found to cancel" });
    }
  } else {
    // the methodTransferCompleted function is executed after n seconds
    pendingTransfers[noOwnerAccount] = setTimeout(
      () => methodTransferCompleted(objectTransfer),
      8000,
    );
  }
  return res.status(200).json({ msg: "Transfer in process" });
};

export const getAllTransfers = async (req, res) => {
  const transfers = await Transfer.find();
  return res.status(200).json({ transfers });
};

export const getTransfersForAccount = async (req, res) => {
  const { noAccount } = req.body;
  const transfers = await Transfer.find({ noOwnerAccount: noAccount });
  return res.status(200).json({ transfers });
};

export const getMyTransfers = async (req, res) => {
  const { noAccount } = req.body;
  const transfers = await Transfer.find({ noOwnerAccount: noAccount });
  return res.status(200).json({ transfers });
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
  if (!transfer) {
    return res.status(400).json({ msg: "The transfer is not completed" });
  }
  transfer.description = description;
  await Transfer.findByIdAndUpdate(transfer._id, {
    description: transfer.description,
  });
  const transferNew = await Transfer.find({
    _id: idTransfer,
    status: "COMPLETED",
  });

  return res.status(200).json({
    msg: "Transfer updated  successfully",
    transfer: transferNew,
  });
};
