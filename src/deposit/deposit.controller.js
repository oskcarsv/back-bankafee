import Desposit from "./deposit.model.js";
import Account from "../account/account.model.js";

const pendingDeposit = [];

export const changeAmount = async (noAccount, amount) => {
    const baseCode = "GT16BAAFGTQ";
    const account = await Account.findOne({ noAccount: baseCode + noAccount });
    account.amount += amount;
    await Account.findByIdAndUpdate(account._id, { amount: account.amount });
};

export const methodDeposit = async (objectDeposit) => {
    setTimeout(
        () => (pendingDeposit.map((deposit) => {//mapping the pending deposits
            if (deposit._id == objectDeposit._id) {//checking if the deposit is equal to the object deposit
                switch (deposit.status) {//checking the status of the deposit
                    case 'PROCESSING':
                        //if the status is processing, the amount is added to the account and the status is changed to completed
                        changeAmount(deposit.noDestinationAccount, deposit.amount);
                        deposit.status = 'COMPLETED';
                        break;
                    case 'CANCELED':
                        //if the status is canceled, the status is changed to canceled
                        deposit.status = 'CANCELED';
                        break;
                }
                //saving the deposit and removing it from the pending deposit array
                deposit.save();
                pendingDeposit.splice(pendingDeposit.indexOf(deposit), 1);
            }
        }),
            20000));
};

export const postDeposit = async (req, res) => {
    const { noDestinationAccount, amount } = req.body;
    const dateTime = new Date();
    //creating a new deposit with the data received
    const deposit = new Desposit({ noDestinationAccount, amount, dateTime, status: 'PROCESSING' });
    deposit.save();//saving the deposit
    pendingDeposit.push(deposit);//adding the deposit to the pending deposit array
    methodDeposit(deposit);//calling the method deposit to process the deposit
    res.status(201).json({
        msg: `Deposit created successfully the deposit ID is:${deposit._id}`,
    });
}

export const getDeposits = async (req, res) => {
    const deposits = await Desposit.find();
    res.status(200).json({ deposits });
};

export const getMyDeposits = async (req, res) => {
    const { noAccount } = req.body;
    const deposits = await Desposit.find({ noDestinationAccount: noAccount });
    res.status(200).json({ deposits });
};

export const reverseDeposit = async (req, res) => {
    const { idDeposit } = req.body;
    //checking if there are pending deposits
    if (pendingDeposit.length == 0) {
        res.status(404).json({ msg: 'Not exists pending deposits' });
    } else {
        //if exists pending deposits, the deposit is searched and the status is changed to canceled
        pendingDeposit.map((deposit) => {
            if (deposit._id == idDeposit) {
                deposit.status = 'CANCELED';
                res.status(200).json({ msg: 'Deposit canceled' });
            } else {
                res.status(404).json({ msg: 'Deposit not found' });
            }
        })
    }
}
