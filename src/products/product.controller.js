import { response, request } from "express";
import { existsProductByName } from "../helpers/db-validator.js";
import Product from "./product.model.js";
import upload from "../middlewares/multerConfig.js";

export const productImg = async (req, res) => {
    upload.single('img')(req, res, async (err) => {
        if (err) {
            console.log(req.file);
            return res.status(500).json({
                msg: "Image has not been uploaded",
                errors: err.message,
            });
        }
        try {
            const { name, description, price, category, stock } = req.body;

            try {
                await existsProductByName(name);
            } catch (err) {
                return res.status(400).json({
                    msg: "A product with this name already exists"
                });
            }

            // mira si el stock es menor a 0
            if (stock < 0) {
                return res.status(400).json({
                    msg: "Stock cannot be less than zero"
                });
            }

            

            const newProduct = new Product({
                name, 
                description, 
                price, 
                category, 
                stock, 
                img: req.file.path, 
                status: true,
            });

            await newProduct.save();

            return res.status(200).json({
                msg: "Publication has been created",
                publication: newProduct,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({

                msg: "Publication has not been created",
                errors: error,
            });
        }
    });
}


export const productGet = async (req = request, res = response) => {
    const { limit, from } = req.query;
    const query = { status: true };

    try {
        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .skip(Number(from))
                .limit(Number(limit))
        ]);

        res.status(200).json({
            total,
            products
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error, the products could not be obtained'
        });
    }
};

export const getProductById = async (req, res) => {

    const { id } = req.params;
    try {
        const product = await Product.findOne({ _id: id });

        res.status(200).json({
            product
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error fetching product',
            error: error.message
        });
    }
};

export const productPut = async (req, res) => {
    upload.single('img')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({
                msg: "Image has not been uploaded",
                errors: err.message,
            });
        }
        const { id } = req.params;
        const { _id, state, ...rest } = req.body;

        try {
            await Product.findByIdAndUpdate(id, rest);
            const product = await Product.findOne({ _id: id });

            res.status(200).json({
                msg: 'Product successfully updated',
                product
            });
        } catch (error) {
            res.status(500).json({
                msg: 'Error updating Product',
                error: error.message
            });
        }
    })
};

export const productDelete = async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndUpdate(id, { status: false });
        res.status(200).json({
            msg: 'Product deleted'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error deleting product',
            error: error.message
        });
    }
};