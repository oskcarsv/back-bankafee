import Account from './account.model.js';
//Method to create a random account number
const createNoAccount = () => {
    const codeCountry = 'GT';
    const checkDigit = '16';
    const codeBank = 'BAAF';
    const codeMonetary = 'GTQ';
    let noAccount='';
    for(let i=0;i<17;i++){
        noAccount += Math.floor(Math.random()*10);
    }
    return `${codeCountry}${checkDigit}${codeBank}${codeMonetary}${noAccount}`;
}

export const postAccount = async (req, res) => {
    const { type, DPI_Owner, alias, amount } = req.body;
    const noAccount = createNoAccount();
    const searchAccount = await Account.findOne({ noAccount });
    //Cicle to create a new account number if it already exists
    while(searchAccount){
        noAccount = createNoAccount();
        searchAccount = await Account.findOne({ noAccount });
    }

    const account = new Account({ type, DPI_Owner,noAccount:noAccount, alias, amount });
    account.save();
    res.status(200).json({
        msg: "Account has been created successfully",
        account
    });
}

export const getAccount = async (req, res) => {
    const listAccounts = await Account.find({ status: true });
    res.status(200).json(listAccounts);
}

export const getAccountById = async (req, res) => {
    const { idAccount } = req.body;
    const account = await Account.findById(idAccount);
    res.status(200).json({
        msg: "Account has been found successfully",
        account
    });
}

export const putAccount = async (req, res) => {
    const {
        //type,
        alias, idAccount } = req.body;
    await Account.findByIdAndUpdate(idAccount, { alias });
    const account = await Account.findById(idAccount);
    res.status(200).json({
        msg: "Account has been updated successfully",
        account
    });
}

export const deleteAccount = async (req, res) => {
    const { idAccount } = req.body;
    await Account.findByIdAndUpdate(idAccount, { status: false });
    const account = await Account.findById(idAccount);
    res.status(200).json({
        msg: 'Account has been deleted successfully',
        account
    });
}