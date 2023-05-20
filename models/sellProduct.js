const mongoose = require("mongoose");

const SellProduct = new mongoose.Schema({

  userId: {
    type: String,
    ref: 'User',
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "allProduct" }]

});


module.exports = mongoose.model('sell', SellProduct);