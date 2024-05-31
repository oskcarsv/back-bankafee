import { request, response } from 'express';
import categoryService from './category-service-model.model.js';

export const createCategoryService = async (req, res) => {
    try {
        const { Name, Description } = req.body;
        const newCategoryService = new categoryService({ Name, Description });

        const cService = await newCategoryService.save();

        res.status(201).json({
            msg: 'Category service created successfully',
            cService,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: Error('Category service not created', error),
        });
    }
};

export const getCategoryService = async (req, res) => {
    try {
        const cService = await categoryService.find({ Status: true });
        const totalCategoryService = cService.length;

        if (totalCategoryService === 0) {
            return res.status(404).json({
                msg: 'There are no category services',
            });
        };

        res.status(200).json({
            totalCategoryService,
            msg: 'Category service listed successfully',
            cService,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: Error('Category service not listed', error),
        });
    }
};

export const getCategoryServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const cService = await categoryService.findById(id);

        res.status(200).json({
            msg: 'Category service listed successfully',
            cService,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: Error('Category service not listed', error),
        });
    }
};

export const updateCategoryService = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Description } = req.body;

        const cService = await categoryService.findById(id);

        if (cService.Name === 'Default') {
            return res.status(400).json({
                msg: 'You cannot update the default category',
            });
        };

        const newCategoryService = {
            Name,
            Description,
        };

        const categoryServiceUpdated = await categoryService.findByIdAndUpdate(id, newCategoryService, { new: true });

        res.status(200).json({
            msg: 'Category service updated successfully',
            categoryServiceUpdated,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: Error('Category service not updated', error),
        });
    }
};

export const deleteCategoryService = async (req, res) => {
    try {
        const { id } = req.params;

        const cService = await categoryService.findById(id);

        if (cService.Name === 'Default') {
            return res.status(400).json({
                msg: 'You cannot delete the default category',
            });
        };

        const categoryServiceDeleted = await categoryService.findByIdAndUpdate(id, { Status: false }, { new: true });

        res.status(200).json({
            msg: 'Category service deleted successfully',
            categoryServiceDeleted,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: Error('Category service not deleted', error),
        });
    }
};