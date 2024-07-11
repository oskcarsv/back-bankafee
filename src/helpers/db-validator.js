import User from "../../src/user/user.model.js";

import ClientPetition from "../clientPetition/clientPetition.model.js";

import Status from "../status/status.model.js";

import Account from "../account/account.model.js";

import AccountPetition from "../accountPetition/accountPetition.model.js";

import Product from "../products/product.model.js";

import CategoryProduct from "../categoryProduct/categoryProduct.model.js";
import Transfer from "../transfer/transfer.model.js";
import Deposit from "../deposit/deposit.model.js";
import HistoryPendingTransfer from "../deposit/depositPending.model.js";
import PendingTransfer from "../transfer/transferPending.model.js";
import Credit from "../credit/credit.model.js";

export const existentUsername_User = async (username = "") => {
  const existUsername = await User.findOne({ username });

  if (existUsername) {
    throw new Error(`The Username ${username} was register`);
  }
};

export const existentUsername_ClientPetition = async (username = "") => {
  const existUsername = await ClientPetition.findOne({ username });

  if (existUsername) {
    throw new Error(`The Username ${username} is already in use`);
  }
};

export const existentEmail_User = async (email = "") => {
  const existEmail = await User.findOne({ email });

  if (existEmail) {
    throw new Error(`The Email ${email} was register`);
  }
};

export const existentEmail_ClientPetition = async (email = "") => {
  const existEmail = await ClientPetition.findOne({ email });

  if (existEmail) {
    throw new Error(`The Email ${email} is already in use`);
  }
};

export const existentDPI = async (DPI = "") => {
  const existDPI = await User.findOne({ DPI });

  if (!existDPI) {
    throw new Error(`The DPI ${DPI} not found in the database`);
  }
};

export const existentUserStatus = async (status = "") => {
  const existUserStatus = await Status.findOne({ userStatus: status });

  if (!existUserStatus) {
    throw new Error(`The Status ${status} not found in the database`);
  }
};

export const existentClientPetitionStatus = async (status = "") => {
  const existClientPetitionStatus = await Status.findOne({
    clientPetitionStatus: status,
  });

  if (!existClientPetitionStatus) {
    throw new Error(`The Status ${status} not found in the database`);
  }
};

export const existentno_Petition = async (no_Petition = "") => {
  const existno_Petition = await ClientPetition.findOne({ no_Petition });

  if (!existno_Petition) {
    throw new Error(`No. of Petition ${no_Petition} not found in the database`);
  }
};

export const existsUserDPI = async (DPI = "") => {
  const user = await User.findOne({ DPI });

  if (user.DPI != DPI) {
    throw new Error(`The DPI ${DPI} does not exist`);
  }
};

export const existsUserDPI_Number = async (DPI = "") => {
  const user = await User.findOne({ DPI });

  if (user) {
    throw new Error(`The DPI ${DPI} exist in database`);
  }
};

export const existsAccount = async (idAccount = "") => {
  // find the account with the idAccount and check if it exists
  const account = await Account.findById(idAccount);
  if (!account) {
    throw new Error(`The Account ${idAccount} does not exist`);
  }
};

export const existsProductById = async (id = "") => {
  const existsProduct = await Product.findById(id);
  if (!existsProduct) {
    throw new Error(`The product with id ${id} does not exist`);
  }
};

export const existsCategoryProductById = async (id) => {
  const existsCategoryProduct = await CategoryProduct.findById(id);
  if (!existsCategoryProduct) {
    throw new Error(`The ID doesn't exist ${id}`);
  }
};

export const existsProductByName = async (name) => {
  const existsProduct = await Product.findOne({ name });
  if (existsProduct) {
    throw new Error(`The name ${name} already exists`);
  }
};

export const existsCategoryProductByName = async (name) => {
  const existsCategoryProduct = await CategoryProduct.findOne({ name });
  if (existsCategoryProduct) {
    throw new Error(`The name ${name} already exists`);
  }
};

export const existsAccounts = async (account = "") => {
  const baseCode = "GT16BAAFGTQ";
  const accountSearch = await Account.findOne({
    noAccount: `${baseCode}${account}`,
  });
  if (!accountSearch) {
    throw new Error(
      `The account ${account} not exists in the Database verify No. Account`,
    );
  }
};

export const uniqueAccountInFavorites = async (noOwnerAccount, noAccount) => {
  // Assuming Favorite is already imported or defined above this function
  const favoriteRecord = await Favorite.findOne({ noOwnerAccount });

  if (!favoriteRecord) {
    throw new Error(
      `No favorite record found for owner account: ${noOwnerAccount}`,
    );
  }

  const accountExistsInFavorites = favoriteRecord.favorites.some(
    (favorite) => favorite.noAccount === noAccount,
  );

  if (accountExistsInFavorites) {
    throw new Error(
      `The account number ${noAccount} already exists in favorites.`,
    );
  }

  // If no error is thrown, the account number does not exist in favorites and is unique
  return true;
};

export const validateAmountTransfer = async (req, res, next) => {
  const baseCode = "GT16BAAFGTQ";
  const { noOwnerAccount, amount } = req.body;
  const accountSearch = await Account.findOne({
    noAccount: baseCode + noOwnerAccount,
  });
  if (!accountSearch) {
    return res.status(400).json({
      msg: "your account does not exist",
    });
  }
  if (accountSearch.amount < amount) {
    return res.status(400).json({
      msg: "The amount is greater than what the account has",
    });
  }
  next();
};

export const existsTransfer = async (idTransfer = "") => {
  const transfer = await Transfer.findById(idTransfer);
  if (!transfer) {
    throw new Error(`The transfer ${idTransfer} does not exist`);
  }
};

export const existsTransferPending = async (idTransfer = "") => {
  const transfer = await HistoryPendingTransfer.find({
    "transfer._id": idTransfer,
  });
  if (!transfer) {
    throw new Error(`The transfer pending ${idTransfer} does not exist`);
  }
};

export const verifyNoAccountDeleteTransfer = async (req, res, next) => {
  const { _id } = req.user;
  const { noOwnerAccount } = req.body;
  const baseCode = "GT16BAAFGTQ";
  const userLog = await User.findById(_id);
  for (const account of userLog.no_Account) {
    if (account != baseCode + noOwnerAccount) {
      return res
        .status(400)
        .json({ msg: "The account does not exist in the user" });
    }
  }
  next();
};

export const existsMyAccount = async (req, res, next) => {
  const { _id } = req.user;
  const { noAccount } = req.body;
  const baseCode = "GT16BAAFGTQ";
  const userLog = await User.findById(_id);
  for (const account of userLog.no_Account) {
    if (account != baseCode + noAccount) {
      return res
        .status(400)
        .json({ msg: "The account does not exist in the user" });
    }
  }
  next();
};

export const existsDeposit = async (idDeposit = "") => {
  const deposit = await Deposit.findById(idDeposit);
  if (!deposit) {
    throw new Error(`The deposit ${idDeposit} does not exist`);
  }
};

export const existsAccountDestination = async (req, res, next) => {
  const { noDestinationAccount, DPI_DestinationAccount } = req.body;
  const baseCode = "GT16BAAFGTQ";
  const accountDestination = await Account.findOne({
    noAccount: baseCode + noDestinationAccount,
    DPI_Owner: DPI_DestinationAccount,
  });

  if (!accountDestination) {
    return res.status(400).json({
      msg: "Destination Account not found, verify DPI Destination Account and No. Account destination",
    });
  }
  next();
};

export const notExistentNo_Petition = async (clientNo_Petition = "") => {
  const notExistNo_Petition = await ClientPetition.findOne({
    no_Petition: clientNo_Petition,
  });

  if (!notExistNo_Petition) {
    throw new Error(`The Client Petition: ${clientNo_Petition} not Exits`);
  }

  if ((notExistNo_Petition.status == "APPROVED") | "REJECTED") {
    throw new Error(
      `The Client Petition: ${clientNo_Petition} is already ${notExistNo_Petition.status}`,
    );
  }
};

export const validateAmountMaxTransfer = async (req, res, next) => {
  const { noOwnerAccount, amount } = req.body;
  const actualDay = new Date();
  const myPendingTrasfers = await PendingTransfer.find({
    noOwnerAccount,
    dateTime: {
      $gte: actualDay.getDate(),
    },
  });
  let total = 0;
  for (const pendingTransfer of myPendingTrasfers) {
    total += pendingTransfer.amount;
  }
  const totalAmount = total + amount;
  if (totalAmount > 2000) {
    return res.status(200).json({
      msg: `The maximum amount of transfers per day is $2000.00, it has accumulated ${total}, it wants to transfer ${amount}. Its capacity is ${2000 - total}`,
    });
  } else {
    next();
  }
};

export const validateCreditState = async (stateCredit = "") => {
  if (stateCredit != "" || stateCredit != undefined) {
    const creditState = await Status.findOne({ creditStatus: stateCredit });

    if (!creditState) {
      throw new Error(`The Status ${stateCredit} not found in the database`);
    }
  }
};

export const validateExistsCreditInProcess = async (no_Account = "") => {
  const creditInProcess = await Credit.findOne({
    no_Account_Owner: `${"GT16BAAFGTQ" + no_Account}`,
    status: "IN-PROCESS",
  });

  if (creditInProcess) {
    throw new Error(
      `The account ${no_Account} already has a credit in process`,
    );
  }
};

export const validateMyAccountCredit = async (req, res, next) => {
  const { _id } = req.user;
  const { no_Account } = req.body;
  const baseCode = "GT16BAAFGTQ";
  const userLog = await User.findById(_id);
  for (const account of userLog.no_Account) {
    if (account != baseCode + no_Account) {
      return res
        .status(400)
        .json({ msg: "The account does not exist in the user" });
    }
  }
  next();
};

export const statusPetition = async (noPetition = "") =>{

  const petition = await AccountPetition.findOne({ noPetition });

  if (!petition) {
    throw new Error(`The Petition ${noPetition} not found in the database`);
  }else{

    switch(petition.status){

      case "APPROVED":

        throw new Error(`The Petition ${noPetition} is already APPROVED`);

        break;

      case "REJECTED":

        throw new Error(`The Petition ${noPetition} is already REJECTED`);

        break;

      default:

        break;

    }

  }

}
