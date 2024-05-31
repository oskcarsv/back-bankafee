import Product from '../products/product.model.js';
import CategoryProduct from '../categoryProduct/categoryProduct.model.js';

export const existsProductById = async (id = '') => {
    const existsProduct = await Product.findById(id);
    if (!existsProduct) {
        throw new Error(`The product with id ${id} does not exist`);
    }
};

export const existsCategoryProductById = async (id) => {
    const existsCategoryProduct = await CategoryProduct.findById(id);
    if (!existsCategoryProduct) {
        throw new Error(`The ID doesn't exist ${id}`);
    }
};
