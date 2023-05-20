const mongoose = require("mongoose");

const AllProduct = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
}, { strict: false }, { timestamps: true });


module.exports = mongoose.model('allProduct', AllProduct);