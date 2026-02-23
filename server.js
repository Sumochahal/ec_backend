require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const multer = require("multer");
const errorHandler = require("./middlewares/admin/error.middleware");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();
app.get("/",(req,res)=>{
    res.send("ngrok working")
})
app.use("/uploads", express.static("uploads")); // for file upload


app.use("/api/admin", require("./routes/admin/admin.routes"));
app.use("/api/admin/category", require("./routes/admin/category.adminroutes"));
app.use("/api/admin/banners", require("./routes/admin/admin.routes")); // for banner k liye route ka base
app.use("/api/admin/subcategories",require("./routes/admin/subcategory.admin.routes")); // for subcategory
app.use("/api/user",require("./routes/user/user.routes"));
app.use("/api/home", require("./routes/user/home.routes"));// for home api fetch from category and banner data
app.use("/api/admin/products",require("./routes/admin/product.admin.routes"));  
app.use("/api/user",require("./routes/user/category.user.routes"));
// Import user product routes
app.use("/api/user/products",require("./routes/user/product.user.routes"));
// Use route

app.use(errorHandler);
app.listen(process.env.PORT || 5000, () => console.log("Server running"));



