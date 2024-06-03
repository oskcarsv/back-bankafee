import Desposit from './deposit.model.js';
import Account from '../account/account.model.js';

export const postDeposit = async(req,res)=>{
    const {noDestinationAccount,amount}= req.body;
    const baseCode = 'GT16BAAFGTQ'
    const dateTime = new Date();
    const deposit= new Desposit({noDestinationAccount,amount,dateTime});
    const destinationAccount = await Account.findOne({noAccount:`${baseCode}${noDestinationAccount}`});
    destinationAccount.amount += amount;
    await Account.findByIdAndUpdate(destinationAccount._id,{amount:destinationAccount.amount});
    await deposit.save();
    res.status(201).json({
        msg:"The deposit was made successfully",
        deposit});
}