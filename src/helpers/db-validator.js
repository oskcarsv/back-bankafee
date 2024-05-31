import Product from '../products/product.model.js';

export const existsProductById = async (id = '') => {
    const existsProduct = await Product.findById(id);
    if (!existsProduct) {
        throw new Error(`The product with id ${id} does not exist`);
    }
};