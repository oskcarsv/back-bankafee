import { Router } from "express";
import { check } from "express-validator";

import { validateFields } from "../middlewares/validate-fields.js";
import { createService, getServiceById, getServices, getServicesByCategory, getServicesByCompany, updateService } from "./service-model.controller.js";



const router = Router();

router.post(
    '/createService',
    [
        validateFields,
    ],
    createService
);

router.get(
    '/getServices',
    getServices
);

router.get(
    '/getServiceByCategory/:id',
    getServicesByCategory
);

router.get(
    '/getServiceByCompany/:company',
    getServicesByCompany
);

router.get(
    '/getServiceById/:id',
    getServiceById  
);

router.put(
    '/updateService/:id',
    [
        validateFields,
    ],
    updateService
);

export default router;