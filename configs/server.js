'use strict'

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import bcryptjs from 'bcryptjs'

import apiLimiter from '../src/middlewares/validate-PetitionsLimit.js';

import categoryServiceRoutes from '../src/category-service-model/category-service-model.routes.js'

import { dbConnection } from './mongo.js'

import User from '../src/user/user.model.js'
import Roles from '../src/roles/roles.model.js'
import Status from '../src/status/status.model.js'

import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/user/user.routes.js'
import accountRoutes from '../src/account/account.routes.js'
class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT

        this.categoryServiceRoutesPath = '/bankafee/v1/category-service'
        this.authPath = '/bankafee/v1/auth'
        this.userPath = '/bankafee/v1/user'
        this.accountPath = '/bankafee/v1/account'

        this.middlewares()
        this.connectDB();
        this.defaultCredentials();
        this.routes();

        this.middlewares();
        this.connectDB();
        this.routes();
    }

    middlewares() {
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(apiLimiter)
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(helmet())
        this.app.use(morgan('dev'))
    }

    async connectDB() {

        await dbConnection();

    }

    routes() {
        this.app.use(this.categoryServiceRoutesPath, categoryServiceRoutes)
    }

    async defaultCredentials(){

        const credentialsCreated = await User.findOne({username: 'ADMINB'});

        if(!credentialsCreated){

            // Admin User

            const adminUser = new User({

                name: "ADMINB",
                username: "ADMINB",
                no_Account: 8475293186501732,
                DPI: 9785412580101,
                adress: "Guatemala, Guatemala",
                email: "adminb@gmail.com",
                password: "ADMINB",
                role: "ADMIN_ROLE",
                phoneNumber: "+502 00000000",
                workPlace: "Bankafee",
                monthlyIncome: 10000,
                keyword: "AB126CZF",
                status: "ACTIVE"


            })

            const salt = bcryptjs.genSaltSync();
            adminUser.password = bcryptjs.hashSync(adminUser.password, salt);
            await adminUser.save();

            //Roles

            const USER_ROLE = new Roles({

                rolesName: "USER_ROLE"

            })

            const ADMIN_ROLE = new Roles({

                rolesName: "ADMIN_ROLE"

            })

            await USER_ROLE.save();
            await ADMIN_ROLE.save();

            // User Status

            const ACTIVE = new Status({

                userStatus: "ACTIVE"

            })

            const INACTIVE = new Status({

                userStatus: "INACTIVE"

            })

            const LOCKED = new Status({

                userStatus: "LOCKED"

            })

            const SUSPENDED = new Status({

                userStatus: "SUSPENDED"

            })

            await ACTIVE.save();
            await INACTIVE.save();
            await LOCKED.save();
            await SUSPENDED.save();

            // Client Petition Status

            const IN_PROCESS = new Status({

                clientPetitionStatus: "IN-PROCESS"

            })

            const APPROVED = new Status({

                clientPetitionStatus: "APPROVED"

            })

            const REJECTED = new Status({

                clientPetitionStatus: "REJECTED"

            })

            await IN_PROCESS.save();
            await APPROVED.save();
            await REJECTED.save();

            console.log("Credentials created")

        }else{

            console.log("Credentials already created")

        }

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log('Server is running on port: ', this.port)
        })

    }

    routes(){

        this.app.use(this.authPath, authRoutes)
        this.app.use(this.accountPath,accountRoutes)
        this.app.use(this.userPath, userRoutes)

    }

}

export default Server