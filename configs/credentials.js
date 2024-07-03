import User from "../src/user/user.model.js";

import Roles from "../src/roles/roles.model.js";

import Status from "../src/status/status.model.js";

import bcryptjs from "bcryptjs";

export const initialCredentials = async () => {
  // Admin User

  const adminUser = new User({
    name: "ADMINB",
    username: "ADMINB",
    no_Account: 8475293186501732,
    DPI: 9785412580101,
    adress: "Guatemala, Guatemala",
    email: "adminb@gmail.com",
    password: "ADMINB",
    role: "ADMIN_ROLE",
    phoneNumber: "+502 00000000",
    workPlace: "Bankafee",
    monthlyIncome: 10000,
    keyword: "AB126CZF",
    status: "ACTIVE",
  });

  const salt = bcryptjs.genSaltSync();
  adminUser.password = bcryptjs.hashSync(adminUser.password, salt);
  await adminUser.save();

  // Roles

  const USER_ROLE = new Roles({
    rolesName: "USER_ROLE",
  });

  const ADMIN_ROLE = new Roles({
    rolesName: "ADMIN_ROLE",
  });

  await USER_ROLE.save();
  await ADMIN_ROLE.save();

  // User Status

  const ACTIVE = new Status({
    userStatus: "ACTIVE",
  });

  const INACTIVE = new Status({
    userStatus: "INACTIVE",
  });

  const LOCKED = new Status({
    userStatus: "LOCKED",
  });

  const SUSPENDED = new Status({
    userStatus: "SUSPENDED",
  });

  await ACTIVE.save();
  await INACTIVE.save();
  await LOCKED.save();
  await SUSPENDED.save();

  // Client Petition Status

  const IN_PROCESS = new Status({
    clientPetitionStatus: "IN-PROCESS",
  });

  const APPROVED = new Status({
    clientPetitionStatus: "APPROVED",
  });

  const REJECTED = new Status({
    clientPetitionStatus: "REJECTED",
  });

  await IN_PROCESS.save();
  await APPROVED.save();
  await REJECTED.save();

  // Credit Status

  const IN_PROCESS_Credit = new Status({
    creditStatus: "IN-PROCESS",
  });

  const APPROVED_Credit = new Status({
    creditStatus: "APPROVED",
  });

  const REJECTED_Credit = new Status({
    creditStatus: "REJECTED",
  });

  const PAID_Credit = new Status({
    creditStatus: "PAID",
  });

  await IN_PROCESS_Credit.save();
  await APPROVED_Credit.save();
  await REJECTED_Credit.save();
  await PAID_Credit.save();

  console.log("Credentials created");
};
