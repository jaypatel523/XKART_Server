const WishListProduct = require("../models/wishlist");

const addToWishList = async (req, res) => {
  try {

    const userId = req.body.userId;

    const productId = req.body.productId;

    let wishlistedProd = await WishListProduct.findOne({ userId: userId });


    if (!wishlistedProd) {
      let addToWishList = new WishListProduct({
        userId: userId,

        wishlist: [productId]
      });



      await addToWishList.save();
      return res.send({ message: "Product added to wishlist", success: true });

    }



    wishlistedProd.wishlist.push(productId);


    await wishlistedProd.save();
    res.json({ message: "Product added to wishlist", success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

const deleteFromWishlist = async (req, res) => {
  try {
    // console.log(req.params);
    const { userId, productId } = req.params;
    const deleted = await WishListProduct.findOneAndUpdate(
      { userId: userId },
      { $pull: { wishlist: productId } },
      { safe: true }
    ).clone();


    if (!deleted) {
      throw new Error("Something went wront")
    }
    res.json({ message: "deleted from wishlist", success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};



const isProductWishlisted = async (req, res) => {
  try {

    // console.log(req.params);

    const { userId, productId } = req.params;
    const product = await WishListProduct.findOne({ userId, wishlist: [productId] });

    // console.log("product", product);
    if (!product) {
      return res.send({ isWishlisted: false })
    }
    res.send({ isWishlisted: true })


  } catch (error) {
    res.send(error);
  }
}


const getAllWishlist = async (req, res) => {
  try {
    // console.log(req.params);
    const products = await WishListProduct.find({ userId: req.params.userId }).populate({
      path: 'wishlist',
      model: 'allProduct',
    }).exec();

    if (products.length == 0) {
      throw new Error("Wishlist is empty");
    }

    // console.log(products[0].wishlist)

    res.json({ products: products[0].wishlist, success: true })

  } catch (error) {
    res.json({ message: error.message, success: false })
  }
};


module.exports = { addToWishList, deleteFromWishlist, getAllWishlist, isProductWishlisted };
