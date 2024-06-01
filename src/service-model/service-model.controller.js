import serviceModel from '../service-model/service-model.model.js';
import upload from '../middlewares/multerConfig.js';
import { tittleExists } from '../helpers/service-validators.js';

export const createService = async (req, res) => {
    upload.single('img')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({
                msg: 'Error uploading image',
                errors: err.message
            });
        }
        try {
            const { tittle, description, company, discount, category } = req.body;

            const discountCode = Math.random().toString(36).substring(2, 12);

            await tittleExists(tittle);

            const newService = new serviceModel({
                tittle,
                description,
                company,
                discount,
                category,
                discountCode,
                img: req.file.path
            });

            await newService.save();

            res.status(201).json({
                msg: 'Service created successfully',
                service: newService
            });
        } catch (error) {
            return res.status(500).json({
                msg: 'Error creating service',
                errors: error.message
            });
        }
    });
};