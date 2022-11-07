const List = require("../model/model");
const fetch = require("node-fetch");

const getAll = async (req, res) => {
  try {
    const dataList = await List.find({});
    if (dataList) {
      res.status(200).json(dataList);
    }
  } catch (error) {
    console.log(error);
    res.status(204).send([]);
  }
};

const updateList = async (req, res) => {
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

        await insertModel.save();

        res.status(201).send("created");
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    console.log("invalid id");
    res.status(204).send("invalid ID");
  }
};

const deleteFromList = async (req, res) => {
  const id = req.body.id;
  console.log(id);

  try {
    await List.findOneAndDelete({ _id: id });
    res.status(201).send("deleted");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAll,
  updateList,
  deleteFromList,
};
