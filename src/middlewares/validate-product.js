import Product from "../products/product.model.js";

export const existsProductByName = async (req, res, next) => {
  const { name } = req.body;

  const existsProduct = await Product.findOne({ name });

  if (existsProduct) {
    return res.status(400).json({
      msg: `The name ${name} already exists`,
    });
  }
  next();
};
