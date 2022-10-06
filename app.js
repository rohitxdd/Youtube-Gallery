require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const fetch = require("node-fetch");

mongoose.connect("mongodb://localhost:27017/youtubeGallery", (err) => {
  if (err) console.log(err);
  else console.log("connected");
});

const listSchema = mongoose.Schema({
  videoID: {
    type: String,
    required: [true, "videoID is required"],
  },
});

const List = mongoose.model("list", listSchema);

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/getall", async (req, res) => {
  try {
    const dataList = await List.find({});
    if (dataList) {
      res.status(200).json(dataList);
    }
  } catch (error) {
    console.log(error);
    res.status(204).send([]);
  }
});

app.post("/api/post", async (req, res) => {
  const data = req.body.data;
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=id&id=${data}&key=${process.env.APIKEY}`
  );
  const validID = await response.json();
  if (
    validID.hasOwnProperty("pageInfo") &&
    validID.pageInfo.totalResults === 1
  ) {
    if (validID.items[0].kind === "youtube#video") {
      try {
        const insertModel = new List({
          videoID: data,
        });
        const result = await insertModel.save();
        res.status(201).send("created");
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    console.log("invalid id");
    res.status(204).send("invalid ID");
  }
});

app.delete("/api/delete", async (req, res) => {
  const id = req.body.id;
  console.log(id)

  try {
    await List.findOneAndDelete({ _id: id });
    res.status(201).send("deleted");
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
   console.log("server up");
});
