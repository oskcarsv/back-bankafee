import User from "../models/user.js";

import {maxCredit} from "../credit/credit.controller.js";

export const validationSalary = async (req, res, next) => {

    const { no_Account, creditAmount} = req.body;
    
    const accountOwner = await Account.findOne({ noAccount: no_Account });

    const userOwner = await User.findOne({ DPI: accountOwner.DPI_Owner });

    const time = creditTime.toLowerCase();

    if (time.includes("3") || time.includes("three")) {

        time = 3;
        
    }
    
    if (time.includes("6") || time.includes("six")) {

        time = 6;

    }
    
    if (time.includes("12") || time.includes("twelve")) {

        time = 12;

    }

    const maxAmount = maxCredit(time, userOwner.DPI);

    if(creditAmount > maxAmount) {

        return res.status(400).json({

            msg: "With your Actual Salary you can't make this credit"
        
        });

    }


    next();
    
  };