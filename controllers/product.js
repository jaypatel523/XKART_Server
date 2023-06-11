const AllProduct = require("../models/allProducts");
const SellProduct = require("../models/sellProduct");

const getAllProducts = async (req, res) => {
  try {
    const products = await AllProduct.find({});
    // console.log(products);
    res.send({ products });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};


const getPaginatedProducts = async (req, res) => {
  try {
    // console.log("HI");
//     console.log(req.query)
    let { pageNumber, limit } = req.query;
    limit = limit || 8;

    let totalProducts = await AllProduct.countDocuments({
      adminApproved: true,
      markedSold: false
    });
    let startIndex = pageNumber * limit;
    let endIndex = (pageNumber + 1) * limit;

    const paginatedProducts = await AllProduct.find({
      adminApproved: true,
      markedSold: false
    }).skip(startIndex).limit(limit).exec()

//     console.log(totalProducts);
    let totalPages = parseInt(Math.ceil(totalProducts / limit));
    res.send({ paginatedProducts, totalPages });
  }
  catch (err) {
    res.send(err);
  }
}


const getProductById = async (req, res) => { };


const getProductCategorywise = async (req, res) => {
  try {
    const products = await AllProduct.find({ category: req.params.category });

    if (!products) {
      throw new Error("invalid category");
    }
    res.send({ products });
  } catch (error) {
    res.send(error);
  }
};

const getProductStatewise = async (req, res) => {
  try {
    let params = req.params;
    params.state = params.state.toUpperCase();
    const products = await AllProduct.find({ state: params.state });
    res.send({ products });
  } catch (error) {
    res.send(error);
  }
};

const getProductCitywise = async (req, res) => {
  try {
    let params = req.params;
    params.city = params.city.toUpperCase();
    const products = await AllProduct.find({ city: params.city });
    res.send({ products });
  } catch (error) {
    res.send(error);
  }
};


const getProductUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // console.log(req.params);

    const products = await SellProduct.find({ userId: userId })
      .populate({
        path: "products",
        model: "allProduct",
        select: "",
      })
      .exec();

    // console.log("products", products[0].products);
    res.send({ products: products[0].products });
  } catch (error) {
    res.send(error);
  }
};


const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    const matchingProducts = await AllProduct.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { state: { $regex: query, $options: 'i' } },
      ],
    });
    res.json(matchingProducts);
  }
  catch (error) {
    res.send(error);
  }
}

module.exports = {
  getAllProducts,
  getProductCategorywise,
  getProductStatewise,
  getProductCitywise,
  getProductUser,
  getProductById,
  searchProducts,
  getPaginatedProducts
};
