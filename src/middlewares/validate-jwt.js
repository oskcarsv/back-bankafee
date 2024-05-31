import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';

export const validateJWT = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({
            msg: "There is no token in the request",
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETPRIVATEKEY);

        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'User does not exist in the database'
            });
        }

        if (user.state === 'INACTIVE') {
            return res.status(401).json({
                msg: 'Token is not valid - user with state: INACTIVE'
            });
        }

        if (user.state === 'LOCKED') {
            return res.status(401).json({
                msg: 'Token is not valid - user with state: LOCKED'
            });
        }

        if (user.state === 'SUSPENDED') {
            return res.status(401).json({
                msg: 'Token is not valid - user with state: SUSPENDED'
            });
        }

        req.user = user;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token is not valid",
        });
    }
}