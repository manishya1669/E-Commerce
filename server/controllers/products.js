const User = require("../models/user");
const product = require("../models/product");

const findAllProducts = async (req, res) => {
  const { brand, model, price, discount, stock, sort } = req.body;
  const searchPara = {};
  console.log(req.body)
  if (brand) {
    const brandRegex = /\b[A-Za-z]+\b/;
    const match = brand.match(brandRegex);
    if (match) {
      searchPara.brand = match[0];
    }
  }
  if (model) {
    const modelRegex = /\b[\w\s]+\b/;
    const match = model.match(modelRegex);
    if (match) {
      searchPara.model = match[0];
    }
  }
  if (price) {
    const priceRegex = /\d+(\.\d{1,2})?/;
    const match = price.match(priceRegex);
    if (match) {
      searchPara.price = parseFloat(match[0]);
    }
  }
  if (discount) {
    const discountRegex = /\d{1,2}%/;
    const match = discount.match(discountRegex);
    if (match) {
      searchPara.discount = parseInt(match[0]);
    }
  }
  if (stock) {
    searchPara.stock = stock === "notAvailable" ? notAvailable : available;
  }

  let allProducts = product.find(searchPara);

  if (sort) {
    const sortBy = sort.split(",").join(" ");
    allProducts = allProducts.sort(sortBy);
  } else {
    allProducts = allProducts.sort("createdAt");
  }

  const products = await allProducts;

  // console.log(products);

  res.json({ products });
};

const addToCart = async (req, res) => {

  const { productId, size } = req.body;
  console.log(productId, size)

  const user = await User.findOneAndUpdate(
    { _id: req.session.userID },
    { $push: { cart: { pid: productId, psize: size } } },
    { new: true }
  );

  if (!user) {
    res.status(500).json({ success: false, message: "Unable to add product to cart" });
  } else {
    res.status(200).json({ success: true, message: "Product added to cart" });
  }
};

module.exports = {
  findAllProducts,
  addToCart,
};
