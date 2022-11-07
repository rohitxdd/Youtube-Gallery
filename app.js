require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const fetch = require("node-fetch");
const cors = require("cors");
const chalk = require("chalk");
const router = require("./api/routes")


app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use("/api", router)

const start = () => {
  const uri = "mongodb://127.0.0.1:27017/youtubeGallery";
  mongoose.connect(uri, (err) => {
    if (err) console.log(err.message);
    else {
      console.log(chalk.underline.bgGreenBright("Connected to DB!!!"));
      app.listen(process.env.PORT, () => {
        console.log(chalk.underline.bgBlue("server up :)"));
      });
    }
  });
};
start();
