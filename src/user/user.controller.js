import User from "./user.model.js";

import bcryptjs from 'bcryptjs';

import ClientPetition from "../clientPetition/clientPetition.model.js";

export const addUser = async (req, res) =>{

    const {name, username, DPI, adress, email, phoneNumber, workPlace, monthlyIncome} = req.body;

    let notExistNo_Account = false;

    let randomNumberNo_Account = Math.floor(Math.random() * (1e16 - 1e15 + 1)) + 1e15;

    while(!notExistNo_Account){

        const existNo_Petition = await User.findOne({ no_Account: randomNumberNo_Account });

        if (existNo_Petition) {

            randomNumberNo_Account = Math.floor(Math.random() * (1e16 - 1e15 + 1)) + 1e15;

        }else{

            notExistNo_Account = true;

        }

    }

    var arrayOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '$', '#', '%'];

    var arrayPassword = [];

    let limit = 8;

    for(let i = 0; i <= limit; i++){

        let randomIndex = Math.floor(Math.random() * arrayOptions.length);

        let option = arrayOptions[randomIndex];

        arrayPassword.push(option);

    }

    let passwordUnified = arrayPassword.join('');

    var arrayKeyword = [];

    let limit2 = 10;

    for(let i = 0; i <= limit2; i++){

        let randomIndex = Math.floor(Math.random() * arrayOptions.length);

        let option = arrayOptions[randomIndex];

        arrayKeyword.push(option);

    }

    let keywordUnified = arrayKeyword.join('');

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
        status: "ACTIVE"

    })

    console.log(`Contraseña Usuario ${user.username} es: ${user.password}`);


    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(user.password, salt);

    const updatePetitionStatus = await ClientPetition.findOneAndUpdate({username: user.username}, {status: "APPROVED"});

    if(!updatePetitionStatus){

        return res.status(400).json({
            msg: "The User doesn't exists in database"
        });

    }

    await user.save();

    res.status(200).json({

        msg: `${req.user.username} has been created the ${user.username} successfully`

    });

}

export const deleteUser = async (req, res) =>{

    const { DPI, status} = req.body;

    const user = await User.findOneAndUpdate({DPI: DPI}, {status: status});

    res.status(200).json({

        msg: `${req.user.username} you ${status} the profile successfully`

    })

}

export const listUser = async (req, res = response) =>{

    const { limit, from } = req.query;

    let { status } = req.body;

    if(status == "" || status == undefined){

        status = "ACTIVE";

    }

    const query = {status: status};

    const [total, user] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        msg: `${req.user.username} the users that have the status ${status} are:`,
        user
    });

}

export const listOwnUser = async (req, res = response) =>{

    const { limit, from } = req.query;

    const query = {DPI: req.user.DPI}

    const [total, user] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.status(200).json({
        msg: `${req.user.username} your profile are:`,
        user
    });

}

export const listClientPetition = async (req, res = response) =>{

    const { limit, from } = req.query;

    let { status } = req.body;

    if(status == "" || status == undefined){

        status = "APPROVED";

    }

    const query = {status: status};

    const [total, clientPetition] = await Promise.all([
        ClientPetition.countDocuments(query),
        ClientPetition.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        msg: `${req.user.username} the Petitions that have the status ${status} are:`,
        clientPetition
    });

}

