import { request, response } from 'express';
import Category_Service from './category-service-model.model.js';

export const createCategoryService = async (req, res) => {
    try {
        const { Name, Description } = req.body;
        const newCategoryService = new Category_Service({ Name, Description });

        const categoryService = await newCategoryService.save();

        res.status(201).json({
            msg: 'Category Service created successfully',
            categoryService,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: Error('Category Service not created', error),
        });
    }
};

export const getCategoryService = async (req, res) => {
    try {
        const categoryService = await Category_Service.find({ Status: true });
        const totalCategoryService = categoryService.length;

        if (totalCategoryService === 0) {
            return res.status(404).json({
                msg: 'There are no Category Services',
            });
        };

        res.status(200).json({
            totalCategoryService,
            msg: 'Category Service listed successfully',
            categoryService,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: Error('Category Service not listed', error),
        });
    }
};

export const getCategoryServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryService = await Category_Service.findById(id);

        res.status(200).json({
            msg: 'Category Service listed successfully',
            categoryService,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: Error('Category Service not listed', error),
        });
    }
};

export const updateCategoryService = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Description } = req.body;

        const categoryService = await Category_Service.findById(id);

        if (categoryService.Name === 'Default') {
            return res.status(400).json({
                msg: 'You cannot update the default category',
            });
        };

        const newCategoryService = {
            Name,
            Description,
        };

        const categoryServiceUpdated = await Category_Service.findByIdAndUpdate(id, newCategoryService, { new: true });

        res.status(200).json({
            msg: 'Category Service updated successfully',
            categoryServiceUpdated,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: Error('Category Service not updated', error),
        });
    }
};

export const deleteCategoryService = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryService = await Category_Service.findById(id);

        if (categoryService.Name === 'Default') {
            return res.status(400).json({
                msg: 'You cannot delete the default category',
            });
        };

        const categoryServiceDeleted = await Category_Service.findByIdAndUpdate(id, { Status: false }, { new: true });

        res.status(200).json({
            msg: 'Category Service deleted successfully',
            categoryServiceDeleted,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: Error('Category Service not deleted', error),
        });
    }
};