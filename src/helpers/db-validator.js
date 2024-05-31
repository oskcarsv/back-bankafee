import User from "../../src/user/user.model.js";

import ClientPetition from "../clientPetition/clientPetition.model.js";

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