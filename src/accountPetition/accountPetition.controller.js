import AccountPetition from "./accountPetition.model.js";

import Account from "../account/account.model.js";

export const postAccountPetition = async (req, res) => {
  const { type, DPI_Owner, alias, amount } = req.body;

  let notExist = false;

  let randomNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

  while (!notExist) {
    const existNo_Petition = await AccountPetition.findOne({
      noPetition: randomNumber,
    });

    if (existNo_Petition) {
      randomNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    } else {
      notExist = true;
    }
  }

  const accountPetition = new AccountPetition({
    noPetition: randomNumber,
    type,
    DPI_Owner,
    alias,
    amount,
    status: "IN-PROCESS",
  });

  await accountPetition.save();

  res.status(200).json({
    msg: `${accountPetition.noPetition} created Successfully`,
  });
};

export const listAccountPetition = async (req, res = response) => {
  const { limit, from } = req.query;

  const query = { status: "IN-PROCESS" };

  const [total, accountPetition] = await Promise.all([
    AccountPetition.countDocuments(query),

    AccountPetition.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    msg: `${req.user.username} the Petitions that have the status IN-PROCESS are:`,
    accountPetition,
  });
};
