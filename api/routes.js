const express = require("express");
const router = express.Router();
const {getAll , updateList, deleteFromList} = require("./controller/controller");

router.route("/getall").get(getAll);

router.route("/post").post(updateList);

router.route("/delete").delete(deleteFromList);

module.exports = router;
