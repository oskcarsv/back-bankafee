import { response, request } from "express";
import Product from "./product.model.js";

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

export const productPost = async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    const product = new Product({ name, description, price, category, stock, status: true });

    try {
        await product.save();

        res.status(201).json({
            msg: 'Product created',
            product
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error creating product',
            error: error.message
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