import User from "../../src/user/user.model.js";

import ClientPetition from "../clientPetition/clientPetition.model.js";

import Status from "../status/status.model.js";

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
