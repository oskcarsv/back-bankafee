import Account from './account.model.js';

export const postAccount= async(req,res)=>{
    const {type, DPI_Owner,alias,amount} = req.body;
    const account = new Account({type, DPI_Owner,alias,amount});
    account.save();
    res.status(200).json({
        msg:"Account has been created successfully",
        account});
}

export const getAccount= async(req,res)=>{
    const listAccounts = await Account.find({status:true});
    res.status(200).json(listAccounts);
}

export const getAccountById= async(req,res)=>{
    const {idAccount} =req.body;
    const account = await Account.findById(idAccount);
    res.status(200).json({
        msg:"Account has been found successfully",
        account});
}

export const putAccount= async(req,res)=>{
    const {
        //type,
        alias,idAccount} = req.body;
    await Account.findByIdAndUpdate(idAccount,{alias});
    const account = await Account.findById(idAccount);
    res.status(200).json({
        msg:"Account has been updated successfully",
        account});
}

export const deleteAccount= async(req,res)=>{
    const {idAccount} = req.body;
    await Account.findByIdAndUpdate(idAccount,{status:false});
    const account = await Account.findById(idAccount);
    res.status(200).json({
        msg:'Account has been deleted successfully',
        account});
}