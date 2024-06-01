import jwt from 'jsonwebtoken';

export const generateJWT = (uid = '') =>{

    return new Promise((resolve, reject) => {

        const payload = {uid};

        jwt.sign(

            payload,
            process.env.SECRETPRIVATEKEY,
            {
                expiresIn: '3h'
            },
            (err, token) =>{

                err ? (console.log(err), reject('Token could not be generated')) : resolve(token);

            }

        )

    })

}