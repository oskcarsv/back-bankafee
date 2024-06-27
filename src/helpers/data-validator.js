export const usernameCharactersLimit = async (username = "") => {
  const length = username.length;

  if (length < 3 || length > 13) {
    throw new Error("The Username must have between 4 and 12 characters");
  }
};

export const DPICharactersLimit = async (DPI = "") => {
  const length = String(DPI).length;

  if (length != 13) {
    throw new Error("The DPI must have 13 characters");
  }
};

export const phoneNumberCharactersLimit = async (phoneNumber = "") => {
  const length = phoneNumber.length;

  if (length < 7 || length > 14) {
    throw new Error("The Phone number must have between 8 and 13 characters");
  }
};

export const workPlaceCharactersLimit = async (workPlace = "") => {
  const length = workPlace.length;

  if (length > 121) {
    throw new Error("The Work Place must have less than 120 characters");
  }
};

export const nameCharactersLimit = async (name = "") => {
  const length = name.length;

  if (length > 46) {
    throw new Error("The Name must have less than 45 characters");
  }
};

export const miniumMonthyIncome = async (monthlyIncome = "") => {
  if (monthlyIncome < 100) {
    throw new Error("The Monthly Income must be greater than 100");
  }
};

export const maxTransfer = async (amount = "") => {
  if (amount > 2000) {
    throw new Error("The maximum amount to transfer is 2000");
  }
}

export const maxCredit = async (creditAmount = 0) =>{

  if (creditAmount > 100000) {
    throw new Error("The maximum amount to credit is 100000");
  }

}
