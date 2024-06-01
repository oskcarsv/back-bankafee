import Model from "../account/account.model.js";
import User from "../user/user.model.js";

export const usernameCharactersLimit = async (username = '') => {
    
    const length = username.length;

    if (length < 3 || length > 13) {

        throw new Error(`The Username must have between 4 and 12 characters`)

    }
    
}

export const DPICharactersLimit = async (DPI = '') => {

    const length = String(DPI).length;

    if (length != 13) {

        throw new Error(`The DPI must have 13 characters`)
        
    }

}

export const phoneNumberCharactersLimit = async (phoneNumber = '') => {

    const length = phoneNumber.length;

    if (length < 7 || length > 14) {

        throw new Error(`The Phone number must have between 8 and 13 characters`)
        
    }

}

export const workPlaceCharactersLimit = async (workPlace = '') => {

    const length = workPlace.length;

    if (length > 121) {
        
        throw new Error(`The Work Place must have less than 120 characters`)

    }
    
}

export const nameCharactersLimit = async (name = '') => {

    const length = name.length;

    if (length > 46) {

        throw new Error(`The Name must have less than 45 characters`)

    }
    
}

export const miniumMonthyIncome = async (monthlyIncome = '') => {

    if (monthlyIncome < 100) {

        throw new Error(`The Monthly Income must be greater than 100`)

    }

}

export const existsUserDPI = async (DPI = '') => {
    //find the user with the DPI and check if it exists
    const user = await User.findOne({DPI});
    if (user.DPI!=DPI) {
        throw new Error(`The DPI ${DPI} does not exist`)
    }
}

export const existsAccount = async (idAccount = '') => {
    //find the account with the idAccount and check if it exists
    const account = await Model.findById(idAccount);
    if (!account) {
        throw new Error(`The Account ${idAccount} does not exist`)
    }
}