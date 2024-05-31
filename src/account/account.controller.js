import Account from './account.model.js';

export const postAccount= async(req,res)=>{
    const {type, DPI_Owner,alias,amount} = req.body;
    const account = new Account({type, DPI_Owner,alias,amount});
    account.save();
    res.status(200).json(account);
}

export const getAccount= async(req,res)=>{
    const listAccounts = await Account.find({status:true});
    res.status(200).json(listAccounts);
}

export const getAccountById= async(req,res)=>{
    const {idAccount} =req.body;
    const account = await Account.findById(idAccount);
    res.status(200).json(account);
}

export const putAccount= async(req,res)=>{
    
}

export const deleteAccount= async(req,res)=>{
    
}