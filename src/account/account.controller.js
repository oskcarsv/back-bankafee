import Account from "./account.model.js";
import AccountPetition from "../accountPetition/accountPetition.model.js";
// Method to create a random account number
export const createNoAccount = () => {
  const codeCountry = "GT";
  const checkDigit = "16";
  const codeBank = "BAAF";
  const codeMonetary = "GTQ";
  let noAccount = "";
  for (let i = 0; i < 17; i++) {
    noAccount += Math.floor(Math.random() * 10);
  }
  return `${codeCountry}${checkDigit}${codeBank}${codeMonetary}${noAccount}`;
};

export const postAccount = async (req, res) => {
  const { type, DPI_Owner, alias, amount } = req.body;
  const noAccount = createNoAccount();
  const searchAccount = await Account.findOne({ noAccount });
  // Cicle to create a new account number if it already exists
  while (searchAccount) {
    noAccount = createNoAccount();
    searchAccount = await Account.findOne({ noAccount });
  }

  const account = new Account({ type, DPI_Owner, noAccount, alias, amount });
  account.save();
  res.status(200).json({
    msg: "Account has been created successfully",
    account,
  });
};

export const acceptAccount = async (req, res) => {
  const { noPetition } = req.body;

  const searchAccountPetition = await AccountPetition.findOne({ noPetition });

  const noAccount = createNoAccount();

  const searchAccount = await Account.findOne({ noAccount });

  while (searchAccount) {
    noAccount = createNoAccount();
    searchAccount = await Account.findOne({ noAccount });
  }

  const account = new Account({
    type: searchAccountPetition.type,
    DPI_Owner: searchAccountPetition.DPI_Owner,
    noAccount,
    alias: searchAccountPetition.alias,
    amount: searchAccountPetition.amount,
  });

  const updateStatus = await AccountPetition.findOneAndUpdate(
    { noPetition },
    { status: "APPROVED" },
  );

  account.save();

  res.status(200).json({
    msg: "Account has been created successfully",
    account,
  });
};

export const deniedAccountPetition = async (req, res) => {
  const { noPetition } = req.body;

  const updateStatus = await AccountPetition.findOneAndUpdate(
    { noPetition },
    { status: "REJECTED" },
  );

  res.status(200).json({
    msg: `Petition with number: ${noPetition} has been rejected`,
  });
};

export const getAccount = async (req, res) => {
  const listAccounts = await Account.find({ status: true });
  res.status(200).json(listAccounts);
};

export const getAccountById = async (req, res) => {
  const { idAccount } = req.body;
  const account = await Account.findById(idAccount);
  res.status(200).json({
    msg: "Account has been found successfully",
    account,
  });
};

export const getAccountUser = async (req, res) => {
  const account = await Account.find({ DPI_Owner: req.user.DPI });

  res.status(200).json({
    msg: "Account has been found successfully",
    account,
  });
};

export const putAccount = async (req, res) => {
  const { alias, noAccount } = req.body;
  const baseCode = "GT16BAAFGTQ";
  await Account.findOneAndUpdate(
    { noAccount: `${baseCode}${noAccount}` },
    { alias },
  );
  const account = await Account.findOne({
    noAccount: `${baseCode}${noAccount}`,
  });
  res.status(200).json({
    msg: "Account has been updated successfully",
    account,
  });
};

export const deleteAccount = async (req, res) => {
  const { idAccount } = req.body;
  await Account.findByIdAndUpdate(idAccount, { status: false });
  const account = await Account.findById(idAccount);
  res.status(200).json({
    msg: "Account has been deleted successfully",
    account,
  });
};
