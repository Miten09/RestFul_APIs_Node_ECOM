const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const create_Token = async (id) => {
  try {
    const token = jwt.sign({ _id: id }, config.secret_jwt);
    return token;
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const securePassword = async (password) => {
  try {
    const passwordHash = await bcryptjs.hash(password, 12);
    return passwordHash;
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Register Method

const register_user = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: spassword,
      mobile: req.body.mobile,
      image: req.file.filename,
      type: req.body.type,
    });
    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      return res
        .status(401)
        .send({ message: false, msg: "This email is already Exists" });
    } else {
      const user_data = await user.save();
      res.status(200).send({ message: true, data: user_data });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

// Login Method

const user_login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcryptjs.compare(password, userData.password);
      if (passwordMatch) {
        const tokenData = await create_Token(userData._id);
        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          image: userData.image,
          mobile: userData.mobile,
          type: userData.type,
          token: tokenData,
        };
        const response = {
          success: true,
          msg: "User Details",
          data: userResult,
        };
        res.status(200).send(response);
      } else {
        res
          .status(401)
          .send({ success: false, msg: "Login Details are incorrect" });
      }
    } else {
      res
        .status(401)
        .send({ success: false, msg: "Login Details are incorrect" });
    }
  } catch (error) {
    res.status(200).send(error.message);
  }
};

// Update password Method

const update_password = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const password = req.body.password;

    const data = await User.findOne({ _id: user_id });
    if (data) {
      const newPassword = await securePassword(password);
      const userData = await User.findByIdAndUpdate(
        {
          _id: user_id,
        },
        {
          $set: {
            password: newPassword,
          },
        }
      );
      res
        .status(200)
        .send({ success: true, msg: "Your password has been updated" });
    } else {
      res.status.send({ success: true, msg: "UserID not found" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const forget_password = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const randomString = randomstring.generate();
      const data = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );
      res.status(200).send({
        success: true,
        msg: "Please check your inbox of mail and reset your password",
      });
    } else {
      res
        .status(200)
        .send({ success: true, msg: "This email does not exists" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  register_user,
  user_login,
  update_password,
  forget_password,
};
