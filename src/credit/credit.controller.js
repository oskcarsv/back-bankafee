import User from "../user/user.model";

import Credit from "./credit.model";

import Account from "../account/account.model";

import cron from "node-cron";

cron.schedule("0 * 23 * * *", async () => {
    const dateActual = new Date();
    const creditsEndNow = await Credit.find({
        endCreditDate: {
            $lte: dateActual
        }
    });
    for(let credit of creditsEndNow){
        const accountOwner = await Account.findOne({ noAccount: credit.no_Account_Owner });
        if(accountOwner.amount-credit.creditAmount<0){
            await Account.findOneAndUpdate({ noAccount: credit.no_Account_Owner }, { status: false });
        }else{
            await Account.findOneAndUpdate({ noAccount: credit.no_Account_Owner }, { amount: accountOwner.amount - credit.creditAmount });
        }
    }
});

export const maxCredit = async (time, dpi) => {

    const calculate = async (req, res) => {

        const userAccount = await User.findOne({ DPI: dpi });

        const maxAmount = userAccount.monthlyIncome * time;

        return maxAmount;

    }

}

export const generateCreditPetition = async (req, res) => {

    const { no_Account, creditAmount, creditTime, reazon } = req.body;

    const time = creditTime.toLowerCase();

    if (time.includes("3") || time.includes("three")) {

        creditTime = "3 months";

    } else if (time.includes("6") || time.includes("six")) {

        creditTime = "6 months";

    } else if (time.includes("12") || time.includes("twelve")) {

        creditTime = "12 months";

    } else {
        res.status(400).json({
            msg: "Invalid Credit Time"
        })
    }

    if (req.user.role != "ADMIN_ROLE") {

        const credit = new Credit({

            nameOwner: req.user.name,
            DPIOwner: req.user.DPI,
            no_Account_Owner: no_Account,
            creditAmount: creditAmount,
            creditTime: creditTime,
            reazon: reazon,
            status: "IN-PROCESS"

        })

        await credit.save();

        res.status(200).json({

            msg: `${req.user.name} your Petition for a credi is in process, please wait to be approved.`

        })

    } else {

        const accountOwner = await Account.findOne({ noAccount: no_Account });

        const userOwner = await User.findOne({ DPI: accountOwner.DPI_Owner });

        const credit = new Credit({

            nameOwner: userOwner.name,
            DPIOwner: userOwner.DPI,
            no_Account_Owner: no_Account,
            creditAmount: creditAmount,
            creditTime: creditTime,
            reazon: reazon,
            status: "APPROVED"

        });
        const updateAccount = await Account.findOneAndUpdate({ noAccount: no_Account }
            , { amount: accountOwner.amount + creditAmount });

        if (creditTime == "3 months") {
            credit.endCreditDate = new Date(`
                ${credit.startCreditDate.getFullYear()}
                /${credit.startCreditDate.getMonth() + 3}
                /${credit.startCreditDate.getDate()}`);
                
        } else if (creditTime == "6 months") {
            credit.endCreditDate = new Date(`
                ${credit.startCreditDate.getFullYear()}
                /${credit.startCreditDate.getMonth() + 6}
                /${credit.startCreditDate.getDate()}`);
        } else if (creditTime == "12 months") {
            credit.endCreditDate = new Date(`
                ${credit.startCreditDate.getFullYear()}
                /${credit.startCreditDate.getMonth() + 12}
                /${credit.startCreditDate.getDate()}`);
        }
        await credit.save();
        /*
            Aca necesito que empiece a hacer la promesa dependiendo del tiempo que trajo.
            Nota: Lo que podes hacer es un .includes del creditTime en un if donde si trae un 3 months tu tiempo sea 3 meses y así con los demas;
            Cuando termine el tiempo de la promesa lo que debe de hacer es un if donde si se le quita el credito y su saldo es menor a 0 osea negativo
            entonces la cuente se le bloque y ponerle un mensaje tipo "Para reactivar su cuenta pague el credito en una banca fisica." y si en caso el
            sueldo en el if es mayor o igual a entonces que se le quite a la cuenta el credito que se le dio.
        */
        
    }

}