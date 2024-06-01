import User from "../../src/user/user.model.js";

import ClientPetition from "../clientPetition/clientPetition.model.js";

import Status from "../status/status.model.js";

import Account from "../account/account.model.js";
import Product from '../products/product.model.js';

import CategoryProduct from '../categoryProduct/categoryProduct.model.js';

export const existentUsername_User = async (username = '') => {
    const existUsername = await User.findOne({ username })
  
    if (existUsername) {
      throw new Error(`The Username ${username} was register`)
    }

}

export const existentUsername_ClientPetition = async (username = '') => {
    const existUsername = await ClientPetition.findOne({ username })
  
    if (existUsername) {
      throw new Error(`The Username ${username} is already in use`)
    }
    
}

export const existentEmail_User = async (email = '') => {
  const existEmail = await User.findOne({ email })

  if (existEmail) {
    throw new Error(`The Email ${email} was register`)
  }

}

export const existentEmail_ClientPetition = async (email = '') => {
  const existEmail = await ClientPetition.findOne({ email })

  if (existEmail) {
    throw new Error(`The Email ${email} is already in use`)
  }
  
}

export const existentDPI = async (DPI = '') => {
  const existDPI = await User.findOne({ DPI })

  if (!existDPI) {
    throw new Error(`The DPI ${DPI} not found in the database`)
  }
  
}

export const existentUserStatus = async (status = '') => {
  const existUserStatus = await Status.findOne({ userStatus: status })

  if (!existUserStatus) {
    throw new Error(`The Status ${status} not found in the database`)
  }
  
}

export const existentClientPetitionStatus = async (status = '') => {
  
  const existClientPetitionStatus = await Status.findOne({ clientPetitionStatus: status })

  if (!existClientPetitionStatus) {
    throw new Error(`The Status ${status} not found in the database`)
  }
  
}

export const existentno_Petition = async (no_Petition = '') => {
  
  const existno_Petition = await ClientPetition.findOne({ no_Petition })

  if (!existno_Petition) {
    throw new Error(`No. of Petition ${no_Petition} not found in the database`)
  }
  
}

export const existsUserDPI = async (DPI = '') => {

  const user = await User.findOne({DPI});

  if (user.DPI!=DPI) {

      throw new Error(`The DPI ${DPI} does not exist`)

  }

}

export const existsUserDPI_Number = async (DPI = '') => {

  const user = await User.findOne({DPI: DPI});

  if (user) {

      throw new Error(`The DPI ${DPI} exist in database`)

  }
  
}

export const existsAccount = async (idAccount = '') => {
  //find the account with the idAccount and check if it exists
  const account = await Account.findById(idAccount);
  if (!account) {
      throw new Error(`The Account ${idAccount} does not exist`)
  }
}

export const existsProductById = async (id = '') => {
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
    const existsProduct = await Product.findOne({ name  });
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
