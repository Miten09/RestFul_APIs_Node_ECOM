const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://Miten:@projects.hpzcfyg.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB connection established");
  });

//user Routes
const user_routes = require("./routes/userRoutes");

app.use("/api", user_routes);

app.listen(3000, () => {
  console.log("Server Started");
});
