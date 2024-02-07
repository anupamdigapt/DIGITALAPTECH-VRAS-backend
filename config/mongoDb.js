const mongoose = require("mongoose");

const connectionString ="mongodb+srv://" +process.env.DB_USERNAME +":" +process.env.DB_PASSWORD +"@cluster0.krihli2.mongodb.net/" +
process.env.DB_NAME +"?retryWrites=true&w=majority";

// const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.krihli2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

let option = {
  auth: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};

module.exports = () => {
  try {
    mongoose.connect(connectionString, option);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.log(err);
  }
};
