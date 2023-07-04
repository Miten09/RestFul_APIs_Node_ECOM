const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://Miten:MiHaKrRa88@projects.hpzcfyg.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB connection established");
  });

//user Routes
const user_routes = require("./routes/userRoutes");

app.use("/api", user_routes);

// Store routes
const store_route = require("./routes/storeRoutes");

app.use("/api", store_route);

//Category Routes
const category_route = require("./routes/categoryRoutes");
app.use("/api", category_route);

//Subcategory Routes
const subcategory_route = require("./routes/subCategoryRoutes");
app.use("/api", subcategory_route);

app.listen(3000, () => {
  console.log("Server Started");
});
