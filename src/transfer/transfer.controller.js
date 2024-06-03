import User from '../user/user.model.js';
import Account from '../account/account.model.js';
import Transfer from './transfer.model.js';

let pendingTransfers = {};

export const changeAmount = async (noOwnerAccount,noDestinationAccount,amount) => {
    const baseCode='GT16BAAFGTQ';
    const accountOwner = await Account.findOne({noAccount:baseCode+noOwnerAccount});
    const accountDestination = await Account.findOne({noAccount:baseCode+noDestinationAccount});
    accountOwner.amount = accountOwner.amount - amount;
    accountDestination.amount = accountDestination.amount + amount;
    await Account.findByIdAndUpdate(accountOwner._id,{amount:accountOwner.amount});
    await Account.findByIdAndUpdate(accountDestination._id,{amount:accountDestination.amount});
}

let methodTransferCompleted = (objectTransfer) => {
    objectTransfer.status = 'COMPLETED';
    objectTransfer.save();
    delete pendingTransfers[objectTransfer.noOwnerAccount];
    changeAmount(objectTransfer.noOwnerAccount,objectTransfer.noDestinationAccount,objectTransfer.amount);
};

export const postTransfer = async (req, res) => {
    const { noOwnerAccount, noDestinationAccount, DPI_DestinationAccount, amount, description, canceled } = req.body;
    const dateTime=new Date();

    const objectTransfer = new Transfer({ noOwnerAccount, noDestinationAccount, DPI_DestinationAccount, amount, description, dateTime, status: 'PROCESSING' });

    if (canceled) {
        if (pendingTransfers[noOwnerAccount]) {
            clearTimeout(pendingTransfers[noOwnerAccount]);
            objectTransfer.status = 'CANCELED';
            await objectTransfer.save();
            delete pendingTransfers[noOwnerAccount];
            return res.status(200).json({ msg: 'Transfer canceled successfully'});
        } else {
            return res.status(400).json({ msg: 'No pending transfer found to cancel' });
        }
    } else {
        pendingTransfers[noOwnerAccount] = setTimeout(() => methodTransferCompleted(objectTransfer), 8000);
    }
    return res.status(200).json({ msg: 'Transfer in process' });
};