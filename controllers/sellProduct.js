const SellProduct = require("../models/sellProduct");
const AllProduct = require("../models/allProducts");
const { findOneAndUpdate } = require("../models/user");
const nodemailer = require('nodemailer');


// const sellProduct = async (req, res) => {
//   try {
//     let oldSeller = await SellProduct.findOne({ userId: req.body.userId });

//     if (!oldSeller) {
//       let newProduct = new SellProduct();
//       newProduct.userId = req.body.userId;
//       newProduct.products = req.body.state;

//       let product = new AllProduct(req.body.state);
//       console.log("newProduct", newProduct);
//       console.log("product", product);

//       await newProduct.save();
//       await product.save();
//     }

//     oldSeller.products.push(req.body.state);
//     let product = new AllProduct(req.body.state);

//     await oldSeller.save();
//     await product.save();

//     res.send({ message: "new product added" });
//   } catch (error) {
//     res.send(error);
//   }
// };

const sellProduct = async (req, res) => {
  try {
    let product = new AllProduct(req.body.state);
    await product.save();

    // console.log(product._id);

    // console.log(req.body);

    let oldSeller = await SellProduct.findOne({ userId: req.body.userId });

    if (!oldSeller) {
      let newProduct = new SellProduct();
      newProduct.userId = req.body.userId;
      newProduct.products = product._id;

      await newProduct.save();
    }

    oldSeller.products.push(product._id);
    oldSeller.save();

    res.send({ message: "new product added" });
  } catch (error) {
    res.send(error);
  }
};

const updateApprove = async (req, res) => {
  try {

    // console.log(req.body);

    let product = await AllProduct.findOneAndUpdate(
      { _id: req.body.product._id },
      { adminApproved: true, isPending: false },
    );

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'mystudyemail0523@gmail.com',
        pass: 'siznogegcfjnkpxj',
      },
    });


    // Define email options
    // otpSent = otpGenerator();
    // console.log(otpSent)
    const mailOptions = {
      from: 'mystudyemail0523@gmail.com',
      to: req.body.email,
      subject: 'XKART Product Approval',
      html: `<div> ${req.body.message} </div>`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    await product.save();

    res.send({ message: "updated" });
  } catch (error) {
    res.send(error);
  }
};

const updateReject = async (req, res) => {
  try {

    let product = await AllProduct.findOneAndUpdate(
      { _id: req.body.product._id },
      { adminRejected: true, isPending: false }

    );

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'mystudyemail0523@gmail.com',
        pass: 'siznogegcfjnkpxj',
      },
    });


    // Define email options
    // otpSent = otpGenerator();
    // console.log(otpSent)
    const mailOptions = {
      from: 'mystudyemail0523@gmail.com',
      to: req.body.email,
      subject: 'XKART Product Reject',
      html: `<div> ${req.body.message} </div>`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    await product.save();

    res.send({ message: "updated" });
  } catch (error) {
    res.send(error);
  }
};



const getProducts = async (req, res) => {
  try {
    const userId = req.params.userId;
    // console.log(req.params);

    const products = await SellProduct.find({ userId: userId })
      .populate({
        path: 'products',
        model: 'allProduct',
        select: 'category brand'
      })
      .exec();


    // console.log("products", products[0].products);
    res.send(products);


  } catch (error) {
    res.send(error);
  }
}




const updateMarkAsSold = async (req, res) => {
  try {

    // console.log(req.body);

    let product = await AllProduct.findOneAndUpdate(
      { _id: req.body._id },
      {
        markedSold: true
      }
    );

    await product.save();

    res.send({ message: "updated", success: true });
  }
  catch (err) {
    res.json({ message: err.message, success: false });
  }
}



module.exports = { sellProduct, updateApprove, updateReject, getProducts, updateMarkAsSold };

