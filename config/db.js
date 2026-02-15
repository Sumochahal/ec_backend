const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo Connected collection name is ec_db");
  } catch (err) {
    console.log(err.message);
    process.exit(1); // not neccessary
  }
};

module.exports = connectDB; 