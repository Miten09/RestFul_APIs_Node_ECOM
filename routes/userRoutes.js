const express = require("express");
const user_route = express();

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

user_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/userImages"),
      function (error, succces) {
        if (error) throw error;
      }
    );
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name, function (error1, success1) {
      if (error1) throw error1;
    });
  },
});

const upload = multer({ storage: storage });

const user_controller = require("../controllers/userController");

user_route.post(
  "/register",
  upload.single("image"),
  user_controller.register_user
);

user_route.post("/login", user_controller.user_login);

user_route.get("/test", auth, function (req, res) {
  res.status(200).send({ success: true, msg: "Authenticated" });
});

// Update password API

user_route.post("/update-password", auth, user_controller.update_password);

// Forget Password API

user_route.post("/forget-password", user_controller.forget_password);

module.exports = user_route;
