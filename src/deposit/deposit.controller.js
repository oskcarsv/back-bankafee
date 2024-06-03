import Desposit from './deposit.model.js';
import Account from '../account/account.model.js';

const pendindDeposit = {}

export const methodDeposit = async (baseCode, objectDeposit) => {
    const destinationAccount = await Account.findOne({ noAccount: codeBase + objectDeposit.noDestinationAccount });
    destinationAccount.amount += objectDeposit.amount;
    await Account.findByIdAndUpdate(destinationAccount._id, { amount: destinationAccount.amount });
    objectDeposit.save();
    delete pendindDeposit[objectDeposit._id];
}

export const methodDepositCanceled = async (baseCode, objectDeposit) => {
    const destinationAccount = await Account.findOne({ noAccount: codeBase + objectDeposit.noDestinationAccount });
    destinationAccount.amount -= objectDeposit.amount;
    await Account.findByIdAndUpdate(destinationAccount._id, { amount: destinationAccount.amount });
    await Desposit.findByIdAndUpdate(objectDeposit._id, { status: false });
}

export const postDeposit = async (req, res) => {
    const { noDestinationAccount, amount } = req.body;
    const baseCode = 'GT16BAAFGTQ'
    const dateTime = new Date();
    const deposit = new Desposit({ noDestinationAccount, amount, dateTime });
    pendindDeposit[deposit._id] = setTimeout(() => methodDeposit(baseCode, deposit), 8000);
    res.status(201).json({
        msg: "Processing deposit"
    });
}

export const getDeposits = async (req, res) => {
    const deposits = await Desposit.find();
    res.status(200).json({ deposits });
}

export const getMyDeposits = async (req, res) => {
    const { noAccount } = req.body;
    const deposits = await Desposit.find({ noDestinationAccount: noAccount });
    res.status(200).json({ deposits });
}

export const reverseDeposit = async (req, res) => {
    const { idDeposit } = req.body;
    if (pendindDeposit[idDeposit]) {
        const codeBase = 'GT16BAAFGTQ';
        const deposit = await Desposit.findById(idDeposit);
        deposit.status = false;
        await methodDepositCanceled(codeBase, deposit);
        deposit.save();
        clearTimeout(pendindDeposit[idDeposit]);
        delete pendindDeposit[idDeposit];
        return res.status(200).json({ msg: 'The deposit was canceled successfully' });
    }
    res.status(200).json({ msg: 'The deposit was reversed successfully' });
}