import User from "./user.model.js";

import bcryptjs from "bcryptjs";

import ClientPetition from "../clientPetition/clientPetition.model.js";

import { createNoAccount } from "../account/account.controller.js";

import Account from "../account/account.model.js";

export const generateRandomWord = (word) =>{

  const specialChars = '!@#$%^&*';

  switch(word){
    
    case "password":

      const password = Math.random()
        .toString(36)
        .substring(2, 12)
        .toUpperCase();

      const randomSpecialChar = specialChars.charAt(Math.floor(Math.random() * specialChars.length));

      const randomPassword = password + randomSpecialChar;

      return randomPassword;

      break;

    case "keyword":

      const randomKeyword = Math.random()
        .toString(36)
        .substring(2, 12)
        .toUpperCase();

      return randomKeyword;

      break;

    default:

      break;

  }

}

export const addUser = async (req, res) => {

  const { clientNo_Petition } = req.body;

  const petition = await ClientPetition.findOne({ no_Petition: clientNo_Petition });

  switch (!!petition) {
    
    case true:

      const no_Account_New = createNoAccount();

      const searchAccount_New = await Account.findOne({ noAccount: no_Account_New });

      while (searchAccount_New) {
        no_Account_New = createNoAccount();
        searchAccount_New = await Account.findOne({ noAccount: no_Account_New });
      }

      const accountNew = new Account({
        noAccount: no_Account_New,
        alias: petition.aliasAccount,
        type: petition.typeAccount,
        DPI_Owner: petition.DPI,
      });

      const generatePaswordNew = generateRandomWord("password");

      let answerNew = true;

      let generateKeywordNew = "";

      do {

        generateKeywordNew = generateRandomWord("keyword");

        answerNew = await User.findOne({ keyword: generateKeywordNew });

      } while (answerNew);

      const userNew = new User({
        name: petition.name,
        username: petition.username,
        no_Account: no_Account_New,
        DPI: petition.DPI,
        adress: petition.adress,
        email: petition.email,
        password: generatePaswordNew,
        role: "USER_ROLE",
        phoneNumber: petition.phoneNumber,
        monthlyIncome: petition.monthlyIncome,
        keyword: generateKeywordNew,
        workPlace: petition.workPlace,
        status: "ACTIVE",
      });

      const savePasswordNew = userNew.password;

      const saltNew = bcryptjs.genSaltSync();
      userNew.password = bcryptjs.hashSync(userNew.password, saltNew);

      await userNew.save();

      await accountNew.save();

      const updatePetitionStatus = await ClientPetition.findOneAndUpdate(
        { no_Petition: clientNo_Petition },
        { status: "APPROVED" },
      );

      res.status(200).json({
        msg: `${req.user.username} has been created the ${userNew.username} successfully, the User that you created his username is: ${userNew.username} and his password is ${savePasswordNew}`,
      });
      
      break;
    
    case false:

      const {
        name,
        username,
        DPI,
        adress,
        email,
        phoneNumber,
        workPlace,
        monthlyIncome,
        type,
        alias,
      } = req.body;

      const no_Account = createNoAccount();

      const searchAccount = await Account.findOne({ noAccount: no_Account });

      while (searchAccount) {
        no_Account = createNoAccount();
        searchAccount = await Account.findOne({ noAccount: no_Account });
      }

      const account = new Account({
        noAccount: no_Account,
        alias,
        type,
        DPI_Owner: DPI,
      });

      const generatePasword = generateRandomWord("password");

      let answer = true;

      let generateKeyword = "";

      do {

        generateKeyword = generateRandomWord("keyword");

        answer = await User.findOne({ keyword: generateKeyword });

      } while (answer);

      const user = new User({
        name,
        username,
        no_Account,
        DPI,
        adress,
        email,
        password: generatePasword,
        role: "USER_ROLE",
        phoneNumber,
        monthlyIncome,
        keyword: generateKeyword,
        workPlace,
        status: "ACTIVE",
      });

      const savePassword = user.password;

      const salt = bcryptjs.genSaltSync();
      user.password = bcryptjs.hashSync(user.password, salt);

      await user.save();

      await account.save();

      res.status(200).json({
        msg: `${req.user.username} has been created the ${user.username} successfully, the User that you created his username is: ${user.username} and his password is ${savePassword}`,
      });
      
      break;

  }

  
};

export const deleteUser = async (req, res) => {
  const { DPI, status } = req.body;

  const user = await User.findOneAndUpdate({ DPI }, { status });

  res.status(200).json({
    msg: `${req.user.username} you ${status} the profile successfully`,
  });
};

export const listUser = async (req, res = response) => {
  const { limit, from } = req.query;

  let { status } = req.body;

  if (status == "" || status == undefined) {
    status = "ACTIVE";
  }

  const query = { status };

  const [total, user] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    msg: `${req.user.username} the users that have the status ${status} are:`,
    user,
  });
};

export const listOwnUser = async (req, res = response) => {
  const { limit, from } = req.query;

  const query = { DPI: req.user.DPI };

  const [total, user] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    msg: `${req.user.username} your profile are:`,
    user,
  });
};

export const listClientPetition = async (req, res = response) => {
  const { limit, from } = req.query;

  let { status } = req.body;

  if (status == "" || status == undefined) {
    status = "IN-PROCESS";
  }

  const query = { status };

  const [total, clientPetition] = await Promise.all([
    ClientPetition.countDocuments(query),
    ClientPetition.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    msg: `${req.user.username} the Petitions that have the status ${status} are:`,
    clientPetition,
  });
};

export const deletePetition = async (req, res) => {
  const { no_Petition, status } = req.body;

  const clientPetition = await ClientPetition.findOneAndUpdate(
    { no_Petition },
    { status },
  );

  res.status(200).json({
    msg: `${req.user.username} the petition is ${status}`,
  });
};

export const updateUser = async (req, res) => {
  if (req.user.role == "USER_ROLE") {
    const { _id, no_Account, DPI, role, keyword, status, ...rest } = req.body;

    await User.findOneAndUpdate({ DPI: req.user.DPI }, rest);

    const user = await User.findOne({ DPI: req.user.DPI });

    if (rest.password != null) {
      const salt = bcryptjs.genSaltSync();

      user.password = bcryptjs.hashSync(rest.password, salt);

      await user.save();
    }

    res.status(200).json({
      msg: `${req.user.username} you update your profile Successfully`,
    });
  } else {
    const { _id, no_Account, DPI, role, keyword, password, status, ...rest } =
      req.body;

    const userDPI = req.body.userDPI;

    await User.findOneAndUpdate({ DPI: userDPI }, rest);

    const user = await User.findOne({ DPI: userDPI });

    res.status(200).json({
      msg: `${req.user.username} you update the profile of ${user.username} successfully`,
    });
  }
};
