import User from '../user/user.model.js'

import { generateJWT } from '../helpers/generate-jwt.js'

import bcryptjs from 'bcryptjs'

import ClientPetition from '../clientPetition/clientPetition.model.js'

export const login = async (req, res) => {

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({
            msg: "Wrong Credentials, Username doesn't exists in database",
        });
    }

    if (user.state == 'INACTIVE') {
        return res.status(400).json({
            msg: "The User doesn't exists in database",
        });
    }

    if (user.state == 'LOCKED') {
        return res.status(400).json({
            msg: "The User has been locked, contact your administrator",
        });
    }

    if (user.state == 'SUSPENDED') {
        return res.status(400).json({
            msg: "The User has been suspended, contact your administrator",
        });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
        return res.status(400).json({
            msg: "Wrong Password",
        });
    }

    const token = await generateJWT(user.id);

    res.status(200).json({
        msg: 'Login successful',
        user,
        token

    });

}

export const clientPetition = async (req, res) => {

    const { name, username, DPI, adress, email, phoneNumber, workPlace, monthlyIncome ,aliasAccount,typeAccount} = req.body;

    let notExist = false;

    let randomNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    while (!notExist) {

        const existNo_Petition = await ClientPetition.findOne({ no_Petition: randomNumber });

        if (existNo_Petition) {

            randomNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

        } else {

            notExist = true;

        }

    }

    const petition = new ClientPetition({

        no_Petition: randomNumber,
        name,
        username,
        DPI,
        adress,
        email,
        phoneNumber,
        workPlace,
        monthlyIncome,
        aliasAccount,
        typeAccount,
        status: 'IN-PROCESS'
    });

    await petition.save();

    res.status(200).json({

        msg: `${petition.name} your petition has been created, await for a response of the administrator in your email`,

    });

}

