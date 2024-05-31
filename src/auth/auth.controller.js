import User from '../user/user.model.js'

import { generateJWT } from '../helpers/generate-jwt.js'

import bcryptjs from 'bcryptjs'

export const login = async (req, res) =>{

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({
            msg: "Wrong Credentials, Username doesn't exists in database",
        });
    }

    if (user.state == 'INACTIVE') {
        return res.status(400).json({
            msg: "The User doesn't exists in database",
        });
    }

    if (user.state == 'LOCKED') {
        return res.status(400).json({
            msg: "The User has been locked, contact your administrator",
        });
    }

    if (user.state == 'SUSPENDED') {
        return res.status(400).json({
            msg: "The User has been suspended, contact your administrator",
        });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
        return res.status(400).json({
            msg: "Wrong Password",
        });
    }

    const token = await generateJWT( user.id);

        res.status(200).json({
        msg: 'Login Successful',
        user,
        token

    });

}

