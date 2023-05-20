const mongoose = require("mongoose");

const WishListProduct = new mongoose.Schema({

  userId: {
    type: String,
    ref: 'User',
  },
  // products: [],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "allProduct" }]
});

module.exports = mongoose.model("wishlist", WishListProduct);
