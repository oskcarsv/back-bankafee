'use strict'

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import apiLimiter from '../src/middlewares/validate-PetitionsLimit.js';

import categoryServiceRoutes from '../src/category-service-model/category-service-model.routes.js'

import { dbConnection } from './mongo.js'

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT

        this.categoryServiceRoutesPath = '/bankafee/v1/category-service'

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


    listen() {

        this.app.listen(this.port, () => {
            console.log('Server is running on port: ', this.port)
        })

    }

}

export default Server