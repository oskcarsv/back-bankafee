"use strict";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import apiLimiter from "../src/middlewares/validate-PetitionsLimit.js";

import { initialCredentials } from "./credentials.js";
import { dbConnection } from "./mongo.js";

import User from "../src/user/user.model.js";

import accountRoutes from "../src/account/account.routes.js";
import authRoutes from "../src/auth/auth.routes.js";
import categoryServiceRoutes from "../src/category-service-model/category-service-model.routes.js";
import categoryProductsRoutes from "../src/categoryProduct/categoryProduct.routes.js";
import productsRoutes from "../src/products/product.routes.js";
import serviceRoutes from "../src/service-model/service-model.routes.js";
import transferRoutes from "../src/transfer/transfer.routes.js";
import userRoutes from "../src/user/user.routes.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.productsPath = "/bankafee/v1/products";
    this.categoryProductsPath = "/bankafee/v1/categoryProduct";

    this.categoryServiceRoutesPath = "/bankafee/v1/category-service";
    this.serviceRoutesPath = "/bankafee/v1/service";
    this.authPath = "/bankafee/v1/auth";
    this.userPath = "/bankafee/v1/user";
    this.accountPath = "/bankafee/v1/account";
    this.transferPath = "/bankafee/v1/transfer";

    this.middlewares();
    this.connectDB();
    this.defaultCredentials();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(apiLimiter);
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  async connectDB() {
    await dbConnection();
  }

  async defaultCredentials() {
    const credentialsCreated = await User.findOne({ username: "ADMINB" });

    if (!credentialsCreated) {

      initialCredentials();

    } else {
      console.log("Credentials already created");
    }
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server is running on port: ", this.port);
    });
  }

  routes() {
    this.app.use(this.authPath, authRoutes);
    this.app.use(this.accountPath, accountRoutes);
    this.app.use(this.userPath, userRoutes);
    this.app.use(this.transferPath, transferRoutes);

    this.app.use(this.categoryServiceRoutesPath, categoryServiceRoutes);
    this.app.use(this.serviceRoutesPath, serviceRoutes);

    this.app.use(this.productsPath, productsRoutes);
    this.app.use(this.categoryProductsPath, categoryProductsRoutes);
  }
}

export default Server;
