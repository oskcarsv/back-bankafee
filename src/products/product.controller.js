import { response, request } from "express";
import { existsProductByName } from "../helpers/db-validator.js";
import Product from "./product.model.js";

export const productPost = async (req, res) => {
  const { name, description, price, category, stock, img } = req.body;

  try {
    await existsProductByName(name);
  } catch (err) {
    return res.status(400).json({
      msg: "A product with this name already exists",
    });
  }

  // mira si el stock es menor a 0
  if (stock < 0) {
    return res.status(400).json({
      msg: "Stock cannot be less than zero",
    });
  }

  const newProduct = new Product({
    name,
    description,
    price,
    category,
    stock,
    img,
    status: true,
  });

  await newProduct.save();

  return res.status(200).json({
    msg: "Publication has been created",
    publication: newProduct,
  });

}

export const productGet = async (req = request, res = response) => {
  const { limit, from } = req.query;
  const query = { status: true };

  try {
    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    res.status(200).json({
      total,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error, the products could not be obtained",
    });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id });

    res.status(200).json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching product",
      error: error.message,
    });
  }
};

export const getProductByName = async (req, res) => {
  const { name } = req.params;

  try {
    const product = await Product.find({ name: { $regex: name, $options: 'i' } }).populate({path: 'category', select: 'name'});

    res.status(200).json({
      product,
    });
  }
  catch (error) {
    res.status(500).json({
      msg: "Error fetching product",
      error: error.message,
    });
  }

};

export const productDelete = async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndUpdate(id, { status: false });
    res.status(200).json({
      msg: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error deleting product",
      error: error.message,
    });
  }
};
