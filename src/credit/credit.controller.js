import User from "../user/user.model.js";

import Credit from "./credit.model.js";

import Account from "../account/account.model.js";

import cron from "node-cron";

//cambiar el 23 por * para que se ejecute en el segundo 59 de cada minuto
cron.schedule("59 * 23 * * *", async () => {
    const dateActual = new Date();
    const creditsEndNow = await Credit.find({
        endCreditDate: {
            $lte: dateActual
        },
        status: "APPROVED"
    });

    for (let credit of creditsEndNow) {
        const accountOwner = await Account.findOne({ noAccount: 'GT16BAAFGTQ'+credit.no_Account_Owner });
        console.log(accountOwner);
        if (accountOwner.amount - credit.creditAmount < 0) {
            await Account.findOneAndUpdate({ noAccount: 'GT16BAAFGTQ'+credit.no_Account_Owner }, { status: false });
        } else {
            await Account.findOneAndUpdate({ noAccount: 'GT16BAAFGTQ'+credit.no_Account_Owner }, { amount: accountOwner.amount - credit.creditAmount });
        }
        await Credit.findByIdAndUpdate(credit._id, { status: "PAID" });
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

    let time = creditTime.toLowerCase();

    if (time.includes("3") || time.includes("three")) {

        time = "3 months";

    } else if (time.includes("6") || time.includes("six")) {

        time = "6 months";

    } else if (time.includes("12") || time.includes("twelve")) {

        time = "12 months";

    } else {
        res.status(400).json({
            msg: "Invalid Credit Time"
        })
    }

    if (req.user.role != "ADMIN_ROLE") {

        const credit = new Credit({

            nameOwner: req.user.name,
            DPIOwner: req.user.DPI,
            no_Account_Owner:'GT16BAAFGTQ'+ no_Account,
            creditAmount: creditAmount,
            creditTime: time,
            reazon: reazon,
            status: "IN-PROCESS"

        })

        await credit.save();

        res.status(200).json({

            msg: `${req.user.name} your Petition for a credi is in process, please wait to be approved.`

        })

    } else {
        const accountOwner = await Account.findOne({ noAccount: `${'GT16BAAFGTQ' + no_Account}` });

        const userOwner = await User.findOne({ DPI: accountOwner.DPI_Owner });

        const credit = new Credit({

            nameOwner: userOwner.name,
            DPIOwner: userOwner.DPI,
            no_Account_Owner: 'GT16BAAFGTQ'+ no_Account,
            creditAmount: creditAmount,
            creditTime: time,
            reazon: reazon,
            status: "APPROVED"

        });

        const actualDate = new Date();
        credit.startCreditDate = actualDate;
        let endDate = null;
        if (time == "3 months") {
            if (actualDate.getMonth() + 3 > 12) {
                endDate = new Date(`
                    ${actualDate.getFullYear() + 1}
                    /${actualDate.getMonth() + 3 - 12 + 1}
                    /${actualDate.getDate()}`);
            } else {
                endDate = new Date(`
                        ${actualDate.getFullYear()}
                        /${actualDate.getMonth() + 3 + 1}
                        /${actualDate.getDate()}`);
            }
        } else if (time == "6 months") {
            if (actualDate.getMonth() + 6 > 12) {
                endDate = new Date(`
                    ${actualDate.getFullYear() + 1}
                    /${actualDate.getMonth() + 6 - 12 + 1}
                    /${actualDate.getDate()}`);
            } else {
                endDate = new Date(`
                    ${actualDate.getFullYear()}
                    /${actualDate.getMonth() + 6}
                    /${actualDate.getDate()}`);
            }
        } else if (time == "12 months") {
            if (actualDate.getMonth() + 12 > 12) {
                endDate = new Date(`
                    ${actualDate.getFullYear() + 1}
                    /${actualDate.getMonth() + 12 - 12 + 1}
                    /${actualDate.getDate()}`);
            } else {
                endDate = new Date(`
                    ${actualDate.getFullYear()}
                    /${actualDate.getMonth() + 12 + 1}
                    /${actualDate.getDate()}`);
            }
        }
        credit.endCreditDate = endDate;
        await credit.save();

        await Account.findOneAndUpdate({ noAccount: no_Account }
            , { amount: accountOwner.amount + creditAmount });

        res.status(200).json({
            msg: `The credit for ${userOwner.name} has been approved`
        });
        /*
            Aca necesito que empiece a hacer la promesa dependiendo del tiempo que trajo.
            Nota: Lo que podes hacer es un .includes del creditTime en un if donde si trae un 3 months tu tiempo sea 3 meses y así con los demas;
            Cuando termine el tiempo de la promesa lo que debe de hacer es un if donde si se le quita el credito y su saldo es menor a 0 osea negativo
            entonces la cuente se le bloque y ponerle un mensaje tipo "Para reactivar su cuenta pague el credito en una banca fisica." y si en caso el
            sueldo en el if es mayor o igual a entonces que se le quite a la cuenta el credito que se le dio.
        */
    }
}

export const getCreditPetitions = async (req, res) => {

    const {limit, from} = req.query;

    let { stateCredit } = req.body;

    if (stateCredit == "" || stateCredit == undefined) {

        stateCredit = "IN-PROCESS";

    }

    const query = {status : stateCredit};

    const [total, credit] = await Promise.all([

        Credit.countDocuments(query),
        Credit.find(query)
              .skip(Number(from))
              .limit(Number(limit))
    ]);

    res.status(200).json({

        msg: `The Petitions ${total} that have the status ${stateCredit} are:`,
        credit

    })

}