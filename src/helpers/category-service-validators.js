import Category_Service from '../category-service-model/category-service-model.model.js';

export const existsCategoryName = async (Name = '') => {
    const existsCategory = await Category_Service.findOne({ Name });
    if (existsCategory) {
        throw new Error(`The category '${Name}' already exists`);
    }
};

export const nonExistentCategoryService = async (id) => {
    const category = await Category_Service.findById(id);
    if (!category) {
        throw new Error(`The category with id '${id}' does not exist`);
    }
}

export const nonExistentCategoryServiceStatus = async (id) => {
    const category = await Category_Service.findById(id);
    if (!category.Status) {
        throw new Error(`The category with id '${id}' is disabled`);
    }
}