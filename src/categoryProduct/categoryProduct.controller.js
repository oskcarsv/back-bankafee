import { response, request } from "express";
import CategoryProduct from "./categoryProduct.model.js";
import Product from "../products/product.model.js";

// Función para inicializar la categoría "default"
const createDefaultCategory = async () => {
  const defaultCategory = await CategoryProduct.findOne({ isDefault: true });

  if (!defaultCategory) {
    const categoryProduct = new CategoryProduct({
      name: "Default",
      description: "Default category",
      status: false,
      isDefault: true,
    });
    await categoryProduct.save();
  }
};

createDefaultCategory();

export const categoryProductGet = async (req = request, res = response) => {
  const { limit, from } = req.query;
  const query = { status: true };

  try {
    const [total, categoryProducts] = await Promise.all([
      CategoryProduct.countDocuments(query),
      CategoryProduct.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    // Obtener los productos asociados a cada categoría
    const categoriesWithProducts = await Promise.all(
      categoryProducts.map(async (category) => {
        const products = await Product.find({ category: category._id });
        return { ...category.toObject(), products };
      }),
    );

    res.status(200).json({
      total,

      categoryProducts: categoriesWithProducts,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error, the category products could not be obtained",
    });
  }
};


export const categoryProductPost = async (req, res) => {
  const { name, description, img } = req.body;

  try {
    const categoryProduct = new CategoryProduct({ name, description, img });
    await categoryProduct.save();

    res.status(201).json({
      msg: "Category Product created",
      categoryProduct,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error creating category product",
      error: error.message,
    });
  }

};


export const getCategoryProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryProduct = await CategoryProduct.findById(id).lean();

    if (!categoryProduct) {
      return res.status(404).json({
        msg: "Category Product not found",
      });
    }

    // Obtener los productos asociados a la categoría
    const products = await Product.find({ category: id });

    res.status(200).json({
      categoryProduct,
      products,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching category product",
      error: error.message,
    });
  }
};

export const categoryProductPut = async (req, res) => {
  const { id } = req.params;
  const { _id, status, ...rest } = req.body;

  try {
    await CategoryProduct.findByIdAndUpdate(id, rest);
    const categoryProduct = await CategoryProduct.findById(id);

    res.status(200).json({
      msg: "Category Product updated",
      categoryProduct,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error updating category product",
      error: error.message,
    });
  }
};

export const categoryProductDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryProduct = await CategoryProduct.findById(id);

    if (!categoryProduct) {
      return res.status(404).json({
        msg: "Category Product not found",
      });
    }

    if (categoryProduct.isDefault) {
      return res.status(400).json({
        msg: "Cannot delete default category",
      });
    }

    await CategoryProduct.findByIdAndUpdate(id, { status: false });

    // Reasignar productos a la categoría "Default"
    const defaultCategory = await CategoryProduct.findOne({ isDefault: true });
    await Product.updateMany(
      { category: id },
      { category: defaultCategory._id },
    );

    res.status(200).json({
      msg: "Category Product deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error deleting category product",
      error: error.message,
    });
  }
};
