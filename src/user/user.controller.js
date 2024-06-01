import User from "./user.model.js";

import bcryptjs from "bcryptjs";

import ClientPetition from "../clientPetition/clientPetition.model.js";

export const addUser = async (req, res) => {
  const {
    name,
    username,
    DPI,
    adress,
    email,
    phoneNumber,
    workPlace,
    monthlyIncome,
  } = req.body;

  let notExistNo_Account = false;

  let randomNumberNo_Account =
    Math.floor(Math.random() * (1e16 - 1e15 + 1)) + 1e15;

  while (!notExistNo_Account) {
    const existNo_Petition = await User.findOne({
      no_Account: randomNumberNo_Account,
    });

    if (existNo_Petition) {
      randomNumberNo_Account =
        Math.floor(Math.random() * (1e16 - 1e15 + 1)) + 1e15;
    } else {
      notExistNo_Account = true;
    }
  }

  const arrayOptions = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "!",
    "@",
    "$",
    "#",
    "%",
  ];

  const arrayPassword = [];

  const limit = 8;

  for (let i = 0; i <= limit; i++) {
    const randomIndex = Math.floor(Math.random() * arrayOptions.length);

    const option = arrayOptions[randomIndex];

    arrayPassword.push(option);
  }

  const passwordUnified = arrayPassword.join("");

  const arrayKeyword = [];

  const limit2 = 10;

  for (let i = 0; i <= limit2; i++) {
    const randomIndex = Math.floor(Math.random() * arrayOptions.length);

    const option = arrayOptions[randomIndex];

    arrayKeyword.push(option);
  }

  const keywordUnified = arrayKeyword.join("");

  const user = new User({
    name,
    username,
    no_Account: randomNumberNo_Account,
    DPI,
    adress,
    email,
    password: passwordUnified,
    role: "USER_ROLE",
    phoneNumber,
    monthlyIncome,
    keyword: keywordUnified,
    workPlace,
    status: "ACTIVE",
  });

  const savePassword = user.password;

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(user.password, salt);

  const updatePetitionStatus = await ClientPetition.findOneAndUpdate(
    { username: user.username },
    { status: "APPROVED" },
  );

  await user.save();

  res.status(200).json({
    msg: `${req.user.username} has been created the ${user.username} successfully`,
    msg: `Admin the User that you created his username is: ${user.username} and his password is ${savePassword}`,
  });
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
    status = "APPROVED";
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

      user.password = bcryptjs.hashSync(password, salt);

      await user.save();
    }

    res.status(200).json({
      msg: `${req.user.username} you update your profile Successfully`,
    });
  } else {
    const { _id, no_Account, DPI, password, role, keyword, status, ...rest } =
      req.body;

    const userDPI = req.body.userDPI;

    await User.findOneAndUpdate({ DPI: userDPI }, rest);

    const user = await User.findOne({ DPI: userDPI });

    res.status(200).json({
      msg: `${req.user.username} you update the profile of ${user.username} successfully`,
    });
  }
};
