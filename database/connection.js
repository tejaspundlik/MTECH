const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dbURI = process.env.MONGO_URI;

mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
