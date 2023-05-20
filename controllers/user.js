const User = require("../models/user");
const jwttoken = require("jsonwebtoken");
const { expressjwt: jwt } = require("express-jwt");
const Admin = require("../models/admin");


const nodemailer = require('nodemailer');
let otpSent = "";



const otpGenerator = () => {
  const numbers = '0123456789';

  let otp = "";

  for (let i = 0; i < 6; i++) {
    otp += numbers[Math.floor(Math.random() * 10)];
  }

  return otp;

}


const sendmail = (email) => {

  // sending mail 
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
  otpSent = otpGenerator();
  console.log(email);
  console.log(otpSent);
  // console.log(otp)
  const mailOptions = {
    from: 'mystudyemail0523@gmail.com',
    to: email,
    subject: 'OTP',
    html: `<div> Your otp is : <h1>` + otpSent + `</h1> </div>`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
}


const generateOTP = async (req, res) => {
  try {

    console.log(req.body);

    const dbemail = await User.findOne({ email: req.body.email });
    if (dbemail) {
      throw new Error("Email Address already exists")
    }

    // console.log("dbemail", dbemail);

    // sendmail(req.body.email)
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
    otpSent = otpGenerator();
    console.log(otpSent)
    const mailOptions = {
      from: 'mystudyemail0523@gmail.com',
      to: req.body.email,
      subject: 'OTP',
      html: `<div> Your otp is : <h1>` + otpSent + `</h1> </div>`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    res.json({ message: "OTP has been sent to you", success: true });

  } catch (err) {
    res.json({ message: err.message, success: false })
  }
}




const register = async (req, res) => {

  try {

    const user = new User(req.body);

    if (req.body.OTP !== otpSent) {
      throw new Error("Invalid OTP")
    }

    await user.save()
    res.status(200).json({ message: "Successfully Registered!", user, success: true })
  } catch (err) {
    res.json({ message: err.message, success: false })

  }
};


const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User not found");

    if (!user.authenticate(req.body.password)) {
      throw new Error("Email and password don't match");
    }


    const token = jwttoken.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      maxAge: 86400000,
    });

    res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email },
      message: "Successfully logged in!",
      success: true
    });
  } catch (err) {
    res.json({ message: err.message, success: false });
  }
};


const adminLogin = async (req, res) => {
  try {
    let user = await Admin.findOne({ email: req.body.email });
    if (!user) throw new Error("User not found");

    if (!user.authenticate(req.body.password)) {
      throw new Error("Email and password don't match");
    }


    const token = jwttoken.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      maxAge: 86400000,
    });

    res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email },
      message: "Successfully logged in!",
      success: true
    });
  } catch (err) {
    res.json({ message: err.message, success: false });
  }
};


const loginWithGoogle = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    // console.log(user);
    // console.log(req.body);
    if (!user) throw new Error("User not found");




    const token = jwttoken.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      maxAge: 86400000,
    });

    res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email },
      message: "Successfully logged in!",
      success: true
    });
  } catch (err) {
    res.json({ message: err.message, success: false })
  }
}



const registerWithGoogle = async (req, res) => {

  try {
    const dbemail = await User.findOne({ email: req.body.email });
    if (dbemail) {
      throw new Error("Email Address already exists")
    }
    const user = new User(req.body);

    await user.save()
    res.status(200).json({ message: "Successfully Registered!", user, success: true })

  }
  catch (err) {
    res.json({ message: err.message, success: false })
  }


}




const logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .status(200)
    .send({ message: "logged out!" });
};

const getUserDetails = async (req, res) => {

  try {

    const user = await User.findOne({ _id: req.params.userId });
    const admin = await Admin.findOne({ _id: req.params.userId });

    if (user) {
      return res.json({ user: user, success: true });
    }
    else {
      return res.json({ user: admin, success: true });
    }

  } catch (error) {
    res.json({ message: error.message, success: false });
  }

};


const getUser = async (req, res) => {
  try {
    // console.log(req.body, "hi");
    const user = await User.findOne({ email: req.body.data });
    res.json({ user, success: true });
  }
  catch (err) {
    res.json({ message: err.message, success: false });
  }
}


const requireSignin = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  next();
};

module.exports = {
  login,
  logout,
  register,
  hasAuthorization,
  getUserDetails,
  adminLogin,
  loginWithGoogle,
  requireSignin,
  registerWithGoogle,
  generateOTP,
  getUser
};
